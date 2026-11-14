"""Seven authored acceptance cases; deterministic baseline, no model calls."""
import json


CASES = [
    dict(id="K7", actual_orders=1, requested=("A-11", "B-22"), delivered=("A-11", "B-22"),
         current_evidence=True, publication_authorized=True, accepted=True),
    dict(id="P2", actual_orders=1, requested=("A-11", "B-22"), delivered=("A-11",),
         current_evidence=True, publication_authorized=True, accepted=False),
    dict(id="R4", actual_orders=1, requested=("A-11", "B-22"), delivered=("A-11", "B-22"),
         current_evidence=False, publication_authorized=True, accepted=False),
    dict(id="T9", actual_orders=1, requested=("A-11", "B-22"), delivered=("A-11", "B-22"),
         current_evidence=True, publication_authorized=False, accepted=False),
    dict(id="L3", actual_orders=2, requested=("A-11", "B-22"), delivered=("A-11", "B-22"),
         current_evidence=True, publication_authorized=True, accepted=False),
    dict(id="V6", actual_orders=0, requested=("A-11", "B-22"), delivered=("A-11", "B-22"),
         current_evidence=True, publication_authorized=True, accepted=False),
    dict(id="M8", actual_orders=1, requested=("A-11", "B-22"), delivered=("A-11", "B-23"),
         current_evidence=True, publication_authorized=True, accepted=False),
]


def main():
    rows = []
    for case in CASES:
        # All executor reports say "completed successfully". The scripted
        # baseline trusts that claim; it is not a model self-evaluation.
        report_accept = True
        rule_accept = (case["actual_orders"] == 1 and len(case["delivered"]) == 2
                       and case["current_evidence"] and case["publication_authorized"])
        rows.append(dict(id=case["id"], fixed_label=case["accepted"],
                         report_accept=report_accept, rule_accept=rule_accept))
    result = dict(cases=rows,
                  report_false_accepts=sum(x["report_accept"] and not x["fixed_label"] for x in rows),
                  rules_false_accepts=sum(x["rule_accept"] and not x["fixed_label"] for x in rows),
                  rules_false_rejects=sum(not x["rule_accept"] and x["fixed_label"] for x in rows),
                  rules_passed_ids=[x["id"] for x in rows if x["rule_accept"]])
    assert result["report_false_accepts"] == 6
    assert result["rules_false_accepts"] == 1
    assert result["rules_false_rejects"] == 0
    assert result["rules_passed_ids"] == ["K7", "M8"]
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
