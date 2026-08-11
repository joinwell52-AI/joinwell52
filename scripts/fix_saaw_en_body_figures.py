from pathlib import Path

p = Path('docs/en/industry/2026-08-10-saaw-software-as-an-agent-worker.md')
s = p.read_text(encoding='utf-8')

fig1_md = '![SaaW governance and runtime architecture: SaaW, CodeFlowMu, FCoP, and TMPA](/assets/covers/saaw-governance-stack.svg)'
if fig1_md not in s:
    needle = 'What makes it an employee is the surrounding work structure.\n\n---\n\n## 10. FCoP:'
    fig1 = '''What makes it an employee is the surrounding work structure.\n\n![SaaW governance and runtime architecture: SaaW, CodeFlowMu, FCoP, and TMPA](/assets/covers/saaw-governance-stack.svg)\n\n*Figure 1. SaaW describes the software-delivery paradigm; CodeFlowMu provides the engineering runtime; FCoP provides the lightweight coordination protocol; TMPA provides the work-fact and governance architecture.*\n\n---\n\n## 10. FCoP:'''
    if needle not in s:
        raise RuntimeError('Section 9 insertion point not found')
    s = s.replace(needle, fig1, 1)

fig2_md = '![Self-Morphing: from meta-development runtime to the digital-worker work loop](/assets/covers/saaw-self-morphing-loop.svg)'
if fig2_md not in s:
    needle = '> **Self-Morphing means that a digital-employee runtime can use its own software-development capability to construct, validate, and deploy new digital-worker forms.**\n\n```text\nMeta-Dev Runtime'
    replacement = '''> **Self-Morphing means that a digital-employee runtime can use its own software-development capability to construct, validate, and deploy new digital-worker forms.**\n\n![Self-Morphing: from meta-development runtime to the digital-worker work loop](/assets/covers/saaw-self-morphing-loop.svg)\n\n*Figure 2. The governed Self-Morphing loop brings development, validation, authorization, deployment, work execution, and work evidence into one recoverable and traceable lifecycle.*\n\n```text\nMeta-Dev Runtime'''
    if needle not in s:
        raise RuntimeError('Section 16 insertion point not found')
    s = s.replace(needle, replacement, 1)

assert s.count(fig1_md) == 1
assert s.count(fig2_md) == 1
p.write_text(s, encoding='utf-8')
