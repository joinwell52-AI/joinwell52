from pathlib import Path
import re

ROOT = Path('.')
CURRENT = ROOT / 'docs/.vitepress/theme/components/RuntimeOperationsCenterCurrent.vue'
CLASSIC = ROOT / 'docs/.vitepress/theme/components/RuntimeOperationsCenterClassic.vue'
LEGACY = ROOT / 'docs/.vitepress/theme/components/RuntimeOperationsCenterLegacy.vue'

INLINE = '''<div class="runtime-inline-date">
            <button type="button" :disabled="!props.previousDate" @click="props.previousDate && emit('selectDate', props.previousDate)">‹</button>
            <label><span class="sr-only">Runtime date</span><input type="date" :value="selectedDate" :min="props.minDate" :max="props.maxDate" @change="handleDateInput"></label>
            <button type="button" :disabled="!props.nextDate" @click="props.nextDate && emit('selectDate', props.nextDate)">›</button>
            <button v-if="props.todayDate" type="button" class="today-button" :disabled="selectedDate === props.todayDate" @click="emit('selectDate', props.todayDate)">{{ zh ? '今天' : 'Today' }}</button>
            <p v-if="props.dateError" class="runtime-date-error">{{ props.dateError }}</p>
          </div>'''

INLINE_STYLE = '''
.runtime-inline-date{position:relative;display:flex;align-items:center;gap:8px;flex-shrink:0}.runtime-inline-date button,.runtime-inline-date input{height:38px;color:var(--rt-text,var(--vp-c-text-1));background:var(--rt-card-bg,var(--vp-c-bg));border:1px solid var(--rt-line,var(--vp-c-divider));border-radius:10px;font-weight:760}.runtime-inline-date button{min-width:38px;padding:0 11px;cursor:pointer}.runtime-inline-date button:disabled{cursor:not-allowed;opacity:.38}.runtime-inline-date input{padding:0 12px;font:800 14px/1 ui-monospace,monospace}.runtime-inline-date .today-button{color:var(--rt-link,var(--vp-c-brand-1));padding:0 14px}.runtime-inline-date .runtime-date-error{position:absolute;right:0;top:100%;margin:5px 0 0;color:var(--rt-failed,#bf2f45);font-size:12px;font-weight:700;white-space:nowrap}.runtime-inline-date .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(max-width:760px){.overview-title{align-items:flex-start;flex-direction:column}.runtime-inline-date{width:100%;margin-top:12px}.runtime-inline-date label{flex:1}.runtime-inline-date input{width:100%}.runtime-inline-date .today-button{display:none}}
'''

PROPS_OLD = "const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; selectedDate?: string }>(), { lang: 'en', selectedDate: '' })"
PROPS_NEW = "const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; selectedDate?: string; previousDate?: string; nextDate?: string; minDate?: string; maxDate?: string; todayDate?: string; dateError?: string }>(), { lang: 'en', selectedDate: '', previousDate: '', nextDate: '', minDate: '', maxDate: '', todayDate: '', dateError: '' })\nconst emit = defineEmits<{ (event: 'selectDate', date: string): void; (event: 'dateInput', date: string): void }>()\nconst handleDateInput = (event: Event) => emit('dateInput', (event.target as HTMLInputElement).value)"

# Parent: keep routing/state only; remove the standalone archive strip.
text = CURRENT.read_text(encoding='utf-8')
text = re.sub(
    r"const copy = computed\(\(\) => props\.lang === 'zh' \? \{.*?\n\}\)\n\nfunction syncUrl",
    "const copy = computed(() => props.lang === 'zh' ? {\n  unavailable: '该日期没有 Runtime Record。'\n} : {\n  unavailable: 'No Runtime Record exists for that date.'\n})\n\nfunction syncUrl",
    text,
    flags=re.S,
)
parent_template = '''<template>
  <RuntimeOperationsCenterClassic
    v-if="useClassic"
    :key="`v5-${selectedDate}`"
    :lang="props.lang"
    :selected-date="selectedDate"
    :previous-date="previousDate"
    :next-date="nextDate"
    :min-date="minDate"
    :max-date="maxDate"
    :today-date="availableDateSet.has(runtime.today) ? runtime.today : ''"
    :date-error="dateError"
    @select-date="selectDate"
    @date-input="selectDate"
  />
  <RuntimeOperationsCenterLegacy
    v-else-if="useLegacy"
    :key="`legacy-${selectedDate}`"
    :lang="props.lang"
    :selected-date="selectedDate"
    :previous-date="previousDate"
    :next-date="nextDate"
    :min-date="minDate"
    :max-date="maxDate"
    :today-date="availableDateSet.has(runtime.today) ? runtime.today : ''"
    :date-error="dateError"
    @select-date="selectDate"
    @date-input="selectDate"
  />
  <div v-else class="runtime-date-empty">{{ copy.unavailable }}</div>
</template>

<style scoped>
.runtime-date-empty{padding:90px 24px;text-align:center;color:var(--vp-c-text-2)}
</style>
'''
text = text[:text.index('<template>')] + parent_template
CURRENT.write_text(text, encoding='utf-8')

# V5 overview.
text = CLASSIC.read_text(encoding='utf-8')
if PROPS_OLD not in text:
    raise SystemExit('Classic props anchor missing')
text = text.replace(PROPS_OLD, PROPS_NEW)
pattern = r'''<div class="section-title">\s*<div><span>01</span><h2>\{\{ copy\.operations \}\}</h2></div>\s*<small>\{\{ record\.date \}\} · \{\{ runtime\.timezone \}\}</small>\s*</div>'''
replacement = '<div class="section-title overview-title">\n          <div><span>01</span><h2>{{ copy.operations }}</h2></div>\n          ' + INLINE + '\n        </div>'
text, count = re.subn(pattern, replacement, text)
if count != 1:
    raise SystemExit(f'Classic overview replacement count: {count}')
text = text.rsplit('</style>', 1)[0] + INLINE_STYLE + '</style>'
CLASSIC.write_text(text, encoding='utf-8')

# V4/Legacy overview.
text = LEGACY.read_text(encoding='utf-8')
if PROPS_OLD not in text:
    raise SystemExit('Legacy props anchor missing')
text = text.replace(PROPS_OLD, PROPS_NEW)
pattern = r'''<div class="section-title"><div><span>01</span><h2>\{\{ copy\.operations \}\}</h2></div><small>\{\{ record\.date \}\} · \{\{ data\.timezone \}\}</small></div>'''
replacement = '<div class="section-title overview-title"><div><span>01</span><h2>{{ copy.operations }}</h2></div>' + INLINE + '</div>'
text, count = re.subn(pattern, replacement, text)
if count != 1:
    raise SystemExit(f'Legacy overview replacement count: {count}')
text = text.rsplit('</style>', 1)[0] + INLINE_STYLE + '</style>'
LEGACY.write_text(text, encoding='utf-8')
