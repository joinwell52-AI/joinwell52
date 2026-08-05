from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

record_path = Path("research/runtime/records/daily/2026/08/2026-08-05-daily-runtime.json")
plan_path = Path("research/runtime/plans/2026/08/2026-08-05-plan.json")
record = json.loads(record_path.read_text(encoding="utf-8"))
plan = json.loads(plan_path.read_text(encoding="utf-8"))

if record.get("date") != "2026-08-05" or plan.get("date") != "2026-08-05":
    raise SystemExit("same-day record/plan requirement failed")
if record.get("taskStatus", {}).get("queue") != "Completed" or plan.get("status") != "Completed":
    raise SystemExit("Queue is incomplete")
selected = [item for item in plan.get("columns", []) if item.get("selectionStatus") == "Selected"]
selected_ids = [item.get("itemId") for item in selected]
expected_ids = ["Q-20260805-12", "Q-20260805-13", "Q-20260805-14"]
if selected_ids != expected_ids:
    raise SystemExit(f"unexpected Selected set: {selected_ids}")

completed_at = datetime.now(ZoneInfo("Asia/Shanghai")).isoformat(timespec="seconds")
reading_metrics = [
    {"label": "Selected objects consumed", "label_zh": "已消费 Selected 对象", "value": "3"},
    {"label": "Reading Results", "label_zh": "Reading Result 数量", "value": "3"},
    {"label": "Primary or official source objects", "label_zh": "主要或官方来源对象", "value": "13"},
    {"label": "Explicit limitations recorded", "label_zh": "已记录明确限制", "value": "21"},
    {"label": "Contradictions or qualifications", "label_zh": "矛盾或限定条件", "value": "10"},
    {"label": "Analysis artifacts", "label_zh": "分析成果", "value": "0"},
    {"label": "Article drafts", "label_zh": "文章草稿", "value": "0"},
]
reading_evidence = [
    {"label": "Scheduler V3.0", "label_zh": "Scheduler V3.0", "source": "research/runtime/SCHEDULER.json"},
    {"label": "Today's Research Plan", "label_zh": "今日研究计划", "source": "research/runtime/plans/2026/08/2026-08-05-plan.json"},
    {"label": "Skill 03 Deep Reading", "label_zh": "Skill 03 深度阅读", "source": "research/skills/03-deep-reading.md"},
    {"label": "Microsoft Universal Verifier research", "label_zh": "Microsoft Universal Verifier 研究", "source": "https://www.microsoft.com/en-us/research/publication/the-art-of-building-verifiers-for-computer-use-agents/"},
    {"label": "Cursor Router official changelog", "label_zh": "Cursor Router 官方更新日志", "source": "https://cursor.com/changelog/router"},
    {"label": "OpenAI Agents Python guardrail-ordering commit", "label_zh": "OpenAI Agents Python 门禁顺序提交", "source": "https://github.com/openai/openai-agents-python/commit/69e26269f52a1fde684154376d77e5a21b507c19"},
]
reading_artifacts = [
    {"label": "Digital Employee Reading Result", "label_zh": "数字员工 Reading Result", "path": "research/reading/Q-20260805-12-verifiable-completion.md"},
    {"label": "Industry Architecture Reading Result", "label_zh": "行业架构 Reading Result", "path": "research/reading/Q-20260805-13-governed-model-routing.md"},
    {"label": "Open-source Engineering Reading Result", "label_zh": "开源工程 Reading Result", "path": "research/reading/Q-20260805-14-guardrail-session-ordering.md"},
    {"label": "Verified Reading start-state commit", "label_zh": "已验证的 Reading 启动状态提交", "commit": "e0b03392bf760a147532b08820680a2e51f1053f"},
]

record["taskStatus"]["reading"] = "Completed"
record["results"]["reading"] = {
    "schema": "runtime-shift-result/v2",
    "task": "reading",
    "status": "Completed",
    "input": "The three same-day Selected objects in Today's Research Plan: Q-20260805-12, Q-20260805-13 and Q-20260805-14, together with their complete primary and authoritative source packages.",
    "input_zh": "今日研究计划中三个同日 Selected 对象：Q-20260805-12、Q-20260805-13 与 Q-20260805-14，以及各自完整的主要与权威来源包。",
    "workResult": "Executed Skill 03 only. Completed source-complete Deep Reading for all three selected column objects; extracted facts, vendor claims or research results, mechanisms, measurements, limitations, contradictions, unresolved questions and source traceability. Three durable Reading Records were produced. No Research Analysis or article drafting was performed.",
    "workResult_zh": "仅执行 Skill 03。已对三个栏目选中对象完成来源完整的深度阅读，提取事实、厂商主张或研究结果、机制、测量、限制、矛盾、未决问题及来源可追溯性，并生成三份持久化 Reading Record。未执行 Research Analysis，也未撰写文章。",
    "output": "Three Reading Results: Universal Verifier completion evidence and benchmark limits; Cursor Router's disclosed routing and governance surface plus undocumented policy and fallback behavior; and the exact OpenAI Agents Python persistence branches around output guardrails, interruption and resume.",
    "output_zh": "三份 Reading Result：Universal Verifier 的完成证据机制与基准限制；Cursor Router 已披露的路由与治理表面及未公开的策略与回退行为；以及 OpenAI Agents Python 围绕输出门禁、中断和恢复的精确持久化分支。",
    "next": "The 13:00 Research Runtime Analysis shift may consume only these three Reading Results to perform comparison, judgment and implication mapping. The Reading shift makes no adoption decision.",
    "next_zh": "13:00 Research Runtime Analysis 只能消费这三份 Reading Result，执行比较、判断与影响映射；Reading 班次不作采用决策。",
    "metrics": reading_metrics,
    "evidence": reading_evidence,
    "artifacts": reading_artifacts,
}

if not any(item.get("task") == "reading" and item.get("event") == "Reading Completed" for item in record.get("timeline", [])):
    record.setdefault("timeline", []).append({
        "time": completed_at,
        "task": "reading",
        "event": "Reading Completed",
        "status": "Completed",
        "detail": "Skill 03 completed for all three same-day Selected objects; three durable Reading Results were persisted without Research Analysis or article drafting.",
    })

existing_metric_labels = {item.get("label") for item in record.setdefault("metrics", [])}
record["metrics"].extend(item for item in reading_metrics if item["label"] not in existing_metric_labels)
existing_evidence = {item.get("source") for item in record.setdefault("evidence", [])}
record["evidence"].extend(item for item in reading_evidence if item["source"] not in existing_evidence)
existing_artifacts = {(item.get("path"), item.get("commit")) for item in record.setdefault("artifacts", [])}
record["artifacts"].extend(item for item in reading_artifacts if (item.get("path"), item.get("commit")) not in existing_artifacts)

record["githubCommit"] = "pending"
record["commitVerify"] = "Running"
record["updatedAt"] = completed_at
record_path.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(completed_at)
