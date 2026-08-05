from pathlib import Path

root = Path('.')
current = root / 'docs/.vitepress/theme/components/RuntimeOperationsCenterCurrent.vue'
classic = root / 'docs/.vitepress/theme/components/RuntimeOperationsCenterClassic.vue'
legacy = root / 'docs/.vitepress/theme/components/RuntimeOperationsCenterLegacy.vue'

text = current.read_text(encoding='utf-8')
text = text.replace("const copy = computed(() => props.lang === 'zh' ? {\n  archive: '每日运行档案',\n  hint: '选择有 Runtime Record 的日期，整页切换当天真实工作。',\n  today: '今天',\n  unavailable: '该日期没有 Runtime Record。'\n} : {\n  archive: 'Daily Runtime Archive',\n  hint: 'Choose a date with a Runtime Record to switch the complete operations page.',\n  today: 'Today',\n  unavailable: 'No Runtime Record exists for that date.'\n})", "const copy = computed(() => props.lang === 'zh' ? {\n  unavailable: '该日期没有 Runtime Record。'\n} : {\n  unavailable: 'No Runtime Record exists for that date.'\n})")
start = text.index('<template>')
new_template = '''<template>\n  <RuntimeOperationsCenterClassic\n    v-if="useClassic"\n    :key="`v5-${selectedDate}`"\n    :lang="props.lang"\n    :selected-date="selectedDate"\n    :previous-date="previousDate"\n    :next-date="nextDate"\n    :min-date="minDate"\n    :max-date="maxDate"\n    :today-date="availableDateSet.has(runtime.today) ? runtime.today : ''"\n    :date-error="dateError"\n    @select-date="selectDate"\n    @date-input="selectDate"\n  />\n  <RuntimeOperationsCenterLegacy\n    v-else-if="useLegacy"\n    :key="`legacy-${selectedDate}`"\n    :lang="props.lang"\n    :selected-date="selectedDate"\n    :previous-date="previousDate"\n    :next-date="nextDate"\n    :min-date="minDate"\n    :max-date="maxDate"\n    :today-date="availableDateSet.has(runtime.today) ? runtime.today : ''"\n    :date-error="dateError"\n    @select-date="selectDate"\n    @date-input="selectDate"\n  />\n  <div v-else class="runtime-date-empty">{{ copy.unavailable }}</div>\n</template>\n\n<style scoped>\n.runtime-date-empty{padding:90px 24px;text-align:center;color:var(--vp-c-text-2)}\n</style>\n'''
text = text[:start] + new_template
current.write_text(text, encoding='utf-8')

inline_style = '''\n.runtime-inline-date{position:relative;display:flex;align-items:center;gap:8px;flex-shrink:0}.runtime-inline-date button,.runtime-inline-date input{height:38px;color:var(--rt-text,var(--vp-c-text-1));background:var(--rt-card-bg,var(--vp-c-bg));border:1px solid var(--rt-line,var(--vp-c-divider));border-radius:10px;font-weight:760}.runtime-inline-date button{min-width:38px;padding:0 11px;cursor:pointer}.runtime-inline-date button:disabled{cursor:not-allowed;opacity:.38}.runtime-inline-date input{padding:0 12px;font:800 14px/1 ui-monospace,monospace}.runtime-inline-date .today-button{color:var(--rt-link,var(--vp-c-brand-1));padding:0 14px}.runtime-inline-date .runtime-date-error{position:absolute;right:0;top:100%;margin:5px 0 0;color:var(--rt-failed,#bf2f45);font-size:12px;font-weight:700;white-space:nowrap}.runtime-inline-date .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(max-width:760px){.overview-title{align-items:flex-start;flex-direction:column}.runtime-inline-date{width:100%;margin-top:12px}.runtime-inline-date label{flex:1}.runtime-inline-date input{width:100%}.runtime-inline-date .today-button{display:none}}\n'''

text = classic.read_text(encoding='utf-8')
old_props = "const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; selectedDate?: string }>(), { lang: 'en', selectedDate: '' })"
new_props = "const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; selectedDate?: string; previousDate?: string; nextDate?: string; minDate?: string; maxDate?: string; todayDate?: string; dateError?: string }>(), { lang: 'en', selectedDate: '', previousDate: '', nextDate: '', minDate: '', maxDate: '', todayDate: '', dateError: '' })\nconst emit = defineEmits<{ (event: 'selectDate', date: string): void; (event: 'dateInput', date: string): void }>()\nconst handleDateInput = (event: Event) => emit('dateInput', (event.target as HTMLInputElement).value)"
if old_props not in text:
    raise SystemExit('Classic props anchor missing')
text = text.replace(old_props, new_props)
old = '<div class="section-title"><div><span>01</span><h2>{{ copy.operations }}</h2></div><small>{{ record.date }} · {{ runtime.timezone }}</small></div>'
new = '''<div class="section-title overview-title"><div><span>01</span><h2>{{ copy.operations }}</h2></div><div class="runtime-inline-date"><button type="button" :disabled="!props.previousDate" @click="props.previousDate && emit('selectDate', props.previousDate)">‹</button><label><span class="sr-only">Runtime date</span><input type="date" :value="selectedDate" :min="props.minDate" :max="props.maxDate" @change="handleDateInput"></label><button type="button" :disabled="!props.nextDate" @click="props.nextDate && emit('selectDate', props.nextDate)">›</button><button v-if="props.todayDate" type="button" class="today-button" :disabled="selectedDate === props.todayDate" @click="emit('selectDate', props.todayDate)">{{ zh ? '今天' : 'Today' }}</button><p v-if="props.dateError" class="runtime-date-error">{{ props.dateError }}</p></div></div>'''
if old not in text:
    raise SystemExit('Classic overview anchor missing')
text = text.replace(old, new)
text = text.replace('</style>', inline_style + '</style>')
classic.write_text(text, encoding='utf-8')

text = legacy.read_text(encoding='utf-8')
old_props = "const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; selectedDate?: string }>(), { lang: 'en', selectedDate: '' })"
new_props = "const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; selectedDate?: string; previousDate?: string; nextDate?: string; minDate?: string; maxDate?: string; todayDate?: string; dateError?: string }>(), { lang: 'en', selectedDate: '', previousDate: '', nextDate: '', minDate: '', maxDate: '', todayDate: '', dateError: '' })\nconst emit = defineEmits<{ (event: 'selectDate', date: string): void; (event: 'dateInput', date: string): void }>()\nconst handleDateInput = (event: Event) => emit('dateInput', (event.target as HTMLInputElement).value)"
if old_props not in text:
    raise SystemExit('Legacy props anchor missing')
text = text.replace(old_props, new_props)
old = '<div class="section-title"><div><span>01</span><h2>{{ copy.operations }}</h2></div><small>{{ record.date }} · {{ data.timezone }}</small></div>'
new = '''<div class="section-title overview-title"><div><span>01</span><h2>{{ copy.operations }}</h2></div><div class="runtime-inline-date"><button type="button" :disabled="!props.previousDate" @click="props.previousDate && emit('selectDate', props.previousDate)">‹</button><label><span class="sr-only">Runtime date</span><input type="date" :value="selectedDate" :min="props.minDate" :max="props.maxDate" @change="handleDateInput"></label><button type="button" :disabled="!props.nextDate" @click="props.nextDate && emit('selectDate', props.nextDate)">›</button><button v-if="props.todayDate" type="button" class="today-button" :disabled="selectedDate === props.todayDate" @click="emit('selectDate', props.todayDate)">{{ zh ? '今天' : 'Today' }}</button><p v-if="props.dateError" class="runtime-date-error">{{ props.dateError }}</p></div></div>'''
if old not in text:
    raise SystemExit('Legacy overview anchor missing')
text = text.replace(old, new)
text = text.replace('</style>', inline_style + '</style>')
legacy.write_text(text, encoding='utf-8')
