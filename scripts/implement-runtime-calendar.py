from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'expected block not found in {path.relative_to(ROOT)}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


classic = ROOT / 'docs/.vitepress/theme/components/RuntimeOperationsCenterClassic.vue'
replace_once(
    classic,
    """type IntelligenceData = {\n  currentRun: { date: string; status: Status; columns: Column[] }\n}\n""",
    """type IntelligenceRun = { date: string; status: Status; columns: Column[] }\ntype IntelligenceData = {\n  currentRun: IntelligenceRun\n  runs?: Record<string, IntelligenceRun>\n}\n"""
)
replace_once(
    classic,
    """const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })\nconst zh = computed(() => props.lang === 'zh')\nconst liveRecord = ref<RecordItem | null>(null)\nconst record = computed(() => liveRecord.value || runtime.todayDaily)\n""",
    """const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; selectedDate?: string }>(), { lang: 'en', selectedDate: '' })\nconst zh = computed(() => props.lang === 'zh')\nconst selectedDate = computed(() => props.selectedDate || runtime.today)\nconst isToday = computed(() => selectedDate.value === runtime.today)\nconst liveRecord = ref<RecordItem | null>(null)\nconst staticRecord = computed(() => (runtime.records?.daily || []).find((item) => item.date === selectedDate.value)\n  || (runtime.todayDaily.date === selectedDate.value ? runtime.todayDaily : runtime.todayDaily))\nconst record = computed(() => isToday.value && liveRecord.value ? liveRecord.value : staticRecord.value)\n"""
)
replace_once(
    classic,
    """const refreshLiveRecord = async () => {\n  if (typeof window === 'undefined') return\n  const [year, month] = runtime.today.split('-')\n  const path = `research/runtime/records/daily/${year}/${month}/${runtime.today}-daily-runtime.json`\n""",
    """const refreshLiveRecord = async () => {\n  if (typeof window === 'undefined' || !isToday.value) return\n  const [year, month] = selectedDate.value.split('-')\n  const path = `research/runtime/records/daily/${year}/${month}/${selectedDate.value}-daily-runtime.json`\n"""
)
replace_once(
    classic,
    """    if (next.date === runtime.today) liveRecord.value = next\n""",
    """    if (next.date === selectedDate.value) liveRecord.value = next\n"""
)
replace_once(
    classic,
    """const scheduleLiveRefresh = () => {\n  if (typeof document === 'undefined') return\n""",
    """const scheduleLiveRefresh = () => {\n  if (typeof document === 'undefined' || !isToday.value) return\n"""
)
replace_once(
    classic,
    """const handleVisibilityChange = () => {\n  if (typeof document === 'undefined') return\n""",
    """const handleVisibilityChange = () => {\n  if (typeof document === 'undefined' || !isToday.value) return\n"""
)
replace_once(
    classic,
    """onMounted(() => {\n  void refreshLiveRecord().finally(scheduleLiveRefresh)\n  document.addEventListener('visibilitychange', handleVisibilityChange)\n})\n""",
    """onMounted(() => {\n  if (isToday.value) {\n    void refreshLiveRecord().finally(scheduleLiveRefresh)\n    document.addEventListener('visibilitychange', handleVisibilityChange)\n  }\n})\n"""
)
replace_once(
    classic,
    """const columns = computed(() => intelligence.currentRun.columns || [])\n""",
    """const columns = computed(() => intelligence.runs?.[selectedDate.value]?.columns\n  || (intelligence.currentRun.date === selectedDate.value ? intelligence.currentRun.columns : [])\n  || [])\n"""
)
replace_once(
    classic,
    """          <small>{{ runtime.today }} · {{ runtime.timezone }}</small>\n""",
    """          <small>{{ record.date }} · {{ runtime.timezone }}</small>\n"""
)

legacy = ROOT / 'docs/.vitepress/theme/components/RuntimeOperationsCenterLegacy.vue'
replace_once(
    legacy,
    """const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })\nconst zh = computed(() => props.lang === 'zh')\nconst record = computed(() => data.current)\n""",
    """const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; selectedDate?: string }>(), { lang: 'en', selectedDate: '' })\nconst zh = computed(() => props.lang === 'zh')\nconst record = computed(() => data.records.find((item) => item.date === props.selectedDate) || data.current)\n"""
)
