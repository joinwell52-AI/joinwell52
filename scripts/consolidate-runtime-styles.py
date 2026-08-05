from pathlib import Path
import re

root = Path('.')
runtime_path = root / 'docs/.vitepress/theme/components/RuntimeOperationsCenterClassic.vue'
radar_path = root / 'docs/.vitepress/theme/components/ResearchIntelligenceRadar.vue'
zh_path = root / 'docs/zh/runtime/index.md'
en_path = root / 'docs/en/runtime/index.md'
old_css = root / 'docs/.vitepress/theme/runtime-bilingual-title.css'
new_css = root / 'docs/.vitepress/theme/runtime-operations.css'


def extract_style(path: Path) -> str:
    text = path.read_text(encoding='utf-8')
    match = re.search(r'\n<style scoped>\n(?P<css>.*)\n</style>\s*$', text, re.S)
    if not match:
        raise SystemExit(f'scoped style block not found: {path}')
    css = match.group('css')
    path.write_text(text[:match.start()] + '\n', encoding='utf-8')
    return css


runtime_css = extract_style(runtime_path)
radar_css = extract_style(radar_path)

runtime_root = ".runtime-classic{--bg:#070914;--panel:#10162a;--line:rgba(148,163,184,.2);--text:#f5f7ff;--muted:#94a0b7;--accent:#8f80ff;--blue:#72d6ff;--green:#77e5a7;position:relative;width:100vw;margin-left:calc(50% - 50vw);min-height:100vh;color:var(--text);background:radial-gradient(circle at 75% 0%,rgba(88,72,210,.2),transparent 32%),linear-gradient(180deg,#060812,#080b18)}"
runtime_root_new = ".runtime-classic{--line:var(--rt-line);--text:var(--rt-text);--muted:var(--rt-muted);--accent:var(--rt-accent);--blue:var(--rt-running);--green:var(--rt-completed);position:relative;width:100vw;margin-left:calc(50% - 50vw);min-height:100vh;color:var(--rt-text);background:var(--rt-page-bg)}"
if runtime_root not in runtime_css:
    raise SystemExit('runtime root signature changed')
runtime_css = runtime_css.replace(runtime_root, runtime_root_new, 1)

radar_root = ".intel-radar{--bg:#070914;--panel:#10162a;--line:rgba(148,163,184,.2);--text:#f5f7ff;--muted:#94a0b7;--accent:#8f80ff;--blue:#72d6ff;--green:#77e5a7;position:relative;width:100vw;margin-left:calc(50% - 50vw);color:var(--text);background:linear-gradient(180deg,#060812,#080b18);border-top:1px solid var(--line)}"
radar_root_new = ".intel-radar{--line:var(--rt-line);--text:var(--rt-text);--muted:var(--rt-muted);--accent:var(--rt-accent);--blue:var(--rt-running);--green:var(--rt-completed);position:relative;width:100vw;margin-left:calc(50% - 50vw);color:var(--rt-text);background:var(--rt-page-bg);border-top:1px solid var(--rt-line)}"
if radar_root not in radar_css:
    raise SystemExit('radar root signature changed')
radar_css = radar_css.replace(radar_root, radar_root_new, 1)

replacements = {
    'linear-gradient(145deg,rgba(18,25,46,.98),rgba(8,12,26,.97))': 'var(--rt-panel-bg)',
    'rgba(5,9,21,.62)': 'var(--rt-card-soft)',
    '#080d1c': 'var(--rt-card-bg)',
    '#0a1020': 'var(--rt-card-bg)',
    '#121b35': 'var(--rt-card-accent)',
    '#202941': 'var(--rt-progress-track)',
    '#f5f7ff': 'var(--rt-text)',
    '#e9e7ff': 'var(--rt-text)',
    '#b5bfd1': 'var(--rt-copy)',
    '#b2bdd0': 'var(--rt-copy)',
    '#96a2b6': 'var(--rt-copy)',
    '#94a0b7': 'var(--rt-muted)',
    '#7f8ca2': 'var(--rt-subtle)',
    '#748198': 'var(--rt-subtle)',
    '#8f9bb0': 'var(--rt-subtle)',
    '#a5b0c3': 'var(--rt-copy)',
    '#78849a': 'var(--rt-subtle)',
    '#77849a': 'var(--rt-subtle)',
    '#cbc6ff': 'var(--rt-link)',
    '#9cb9df': 'var(--rt-link)',
    '#a9deff': 'var(--rt-link)',
    '#bdb5ff': 'var(--rt-accent-soft)',
    'rgba(148,163,184,.2)': 'var(--rt-line)',
}
for old, new in replacements.items():
    runtime_css = runtime_css.replace(old, new)
    radar_css = radar_css.replace(old, new)

status_old = ".s-waiting{color:#c4b5fd!important}.s-running{color:var(--blue)!important}.s-completed{color:var(--green)!important}.s-blocked{color:#f8c56a!important}.s-failed{color:#fca5a5!important}.s-skipped{color:#a2acbd!important}"
status_new = ".s-waiting{color:var(--rt-waiting)}.s-running{color:var(--rt-running)}.s-completed{color:var(--rt-completed)}.s-blocked{color:var(--rt-blocked)}.s-failed{color:var(--rt-failed)}.s-skipped{color:var(--rt-skipped)}"
if status_old not in runtime_css or status_old not in radar_css:
    raise SystemExit('status signature changed')
runtime_css = runtime_css.replace(status_old, status_new)
radar_css = radar_css.replace(status_old, status_new)

theme = r'''/* Research Runtime Center and Research Intelligence Radar share one theme. */
.runtime-center-page {
  --rt-page-bg:
    radial-gradient(circle at 76% 0%, rgba(101,87,255,.09), transparent 31%),
    radial-gradient(circle at 12% 24%, rgba(56,199,232,.07), transparent 26%),
    linear-gradient(180deg,#fafbfe 0%,#f3f5fa 100%);
  --rt-panel-bg: linear-gradient(145deg,rgba(255,255,255,.99),rgba(248,249,253,.98));
  --rt-card-bg: #fff;
  --rt-card-soft: #f6f7fb;
  --rt-card-accent: #eef1ff;
  --rt-progress-track: rgba(101,87,255,.13);
  --rt-text: var(--home-ink,#0d1024);
  --rt-copy: #555d73;
  --rt-muted: var(--home-muted,#61657a);
  --rt-subtle: #777d91;
  --rt-line: var(--home-line,rgba(18,24,51,.12));
  --rt-accent: var(--home-purple,#6557ff);
  --rt-accent-soft: #6557ff;
  --rt-link: #4f56c9;
  --rt-waiting: #6957d8;
  --rt-running: #087f9f;
  --rt-completed: #087a55;
  --rt-blocked: #a65c00;
  --rt-failed: #bf2f45;
  --rt-skipped: #667085;
  background: var(--vp-c-bg);
}
.dark .runtime-center-page {
  --rt-page-bg:
    radial-gradient(circle at 75% 0%,rgba(88,72,210,.20),transparent 32%),
    linear-gradient(180deg,#060812,#080b18);
  --rt-panel-bg: linear-gradient(145deg,rgba(18,25,46,.98),rgba(8,12,26,.97));
  --rt-card-bg: #080d1c;
  --rt-card-soft: rgba(5,9,21,.62);
  --rt-card-accent: #121b35;
  --rt-progress-track: #202941;
  --rt-text: #f5f7ff;
  --rt-copy: #b2bdd0;
  --rt-muted: #94a0b7;
  --rt-subtle: #7f8ca2;
  --rt-line: rgba(148,163,184,.20);
  --rt-accent: #8f80ff;
  --rt-accent-soft: #bdb5ff;
  --rt-link: #a9deff;
  --rt-waiting: #c4b5fd;
  --rt-running: #72d6ff;
  --rt-completed: #77e5a7;
  --rt-blocked: #f8c56a;
  --rt-failed: #fca5a5;
  --rt-skipped: #a2acbd;
}
.runtime-center-page .VPContent,
.runtime-center-page .VPHome { background: var(--vp-c-bg); }
'''

enhancement = r'''
/* Shared visual hierarchy: status, progress and scheduled time. */
.runtime-center-page :is(.column-head>b,.shift-head>b,.section-title>b,.history-list b,.meta b,.card-head>b) {
  font-weight: 850;
  letter-spacing: .035em;
  background: color-mix(in srgb,currentColor 11%,transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb,currentColor 12%,transparent);
}
.runtime-center-page :is(.overview-grid strong,.meta b).s-running {
  color: var(--rt-running);
  font-weight: 900;
  text-shadow: 0 0 18px color-mix(in srgb,var(--rt-running) 22%,transparent);
}
.runtime-center-page .progress-card>small {
  color: var(--rt-accent-soft);
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -.02em;
}
.runtime-center-page .shift-head time {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 12px;
  color: var(--rt-accent);
  background: color-mix(in srgb,var(--rt-accent) 10%,var(--rt-card-bg));
  border: 1px solid color-mix(in srgb,var(--rt-accent) 28%,var(--rt-line));
  border-radius: 11px;
  box-shadow: 0 8px 22px color-mix(in srgb,var(--rt-accent) 10%,transparent);
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -.025em;
}
.runtime-center-page .shift-head h3 {
  margin-top: 10px;
  font-weight: 850;
}
'''

new_css.write_text(theme + '\n' + runtime_css + '\n\n' + radar_css + '\n' + enhancement, encoding='utf-8')

for page in (zh_path, en_path):
    text = page.read_text(encoding='utf-8')
    text = text.replace('runtime-bilingual-title.css', 'runtime-operations.css')
    if 'runtime-operations.css' not in text:
        raise SystemExit(f'new stylesheet import missing: {page}')
    page.write_text(text, encoding='utf-8')

if old_css.exists():
    old_css.unlink()

for path in (runtime_path, radar_path):
    if '<style' in path.read_text(encoding='utf-8'):
        raise SystemExit(f'component style remains: {path}')
