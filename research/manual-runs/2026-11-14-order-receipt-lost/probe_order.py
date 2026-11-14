"""Reproduce a lost order receipt with isolated child processes and SQLite.

This is a research fixture, not CodeFlowMu or a live business integration.
"""
import json
import os
import sqlite3
import subprocess
import sys
import tempfile
from pathlib import Path


def connect(path):
    db = sqlite3.connect(path)
    db.execute("CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, operation_key TEXT, item TEXT)")
    db.execute("CREATE UNIQUE INDEX IF NOT EXISTS by_operation ON orders(operation_key)")
    db.execute("CREATE TABLE IF NOT EXISTS receipts (operation_key TEXT PRIMARY KEY, order_id INTEGER)")
    db.commit()
    return db


def child(path, key, stop, keyed):
    db = connect(path)
    if stop == "before_commit":
        os._exit(72)
    db.execute("INSERT OR IGNORE INTO orders(operation_key,item) VALUES (?,?)", (key if keyed else None, "sample"))
    db.commit()
    order_id = db.execute(
        "SELECT id FROM orders WHERE operation_key=?" if keyed else "SELECT MAX(id) FROM orders",
        (key,) if keyed else (),
    ).fetchone()[0]
    if stop == "after_commit_before_response":
        os._exit(73)
    if stop == "after_response_before_receipt":
        os._exit(74)
    db.execute("INSERT OR REPLACE INTO receipts VALUES (?,?)", (key, order_id))
    db.commit()


def run_child(path, key, stop, keyed):
    return subprocess.run([sys.executable, __file__, "child", str(path), key, stop, str(int(keyed))], check=False).returncode


def count(db):
    return db.execute("SELECT COUNT(*) FROM orders").fetchone()[0]


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "child":
        child(Path(sys.argv[2]), sys.argv[3], sys.argv[4], bool(int(sys.argv[5])))
        return
    result = []
    with tempfile.TemporaryDirectory(prefix="order-receipt-") as temp:
        root = Path(temp)
        for stop in ("before_commit", "after_commit_before_response", "after_response_before_receipt"):
            path = root / (stop + ".sqlite")
            key = "order-1"
            exit_code = run_child(path, key, stop, True)
            db = connect(path)
            before = count(db)
            receipt = db.execute("SELECT order_id FROM receipts WHERE operation_key=?", (key,)).fetchone()
            decision = "retry_after_authoritative_absence" if before == 0 else "settle_from_business_record"
            if before == 0:
                run_child(path, key, "none", True)
            result.append(dict(stop=stop, exit_code=exit_code, orders_before=before,
                               local_receipt=bool(receipt), decision=decision, orders_after=count(db)))
            db.close()
        path = root / "blind-retry.sqlite"
        first_exit = run_child(path, "order-2", "after_commit_before_response", False)
        second_exit = run_child(path, "order-2", "none", False)
        db = connect(path)
        negative = dict(first_exit=first_exit, second_exit=second_exit, orders=count(db))
        db.close()
    print(json.dumps(dict(cases=result, unkeyed_blind_retry=negative), indent=2))


if __name__ == "__main__":
    main()
