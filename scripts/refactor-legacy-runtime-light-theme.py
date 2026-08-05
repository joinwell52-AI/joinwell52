from pathlib import Path
import re

component = Path('docs/.vitepress/theme/components/RuntimeOperationsCenterLegacy.vue')
zh_page = Path('docs/zh/runtime/index.md')
en_page = Path('docs/en/runtime/index.md')
old_patch = Path('docs/.vitepress/theme/runtime-light-contrast.css')

text = component.read_text(encoding='utf-8')
if '<main v-if="record" class="legacy-runtime">' not in text:
    raise SystemExit('Legacy Runtime component signature missing')

css = r'''<style scoped>
.legacy-runtime {
  --page-bg:
    radial-gradient(circle at 76% 0%, rgba(101, 87, 255, .09), transparent 31%),
    radial-gradient(circle at 12% 24%, rgba(56, 199, 232, .07), transparent 26%),
    linear-gradient(180deg, #fafbfe 0%, #f3f5fa 100%);
  --panel-bg: linear-gradient(145deg, rgba(255,255,255,.99), rgba(248,249,253,.98));
  --card-bg: #fff;
  --card-soft: #f7f8fc;
  --card-outcome: #eef1ff;
  --line: rgba(31, 36, 55, .14);
  --text: #111827;
  --copy: #374151;
  --muted: #5b6474;
  --subtle: #667085;
  --accent: #5b57ff;
  --accent-soft: #5548df;
  --link: #4038c7;
  --track: #e5e8f2;
  --chip-bg: rgba(255,255,255,.82);
  --waiting: #6957d8;
  --running: #087f9f;
  --completed: #087a55;
  --blocked: #a65c00;
  --failed: #bf2f45;
  --skipped: #667085;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  min-height: 100vh;
  color: var(--text);
  background: var(--page-bg);
}

:global(.dark) .legacy-runtime {
  --page-bg:
    radial-gradient(circle at 75% 0%, rgba(88,72,210,.2), transparent 32%),
    linear-gradient(180deg, #060812, #080b18);
  --panel-bg: linear-gradient(145deg, rgba(18,25,46,.98), rgba(8,12,26,.97));
  --card-bg: #080d1c;
  --card-soft: rgba(5,9,21,.62);
  --card-outcome: #151c35;
  --line: rgba(148,163,184,.2);
  --text: #f5f7ff;
  --copy: #c2cad8;
  --muted: #94a0b7;
  --subtle: #7f8ca2;
  --accent: #8f80ff;
  --accent-soft: #bdb5ff;
  --link: #a9deff;
  --track: #202941;
  --chip-bg: rgba(8,13,28,.82);
  --waiting: #c4b5fd;
  --running: #72d6ff;
  --completed: #77e5a7;
  --blocked: #f8c56a;
  --failed: #fca5a5;
  --skipped: #a2acbd;
}

.shell { width: min(1280px, calc(100% - 52px)); margin: auto; padding: 54px 0 84px; }
.hero { display: flex; justify-content: space-between; align-items: flex-end; gap: 36px; padding: 34px; background: var(--panel-bg); border: 1px solid var(--line); border-radius: 24px; box-shadow: 0 18px 50px rgba(31,36,55,.06); }
.kicker { display: block; margin-bottom: 14px; color: var(--accent-soft); font: 800 13px/1.35 ui-monospace, monospace; letter-spacing: .11em; }
.hero h1 { max-width: 860px; margin: 0; color: var(--text); font-size: clamp(42px, 6vw, 74px); line-height: 1.04; letter-spacing: -.055em; }
.hero p { max-width: 820px; margin: 20px 0 0; color: var(--copy); font-size: 17px; line-height: 1.75; }
.hero-actions { display: flex; min-width: 260px; flex-direction: column; gap: 12px; align-items: flex-end; }
.hero-actions b { color: var(--text); font-size: 15px; font-weight: 850; }
.hero-actions a { color: var(--link); text-decoration: none; font-size: 14px; font-weight: 760; }

.panel { margin-top: 16px; padding: 26px; background: var(--panel-bg); border: 1px solid var(--line); border-radius: 20px; box-shadow: 0 14px 38px rgba(31,36,55,.045); }
.section-title { display: flex; justify-content: space-between; align-items: center; gap: 18px; margin-bottom: 20px; }
.section-title > div { display: flex; align-items: center; gap: 12px; }
.section-title > div > span { color: var(--accent); font: 850 13px/1 ui-monospace, monospace; }
.section-title h2 { margin: 0; color: var(--text); font-size: 24px; }
.section-title small { color: var(--muted); font-size: 14px; line-height: 1.5; }

.overview-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.overview-grid article, .evidence-grid article { padding: 18px; background: var(--card-bg); border: 1px solid var(--line); border-radius: 15px; }
.overview-grid span, .evidence-grid span { display: block; margin-bottom: 12px; color: var(--muted); font-size: 13px; font-weight: 700; }
.overview-grid strong { display: block; color: var(--text); font-size: 22px; }
.overview-grid i { color: var(--subtle); font-style: normal; font-size: 15px; }
.overview-grid small { display: block; margin-top: 9px; color: var(--subtle); font-size: 15px; line-height: 1.4; }
.overview-grid article:first-child > small { color: var(--accent); font-size: 17px; font-weight: 900; }
.bar { height: 7px; margin-top: 14px; overflow: hidden; background: var(--track); border-radius: 999px; }
.bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--running)); }

.column-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.column-grid article { padding: 20px; background: var(--card-soft); border: 1px solid var(--line); border-radius: 17px; }
.card-head, .shift-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.card-head small { color: var(--subtle); font: 750 11px/1.35 ui-monospace, monospace; }
.card-head h3 { margin: 8px 0 0; color: var(--text); font-size: 20px; }
.card-head > b, .shift-head > b, .section-title > b, .history-list b { padding: 8px 12px; background: var(--chip-bg); border: 1px solid currentColor; border-radius: 999px; font-size: 12px; font-weight: 850; letter-spacing: .025em; }
.column-grid h4 { margin: 20px 0 10px; color: var(--text); font-size: 18px; line-height: 1.45; }
.column-grid p { color: var(--copy); font-size: 15px; line-height: 1.65; }

.shift-list { display: grid; gap: 12px; }
.shift-card { padding: 20px; background: var(--card-bg); border: 1px solid var(--line); border-radius: 17px; }
.shift-head time { display: inline-flex; min-height: 38px; align-items: center; padding: 0 12px; color: var(--accent); background: var(--card-soft); border: 1px solid rgba(91,87,255,.26); border-radius: 11px; font: 900 20px/1 ui-monospace, monospace; letter-spacing: -.02em; }
.shift-head h3 { margin: 10px 0 0; color: var(--text); font-size: 21px; }
.result-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 16px; }
.result-grid > div { padding: 14px; background: var(--card-soft); border: 1px solid var(--line); border-radius: 12px; }
.result-grid .outcome { background: var(--card-outcome); }
.result-grid span { display: block; margin-bottom: 8px; color: var(--muted); font-size: 12px; font-weight: 750; }
.result-grid p { margin: 0; color: var(--copy); font-size: 14px; line-height: 1.6; }
.metric-grid { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 12px; }
.metric-grid > div { padding: 11px 13px; background: var(--card-soft); border: 1px solid var(--line); border-radius: 10px; }
.metric-grid strong { display: block; color: var(--text); font-size: 18px; }
.metric-grid span { color: var(--muted); font-size: 12px; }
.links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.links a, .contract a { color: var(--link); text-decoration: none; font-size: 13px; font-weight: 720; }
.contract { margin-top: 16px; color: var(--copy); font-size: 14px; line-height: 1.65; }

.production-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.focus strong { color: var(--text); font-size: 18px; }
.focus p, .empty { color: var(--copy); font-size: 14px; line-height: 1.65; }
.evidence-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.evidence-grid strong, .evidence-grid a { color: var(--text); font-size: 17px; }
.evidence-grid a { color: var(--link); }
.history-list { display: grid; gap: 9px; }
.history-list a { display: grid; grid-template-columns: 1fr auto auto auto; align-items: center; gap: 14px; padding: 14px 16px; color: var(--text); text-decoration: none; background: var(--card-bg); border: 1px solid var(--line); border-radius: 13px; }
.history-list span, .history-list small { color: var(--muted); font-size: 13px; }

.s-waiting { color: var(--waiting) !important; }
.s-running { color: var(--running) !important; }
.s-completed { color: var(--completed) !important; }
.s-blocked { color: var(--blocked) !important; }
.s-failed { color: var(--failed) !important; }
.s-skipped { color: var(--skipped) !important; }

@media (max-width: 900px) {
  .overview-grid, .result-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .column-grid, .production-grid { grid-template-columns: 1fr; }
  .hero { align-items: flex-start; flex-direction: column; }
  .hero-actions { align-items: flex-start; }
}
@media (max-width: 620px) {
  .shell { width: calc(100% - 28px); padding: 28px 0 60px; }
  .hero, .panel { padding: 20px; }
  .hero h1 { font-size: 42px; }
  .overview-grid, .result-grid, .evidence-grid { grid-template-columns: 1fr; }
  .history-list a { grid-template-columns: 1fr auto; }
  .history-list small { grid-column: 1 / -1; }
  .section-title small { font-size: 13px; }
}
</style>'''

updated, count = re.subn(r'<style scoped>.*?</style>\s*$', css, text, flags=re.S)
if count != 1:
    raise SystemExit(f'Expected one scoped style block, found {count}')
component.write_text(updated + '\n', encoding='utf-8')

for page in (zh_page, en_page):
    page_text = page.read_text(encoding='utf-8')
    page_text = page_text.replace('\n<style src="../../.vitepress/theme/runtime-light-contrast.css"></style>', '')
    page.write_text(page_text, encoding='utf-8')

if old_patch.exists():
    old_patch.unlink()
