from pathlib import Path

en = Path('docs/en/industry/2026-08-10-saaw-software-as-an-agent-worker.md')
s = en.read_text(encoding='utf-8')

patches = [
    (
        'It is a Governance State problem.\n\n> **No governance, no employee.**',
        'It is a Governance State problem.\n\nIf these questions have no answers, an Agent cannot realistically assume job responsibility.\n\n> **No governance, no employee.**'
    ),
    (
        'Which report happened first is less important than their causal relationship to the same Task and the Review that depends on them.\n\n---',
        'Which report happened first is less important than their causal relationship to the same Task and the Review that depends on them.\n\nThis is closer to how real organizations actually work.\n\n---'
    ),
    (
        'conflicting_review\n```\n\nEnterprises do not need mythical AI that never fails.',
        'conflicting_review\n```\n\nThis is an important SaaW capability.\n\nEnterprises do not need mythical AI that never fails.'
    ),
]
for old, new in patches:
    if old not in s:
        raise SystemExit(f'missing expected English errata target: {old[:80]}')
    s = s.replace(old, new, 1)

en.write_text(s, encoding='utf-8')

for path in [
    Path('docs/zh/industry/2026-08-10-saaw-software-as-an-agent-worker.md'),
    Path('docs/en/industry/2026-08-10-saaw-software-as-an-agent-worker.md'),
]:
    t = path.read_text(encoding='utf-8')
    old = '/assets/covers/03-saaw-self-morphing-loop-fixed.png'
    new = '/assets/covers/03-saaw-self-morphing-loop-fixed-v2.png'
    if old not in t:
        raise SystemExit(f'missing old figure-2 reference in {path}')
    t = t.replace(old, new)
    path.write_text(t, encoding='utf-8')
