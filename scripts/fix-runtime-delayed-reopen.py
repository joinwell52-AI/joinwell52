from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
RECORD = ROOT / 'research/runtime/records/daily/2026/08/2026-08-05-daily-runtime.json'


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'Expected block not found in {path.relative_to(ROOT)}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


def record_at(commit: str) -> dict:
    content = subprocess.check_output(
        ['git', 'show', f'{commit}:research/runtime/records/daily/2026/08/2026-08-05-daily-runtime.json'],
        cwd=ROOT,
        text=True
    )
    return json.loads(content)


runtime = ROOT / 'scripts/runtime-v5.mjs'
replace_once(
    runtime,
    """function appendScheduledEvent(record, task, now) {\n  const currentStatus = record.taskStatus?.[task.id] || 'Waiting'\n  const duplicate = currentStatus === 'Running' && record.timeline.some((entry) =>\n""",
    """function appendScheduledEvent(record, task, now) {\n  const currentStatus = record.taskStatus?.[task.id] || 'Waiting'\n  if (TERMINAL.has(currentStatus) && record.results?.[task.id]) {\n    return false\n  }\n  const duplicate = currentStatus === 'Running' && record.timeline.some((entry) =>\n"""
)
replace_once(
    runtime,
    """  record.updatedAt = `${now.date}T${now.time}+08:00`\n}\n""",
    """  record.updatedAt = `${now.date}T${now.time}+08:00`\n  return true\n}\n"""
)
replace_once(
    runtime,
    """  for (const task of tasks) {\n    const { path, record } = ensureRecord(manifest, task.family, now.date)\n    appendScheduledEvent(record, task, now)\n    writeJson(path, record)\n    paths.push(slash(path))\n  }\n""",
    """  for (const task of tasks) {\n    const { path, record } = ensureRecord(manifest, task.family, now.date)\n    const changed = appendScheduledEvent(record, task, now)\n    if (changed) writeJson(path, record)\n    else console.log(`${task.name} is already terminal for ${now.date}; delayed or duplicate scheduling cannot reopen it.`)\n    paths.push(slash(path))\n  }\n"""
)

current = json.loads(RECORD.read_text(encoding='utf-8'))
queue_verified = record_at('2cd722da2e1553b66af9f46bc9bd0324dcefdb96')
reading_verified = record_at('c87783214681c8cfb95164952ab85cf45e480390')

current['taskStatus']['queue'] = 'Completed'
current['results']['queue'] = queue_verified['results']['queue']
current['taskStatus']['reading'] = 'Completed'
current['results']['reading'] = reading_verified['results']['reading']
current['timeline'] = [
    entry for entry in current.get('timeline', [])
    if not (
        (entry.get('task') == 'queue' and entry.get('time') == '2026-08-05T12:49:35+08:00')
        or (entry.get('task') == 'reading' and entry.get('time') == '2026-08-05T13:40:13+08:00')
    )
]
current['status'] = 'Running'
current['githubCommit'] = 'pending'
current['commitVerify'] = 'Waiting'
valid_times = [entry.get('time', '') for entry in current.get('timeline', []) if entry.get('time')]
current['updatedAt'] = max(valid_times) if valid_times else current.get('updatedAt', '')
RECORD.write_text(json.dumps(current, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
