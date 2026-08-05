from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'Expected block not found in {path.relative_to(ROOT)}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


# 1. Keep generated V5 readable ledgers out of the legacy-current projection.
legacy = ROOT / 'scripts/runtime-legacy-compat.mjs'
replace_once(
    legacy,
    """const legacyRecords = walk(RUNTIME_ROOT)\n  .filter((path) => /research[\\\\/]runtime[\\\\/]\\d{4}[\\\\/]\\d{2}[\\\\/]\\d{4}-\\d{2}-\\d{2}-runtime\\.md$/.test(path))\n  .map(parseMarkdownRecord)\n  .map(recordFrom)\n""",
    """const legacyRecords = walk(RUNTIME_ROOT)\n  .filter((path) => /research[\\\\/]runtime[\\\\/]\\d{4}[\\\\/]\\d{2}[\\\\/]\\d{4}-\\d{2}-\\d{2}-runtime\\.md$/.test(path))\n  .map(parseMarkdownRecord)\n  .filter(({ data }) => data.schema !== 'research-runtime-readable-record/v2' && data.runtime_version !== '5.0')\n  .map(recordFrom)\n"""
)

# 2. Merge frozen Markdown history into the current V5 Classic history list.
component = ROOT / 'docs/.vitepress/theme/components/RuntimeOperationsCenterClassic.vue'
replace_once(
    component,
    """import runtimeData from '../../generated/runtime-records.json'\nimport intelligenceData from '../../generated/research-intelligence.json'\n""",
    """import runtimeData from '../../generated/runtime-records.json'\nimport intelligenceData from '../../generated/research-intelligence.json'\nimport legacyData from '../../generated/runtime-legacy-records.json'\n"""
)
replace_once(
    component,
    """type IntelligenceData = {\n  currentRun: { date: string; status: Status; columns: Column[] }\n}\n\nconst runtime = runtimeData as RuntimeData\nconst intelligence = intelligenceData as IntelligenceData\n""",
    """type IntelligenceData = {\n  currentRun: { date: string; status: Status; columns: Column[] }\n}\ntype LegacyHistoryData = {\n  records: Array<{ date: string; status: Status }>\n}\ntype HistoryItem = { date: string; status: Status }\n\nconst runtime = runtimeData as RuntimeData\nconst intelligence = intelligenceData as IntelligenceData\nconst legacyHistory = legacyData as LegacyHistoryData\n"""
)
replace_once(
    component,
    """const history = computed(() => {\n  const current = record.value\n  return [current, ...(runtime.records?.daily || []).filter((item) => item.date !== current.date)]\n    .sort((a, b) => b.date.localeCompare(a.date))\n    .slice(0, 7)\n})\n""",
    """const history = computed<HistoryItem[]>(() => {\n  const current = record.value\n  const currentV5History = (runtime.records?.daily || [])\n    .filter((item) => item.date !== current.date && item.date >= '2026-08-05')\n    .map((item) => ({ date: item.date, status: item.status }))\n  const frozenMarkdownHistory = (legacyHistory.records || [])\n    .filter((item) => item.date !== current.date && item.date < '2026-08-05')\n    .map((item) => ({ date: item.date, status: item.status }))\n\n  return [{ date: current.date, status: current.status }, ...currentV5History, ...frozenMarkdownHistory]\n    .filter((item, index, items) => items.findIndex((candidate) => candidate.date === item.date) === index)\n    .sort((a, b) => b.date.localeCompare(a.date))\n    .slice(0, 7)\n})\n"""
)
replace_once(
    component,
    """const recordPath = (item: RecordItem) => {\n""",
    """const recordPath = (item: { date: string }) => {\n"""
)
replace_once(
    component,
    """const recordUrl = (item: RecordItem) => `https://github.com/joinwell52-AI/joinwell52/blob/main/${recordPath(item)}`\n""",
    """const recordUrl = (item: { date: string }) => `https://github.com/joinwell52-AI/joinwell52/blob/main/${recordPath(item)}`\n"""
)

# 3. Enforce high contrast for the fixed dark three-column cards and dark-mode wordmark.
palette = ROOT / 'docs/.vitepress/theme/column-palette-final.css'
text = palette.read_text(encoding='utf-8')
marker = '/* Runtime V5 final contrast and dark wordmark repair. */'
if marker not in text:
    text += """

/* Runtime V5 final contrast and dark wordmark repair. */
.runtime-center-page .runtime-classic .column-grid > .column-card {
  color: #f8fafc !important;
}

.runtime-center-page .runtime-classic .column-grid > .column-card .topic small,
.runtime-center-page .runtime-classic .column-grid > .column-card dt {
  color: #cbd5e1 !important;
  -webkit-text-fill-color: #cbd5e1 !important;
  opacity: 1 !important;
}

.runtime-center-page .runtime-classic .column-grid > .column-card dd {
  color: #e2e8f0 !important;
  -webkit-text-fill-color: #e2e8f0 !important;
  opacity: 1 !important;
}

.runtime-center-page .runtime-classic .column-grid > .column-card .column-head > b {
  color: #67e8f9 !important;
  -webkit-text-fill-color: #67e8f9 !important;
  background: rgba(5, 12, 28, .58) !important;
  border-color: rgba(103, 232, 249, .72) !important;
}

.runtime-center-page .runtime-classic .column-digital-employee .column-head span,
.runtime-center-page .runtime-classic .column-digital-employee .column-head h3,
.runtime-center-page .runtime-classic .column-digital-employee .topic h4 {
  color: #dedaff !important;
  -webkit-text-fill-color: #dedaff !important;
}

.runtime-center-page .runtime-classic .column-industry-architecture .column-head span,
.runtime-center-page .runtime-classic .column-industry-architecture .column-head h3,
.runtime-center-page .runtime-classic .column-industry-architecture .topic h4 {
  color: #b5f1f5 !important;
  -webkit-text-fill-color: #b5f1f5 !important;
}

.runtime-center-page .runtime-classic .column-open-source-engineering .column-head span,
.runtime-center-page .runtime-classic .column-open-source-engineering .column-head h3,
.runtime-center-page .runtime-classic .column-open-source-engineering .topic h4 {
  color: #c5f7fb !important;
  -webkit-text-fill-color: #c5f7fb !important;
}

.runtime-center-page .runtime-classic .column-grid > .column-card .mini-metrics span {
  color: #334155 !important;
  -webkit-text-fill-color: #334155 !important;
  background: #ffffff !important;
  border-color: rgba(15, 23, 42, .12) !important;
  opacity: 1 !important;
}

.runtime-center-page .runtime-classic .column-grid > .column-card .mini-metrics strong {
  color: #0f172a !important;
  -webkit-text-fill-color: #0f172a !important;
}

html.dark[lang='zh-CN'] .VPNavBarTitle .title span::before {
  background: linear-gradient(105deg, #ffffff 0%, #dbe4f0 42%, #b6adff 74%, #67e8f9 100%) !important;
  background-clip: text !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  filter: drop-shadow(0 3px 9px rgba(115, 102, 255, .22)) !important;
}

html.dark[lang='zh-CN'] .VPNavBarTitle .title::after {
  color: #aab5ca !important;
  -webkit-text-fill-color: #aab5ca !important;
}
"""
    palette.write_text(text, encoding='utf-8')
