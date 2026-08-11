from pathlib import Path
import re

p = Path('docs/en/industry/2026-08-10-saaw-software-as-an-agent-worker.md')
s = p.read_text(encoding='utf-8')

# Frontmatter: align editorial meaning with the current Chinese mother edition.
s = s.replace(
    'summary: "A 23-section manifesto deriving SaaW from Governance, TMPA, FCoP, Agent PC, CodeFlowMu, Self-Morphing, and the Digital Employee Runtime."',
    'summary: "A 23-section manifesto deriving SaaW from governance, TMPA, FCoP, Agent PC, CodeFlowMu, and Self-Morphing, anchored in Research Report Production Engine V1.3 and explicitly separating validated capabilities from research frontiers."'
)
s = s.replace(
    'evidence_status: "Architecture-grounded"',
    'evidence_status: "Architecture-grounded + production-engine reference implementation"'
)

# Move publication / evidence metadata from the opening to the footer, matching the Chinese layout.
top_meta = '''> **Author / Publisher:** joinwell52 Research Center / CodeFlowMu Core Team  
> **Architecture:** TMPA Architecture Paper — TMPA-ARCH-A0.9  
> **Normative Standard:** TMPA Core Specification — S0.6  
> **Implementation Case:** TMPA Implementation Case Report — I0.8  
> **Engineering Vehicle:** CodeFlowMu / FCoP

'''
s = s.replace(top_meta, '', 1)

# Replace the abstract explanation with the concrete day-in-the-life timeline from the Chinese mother edition.
start = s.index('### A Day in the Life of Research Report Production Engine V1.3')
end = s.index('\n\n---\n\n## 9. CodeFlowMu:', start)
workday = '''### A Day in the Life of a Digital Researcher: Research Report Production Engine V1.3

There is no need to invent a fictional job. The **Research Report Production Engine V1.3** already gives us a real, observable example of a digital researcher at work.

**09:00 · Research Discovery**  
The digital researcher starts the day by scanning new research signals, engineering changes, and open questions, deciding what deserves attention.  
**Output: Signal Pool.**

**10:00 · Research Queue**  
It selects the research object that should actually move forward that day, sets priority, and decides what the day's research will focus on. It does not turn every signal into an article.  
**Output: Today's Research Plan.**

**11:00 · Research Reading**  
It reads papers, specifications, engineering records, code, test results, and existing material around the selected object, organizes usable evidence, and records what is still missing.  
**Output: Reading Result.**

**13:00 · Research Analysis**  
It turns the morning's material into judgments: which facts hold, which statements remain inference, where disagreement exists, what the boundary conditions are, and what research conclusion should be formed next.  
**Output: Research Object.**

**15:00 · Research Production**  
The digital researcher turns the research object into a formal work product: structuring the article, drafting the report, checking evidence, and adding required diagrams or visualizations until a publishable candidate exists.  
**Output: Publication Candidate.**

**20:00 · Formal Publication**  
Once the candidate satisfies publication conditions, it enters the formal release path: GitHub write, website generation, commit verification, and release confirmation. If an action requires accountable human authority, the work stops at that authority boundary and waits for a human decision.  
**Output: formally published research result.**

```text
09:00 Research Discovery   → Signal Pool
10:00 Research Queue       → Today's Research Plan
11:00 Research Reading     → Reading Result
13:00 Research Analysis    → Research Object
15:00 Research Production  → Publication Candidate
20:00 Formal Publication   → GitHub + Website + Commit Verify + Release
```

That is a day in the life of a digital researcher: **it is not answering one question; it is continuously performing a research job under a defined role and work rhythm.**
'''
s = s[:start] + workday + s[end:]

# Section 9: restore the same in-article architecture figure used by the Chinese mother edition.
fig1 = '''![SaaW governance and runtime architecture: SaaW, CodeFlowMu, FCoP, and TMPA](/assets/covers/saaw-governance-stack.svg)

*Figure 1. SaaW describes the software-delivery paradigm; CodeFlowMu provides the engineering runtime; FCoP provides the lightweight coordination protocol; TMPA provides the work-fact and governance architecture.*

'''
needle = 'What makes it an employee is the surrounding work structure.\n\n---\n\n## 10. FCoP:'
if needle in s and '/assets/covers/saaw-governance-stack.svg' not in s:
    s = s.replace(needle, 'What makes it an employee is the surrounding work structure.\n\n' + fig1 + '---\n\n## 10. FCoP:', 1)

# Section 15 title: mirror the explanatory title of the Chinese mother edition.
s = s.replace('## 15. Digital Employee Package\n', '## 15. Digital Employee Package: Making Digital Employees Engineerable Products\n', 1)

# Real engineering anchor: use the same vertical production chain as the Chinese mother edition.
s = s.replace('''```text
Research Question → Research Object → Evidence / Reading → Analysis
                  → Report → Evidence Gate → Visualization
                  → Human Authorization → Publication
```''', '''```text
Research Question
        ↓
Research Object
        ↓
Evidence / Reading
        ↓
Analysis
        ↓
Report
        ↓
Evidence Gate
        ↓
Visualization
        ↓
Human Authorization
        ↓
Publication
```''', 1)

# Section 16: restore the same figure and explicit Finance / Contract examples as the Chinese mother edition.
fig2 = '''![Self-Morphing: from meta-development runtime to the digital-worker work loop](/assets/covers/saaw-self-morphing-loop.svg)

*Figure 2. The governed Self-Morphing loop brings development, validation, authorization, deployment, work execution, and work evidence into one recoverable and traceable lifecycle.*

'''
self_def = '> **Self-Morphing means that a digital-employee runtime can use its own software-development capability to construct, validate, and deploy new digital-worker forms.**\n\n'
if self_def in s and '/assets/covers/saaw-self-morphing-loop.svg' not in s:
    s = s.replace(self_def, self_def + fig2, 1)

summary_examples = 'A development team may produce a Finance Worker Package containing Invoice, ERP Entry, Compliance, and Archive Agents, or a Contract Worker Package containing Risk Analysis, Signing, Compliance, and Archive Agents.'
expanded_examples = '''For example:

```text
PM / DEV / QA / OPS
        │
        │ develops
        ▼
Finance Worker Package
        │
        ▼
Invoice Agent
ERP Entry Agent
Compliance Agent
Archive Agent
```

Or:

```text
PM / DEV / QA / OPS
        │
        ▼
Contract Worker Package
        │
        ▼
Risk Analysis Agent
Signing Agent
Compliance Agent
Archive Agent
```'''
s = s.replace(summary_examples, expanded_examples, 1)

# Section 23: align capability-boundary headings and the final infrastructure statement.
s = s.replace('### What Exists Today\n', '### Validated (Today)\n', 1)
s = s.replace('### What Comes Next\n', '### Under Exploration (Next)\n', 1)
s = s.replace(
    '> **Software infrastructure capable of developing, running, governing, and continuously evolving digital employees.**',
    '> **Software infrastructure capable of developing, running, governing, recovering, and continuously evolving digital employees.**',
    1
)

# Replace the old English footer with the same publication-information block position as Chinese.
old_footer = '''**joinwell52 Research Center**  
**CodeFlowMu Core Team**

**TMPA Architecture Paper A0.9 · TMPA Core Specification S0.6 · TMPA Implementation Case Report I0.8 · CodeFlowMu / FCoP**

> **V1.1 scope note:**'''
new_footer = '''> **Author / Publisher:** joinwell52 Research Center / CodeFlowMu Core Team  
> **Architecture and Theory:** TMPA Architecture Paper — TMPA-ARCH-A0.9  
> **Normative Standard:** TMPA Core Specification — S0.6  
> **Implementation Case:** TMPA Implementation Case Report — I0.8  
> **Core Engineering Vehicle:** CodeFlowMu / FCoP

> **V1.1 scope note:**'''
if old_footer not in s:
    raise RuntimeError('Expected old English footer not found')
s = s.replace(old_footer, new_footer, 1)

# Structural and editorial invariants: English must now mirror the current Chinese mother edition.
sections = re.findall(r'^##\s+(\d+)\.', s, flags=re.M)
if sections != [str(i) for i in range(1, 24)]:
    raise RuntimeError(f'Unexpected 23-section structure: {sections}')
required = [
    '### A Day in the Life of a Digital Researcher: Research Report Production Engine V1.3',
    '09:00 · Research Discovery',
    '20:00 · Formal Publication',
    '/assets/covers/saaw-governance-stack.svg',
    '### A Real Engineering Anchor: The SaaW Manifesto Is Part of the Case',
    '/assets/covers/saaw-self-morphing-loop.svg',
    'Finance Worker Package',
    'Contract Worker Package',
    '### Validated (Today)',
    '### Under Exploration (Next)',
    '> **Author / Publisher:** joinwell52 Research Center / CodeFlowMu Core Team',
]
for item in required:
    if item not in s:
        raise RuntimeError(f'Missing synchronized marker: {item}')
if s.count('> **Author / Publisher:**') != 1:
    raise RuntimeError('Publication metadata must appear exactly once, at the footer')

p.write_text(s, encoding='utf-8')
