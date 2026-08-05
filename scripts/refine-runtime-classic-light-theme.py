from pathlib import Path

css_path = Path('docs/.vitepress/theme/runtime-operations.css')
zh_page = Path('docs/zh/runtime/index.md')
en_page = Path('docs/en/runtime/index.md')
old_patch = Path('docs/.vitepress/theme/runtime-light-contrast.css')

css = css_path.read_text(encoding='utf-8')


def replace_once(old: str, new: str) -> None:
    global css
    count = css.count(old)
    if count != 1:
        raise SystemExit(f'Expected one CSS signature, found {count}: {old[:90]}')
    css = css.replace(old, new, 1)


def replace_all(old: str, new: str, minimum: int = 1) -> None:
    global css
    count = css.count(old)
    if count < minimum:
        raise SystemExit(f'CSS signature missing: {old[:90]}')
    css = css.replace(old, new)

# Native light palette. Dark values below remain unchanged.
replace_once('--rt-text: var(--home-ink,#0d1024);', '--rt-text:#111827;')
replace_once('--rt-copy: #555d73;', '--rt-copy:#374151;')
replace_once('--rt-muted: var(--home-muted,#61657a);', '--rt-muted:#5b6474;')
replace_once('--rt-subtle: #777d91;', '--rt-subtle:#667085;')
replace_once('--rt-line: var(--home-line,rgba(18,24,51,.12));', '--rt-line:rgba(31,36,55,.14);')
replace_once('--rt-link: #4f56c9;', '--rt-link:#4038c7;')

# Hero: explicit readable colors and larger supporting type.
replace_once(
    '.kicker{display:block;margin-bottom:14px;color:var(--rt-accent-soft);font:750 11px/1.3 ui-monospace,monospace;letter-spacing:.14em}',
    '.kicker{display:block;margin-bottom:14px;color:var(--rt-accent-soft);font:800 13px/1.35 ui-monospace,monospace;letter-spacing:.11em}'
)
replace_once(
    '.hero h1{max-width:860px;margin:0;font-size:clamp(42px,6vw,74px);line-height:1.04;letter-spacing:-.055em}',
    '.hero h1{max-width:860px;margin:0;color:var(--rt-text);-webkit-text-fill-color:var(--rt-text);font-size:clamp(42px,6vw,74px);line-height:1.04;letter-spacing:-.055em;text-shadow:none;opacity:1}'
)
replace_once(
    '.hero p{max-width:820px;margin:20px 0 0;color:var(--rt-copy);font-size:16px;line-height:1.75}',
    '.hero p{max-width:820px;margin:20px 0 0;color:var(--rt-copy);font-size:17px;line-height:1.75}'
)
replace_once('.hero-actions b{color:#d8d4ff}', '.hero-actions b{color:var(--rt-text);font-size:15px;font-weight:850}')
replace_once(
    '.hero-actions a{color:var(--rt-link);text-decoration:none;font-size:13px}',
    '.hero-actions a{color:var(--rt-link);text-decoration:none;font-size:14px;font-weight:760}'
)

# Section labels, summaries and percentages.
replace_once(
    '.section-title>div>span{color:#9487ff;font:800 11px/1 ui-monospace,monospace}',
    '.section-title>div>span{color:var(--rt-accent);font:850 13px/1 ui-monospace,monospace}'
)
replace_once('.section-title small,.section-lead{color:var(--rt-subtle)}', '.section-title small,.section-lead{color:var(--rt-muted);font-size:14px;line-height:1.5}')
replace_once(
    '.overview-grid article>span,.evidence-grid article>span{display:block;margin-bottom:12px;color:var(--rt-subtle);font-size:11px}',
    '.overview-grid article>span,.evidence-grid article>span{display:block;margin-bottom:12px;color:var(--rt-muted);font-size:13px;font-weight:700}'
)
replace_once('.overview-grid strong{display:block;font-size:20px}', '.overview-grid strong{display:block;color:var(--rt-text);font-size:22px}')
replace_once('.overview-grid strong i{color:var(--rt-subtle);font-style:normal;font-size:13px}', '.overview-grid strong i{color:var(--rt-subtle);font-style:normal;font-size:15px}')
replace_once('.overview-grid small{display:block;margin-top:8px;color:var(--rt-subtle)}', '.overview-grid small{display:block;margin-top:9px;color:var(--rt-subtle);font-size:15px;line-height:1.4}')

# Cards, badges, status and scheduled time.
replace_once(
    '.column-head span{color:var(--rt-subtle);font:700 9px/1.3 ui-monospace,monospace}',
    '.column-head span{color:var(--rt-subtle);font:750 11px/1.35 ui-monospace,monospace}'
)
replace_once('.column-head h3{margin:8px 0 0;font-size:19px}', '.column-head h3{margin:8px 0 0;color:var(--rt-text);font-size:20px}')
replace_once(
    '.column-head>b,.shift-head>b,.section-title>b,.history-list b{padding:7px 10px;border:1px solid currentColor;border-radius:999px;font:750 10px/1 ui-monospace,monospace}',
    '.column-head>b,.shift-head>b,.section-title>b,.history-list b{padding:8px 12px;background:var(--rt-card-bg);border:1px solid currentColor;border-radius:999px;font:850 12px/1 ui-monospace,monospace;letter-spacing:.025em}'
)
replace_once('.topic small{color:var(--rt-subtle)}', '.topic small{color:var(--rt-muted);font-size:13px}')
replace_once('.column-card dt{color:var(--rt-subtle);font-size:10px}', '.column-card dt{color:var(--rt-muted);font-size:12px;font-weight:700}')
replace_once('.column-card dd{margin:8px 0 0;color:var(--rt-copy);font-size:12px;line-height:1.55}', '.column-card dd{margin:8px 0 0;color:var(--rt-copy);font-size:14px;line-height:1.6}')
replace_once('.mini-metrics span{flex:1;padding:10px;background:var(--rt-card-bg);border:1px solid var(--line);border-radius:10px;color:var(--rt-subtle);font-size:9px}', '.mini-metrics span{flex:1;padding:10px;background:var(--rt-card-bg);border:1px solid var(--line);border-radius:10px;color:var(--rt-muted);font-size:11px}')
replace_once('.mini-metrics strong{display:block;margin-bottom:4px;color:var(--rt-text);font-size:16px}', '.mini-metrics strong{display:block;margin-bottom:4px;color:var(--rt-text);font-size:18px}')
replace_once(
    '.shift-head time{display:block;color:#8f80ff;font:800 12px/1 ui-monospace,monospace}',
    '.shift-head time{display:inline-flex;align-items:center;min-height:38px;padding:0 12px;color:var(--rt-accent);background:var(--rt-card-bg);border:1px solid rgba(91,87,255,.28);border-radius:11px;font:900 20px/1 ui-monospace,monospace;letter-spacing:-.02em}'
)
replace_once('.shift-head h3{margin:8px 0 0;font-size:20px}', '.shift-head h3{margin:10px 0 0;color:var(--rt-text);font-size:21px}')

# Work-result labels and evidence links.
replace_once('.result-grid span{display:block;margin-bottom:8px;color:var(--rt-subtle);font-size:10px}', '.result-grid span{display:block;margin-bottom:8px;color:var(--rt-muted);font-size:12px;font-weight:700}')
replace_once('.result-grid p{margin:0;color:var(--rt-copy);font-size:12px;line-height:1.55}', '.result-grid p{margin:0;color:var(--rt-copy);font-size:14px;line-height:1.6}')
replace_once('.metric-grid strong{display:block;font-size:18px}', '.metric-grid strong{display:block;color:var(--rt-text);font-size:19px}')
replace_once('.metric-grid span{color:var(--rt-subtle);font-size:10px}', '.metric-grid span{color:var(--rt-muted);font-size:12px}')
replace_once('.artifact-list a,.release-result a{padding:9px 11px;color:var(--rt-link);background:var(--rt-card-bg);border:1px solid var(--line);border-radius:999px;text-decoration:none;font-size:11px}', '.artifact-list a,.release-result a{padding:9px 11px;color:var(--rt-link);background:var(--rt-card-bg);border:1px solid var(--line);border-radius:999px;text-decoration:none;font-size:13px;font-weight:720}')
replace_once('.empty-state p,.release-result p{color:var(--rt-subtle);line-height:1.6}', '.empty-state p,.release-result p{color:var(--rt-copy);font-size:14px;line-height:1.65}')
replace_once('.evidence-grid strong,.evidence-grid a{color:var(--rt-text);text-decoration:none;font-size:16px}', '.evidence-grid strong,.evidence-grid a{color:var(--rt-text);text-decoration:none;font-size:17px}')
replace_once('.history-list span{color:var(--rt-link);font-size:12px}', '.history-list span{color:var(--rt-link);font-size:13px;font-weight:700}')
replace_once('.principle{margin:28px auto 0;max-width:850px;color:var(--rt-subtle);text-align:center;line-height:1.7}', '.principle{margin:28px auto 0;max-width:850px;color:var(--rt-muted);text-align:center;font-size:14px;line-height:1.7}')

# Research Intelligence Radar uses the same readable hierarchy.
replace_once(
    '.kicker{display:block;margin-bottom:13px;color:var(--rt-accent-soft);font:750 11px/1.3 ui-monospace,monospace;letter-spacing:.14em}',
    '.kicker{display:block;margin-bottom:13px;color:var(--rt-accent-soft);font:800 13px/1.35 ui-monospace,monospace;letter-spacing:.11em}'
)
replace_once('.intel-radar h2{margin:0;font-size:clamp(38px,5vw,64px);letter-spacing:-.05em}', '.intel-radar h2{margin:0;color:var(--rt-text);-webkit-text-fill-color:var(--rt-text);font-size:clamp(38px,5vw,64px);letter-spacing:-.05em}')
replace_once('.intel-radar header p{max-width:800px;margin:18px 0 0;color:var(--rt-copy);font-size:16px;line-height:1.7}', '.intel-radar header p{max-width:800px;margin:18px 0 0;color:var(--rt-copy);font-size:17px;line-height:1.7}')
replace_once('.meta b,.card-head>b{padding:7px 10px;border:1px solid currentColor;border-radius:999px;font:750 10px/1 ui-monospace,monospace}', '.meta b,.card-head>b{padding:8px 12px;background:var(--rt-card-bg);border:1px solid currentColor;border-radius:999px;font:850 12px/1 ui-monospace,monospace;letter-spacing:.025em}')
replace_once('.meta span{color:var(--rt-subtle);font-size:12px}', '.meta span{color:var(--rt-muted);font-size:13px}')
replace_once('.section-title small{color:var(--rt-subtle)}', '.section-title small{color:var(--rt-muted);font-size:14px;line-height:1.5}')
replace_once('.card-head small{color:var(--rt-subtle);font:700 9px/1.3 ui-monospace,monospace}', '.card-head small{color:var(--rt-subtle);font:750 11px/1.35 ui-monospace,monospace}')
replace_once('.coverage span,.metrics span{flex:1;padding:10px;background:var(--rt-card-bg);border:1px solid var(--line);border-radius:10px;color:var(--rt-subtle);font-size:9px}', '.coverage span,.metrics span{flex:1;padding:10px;background:var(--rt-card-bg);border:1px solid var(--line);border-radius:10px;color:var(--rt-muted);font-size:11px}')
replace_once('.coverage strong,.metrics strong{display:block;margin-bottom:4px;color:var(--rt-text);font-size:17px}', '.coverage strong,.metrics strong{display:block;margin-bottom:4px;color:var(--rt-text);font-size:18px}')
replace_once('.pipeline-grid p,.column-grid p{margin:16px 0 0;color:var(--rt-copy);font-size:12px;line-height:1.6}', '.pipeline-grid p,.column-grid p{margin:16px 0 0;color:var(--rt-copy);font-size:14px;line-height:1.65}')
replace_once('.intel-radar footer a{padding:10px 14px;color:var(--rt-link);background:var(--rt-card-bg);border:1px solid var(--line);border-radius:999px;text-decoration:none;font-size:12px;font-weight:720}', '.intel-radar footer a{padding:10px 14px;color:var(--rt-link);background:var(--rt-card-bg);border:1px solid var(--line);border-radius:999px;text-decoration:none;font-size:13px;font-weight:760}')

# Percentage is a primary operational indicator.
css = css.rstrip() + '\n.runtime-center-page .runtime-classic .overview-grid article:first-child>small{color:var(--rt-accent);font-size:17px;font-weight:900}\n'

css_path.write_text(css, encoding='utf-8')

for page in (zh_page, en_page):
    text = page.read_text(encoding='utf-8')
    text = text.replace('\n<style src="../../.vitepress/theme/runtime-light-contrast.css"></style>', '')
    page.write_text(text, encoding='utf-8')

if old_patch.exists():
    old_patch.unlink()
