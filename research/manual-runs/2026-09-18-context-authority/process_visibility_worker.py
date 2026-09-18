"""Synthetic child used to compare command-line, environment, and stdin transport."""
import argparse
import os
import sys
import time

parser = argparse.ArgumentParser()
parser.add_argument("--mode", choices=["argv", "env", "stdin"], required=True)
parser.add_argument("--token")
args = parser.parse_args()
value = args.token if args.mode == "argv" else (os.environ.get("SYNTHETIC_RUN_TOKEN") if args.mode == "env" else sys.stdin.readline().rstrip("\n"))
print("ready" if value else "missing", flush=True)
time.sleep(20)

