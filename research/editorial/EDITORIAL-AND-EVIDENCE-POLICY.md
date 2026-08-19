# Editorial & Evidence Policy V2

Effective for new automated production from 2026-08-12. Published and archived historical versions remain immutable.

## 1. Research-question-first editorial architecture

Article structure serves the research question. The system first identifies the question and evidence, forms findings, selects an article type, and then composes only the modules that add information value. `Summary`, `Source`, `Observation`, `Discussion`, `Engineering Impact`, `Future Work`, and `Conclusion` are available editorial choices, not a universal table of contents.

The extensible registry is [`EDITORIAL-ARCHITECTURE.json`](./EDITORIAL-ARCHITECTURE.json). A new type or module may be registered without changing the Daily, Weekly, Academic, or Program Runtime boundaries.

## 2. Research Independence Principle / 研究独立性原则

> External research, industry observation, and technical analysis must first reach conclusions from public evidence and the research object itself.
>
> TMPA, FCoP, CodeFlowMu, or another first-party project must not be a preset conclusion, mandatory destination, or promotional entry point.
>
> Project relevance must arise from the research result; it must not be the article's preset conclusion.

> 外部研究、行业观察和技术分析必须首先根据公开证据与研究对象本身形成结论。TMPA、FCoP、CodeFlowMu 或其他自有项目不得作为文章的预设结论、强制落点或固定宣传入口。项目相关性必须由研究结果产生，而不能成为文章预设结论。

For every non-`project-research` article, Production records one project-relevance status:

- `none` — first-party projects do not appear;
- `research-object` — a declared first-party project is the direct object of study;
- `case-evidence` — a project is used as bounded case or evidence;
- `substantive-relationship` — the findings create a specific, explained relationship to current work.

Removing TMPA, FCoP, and CodeFlowMu names from a non-project article must not collapse its core argument. Internal links never justify adding a project paragraph.

## 3. Engineering implications are general by default

Engineering analysis first addresses the affected class of systems and practices: agent systems, AI coding systems, multi-agent systems, runtimes, orchestration, governance, reliability, observability, recovery, verification, operations, and developer practice.

`Implications for Current Work` is optional. It is selected only when the evidence produces a concrete relationship, and it must name that relationship rather than merely name a project.

## 4. Publication status is not evidentiary validation

The following rules are non-equivalent and must remain explicit in both languages:

> **Publication ≠ Validation**<br>
> **Citation ≠ Endorsement**<br>
> **Peer Review ≠ Proof**<br>
> **Self-reported Evidence ≠ Independent Evidence**<br>
> **Implementation Success ≠ General Validity**

A publication, archive record, DOI, database entry, citation, or review status may establish provenance, accessibility, version identity, discoverability, or completion of a review process. It does not by itself establish that a theory is correct, generally valid, independently reproduced, or academically endorsed.

Zenodo's official documentation describes a DOI as a globally unique persistent identifier that supports permanent location, citation attribution, interlinking, and discoverability. The system therefore treats DOI and Zenodo facts as publication-state metadata, not a validation level:

- https://help.zenodo.org/docs/deposit/describe-records/reserve-doi/
- https://help.zenodo.org/docs/deposit/about-records/

`Formal Publication` remains a valid version-state label. No rule may infer `validated` from `published`.

## 5. Evidence identity and claim strength

Every material claim is assigned one identity before prose strength is chosen:

| Evidence identity | Meaning | Normal language boundary |
|---|---|---|
| `public-fact` | Directly checkable public fact | states, reports, records |
| `source-reported-claim` | A claim made by the source or vendor | claims, reports |
| `our-observation` | Research Center observation | observed, suggests |
| `our-interpretation` | Analytical inference | suggests, supports, is consistent with |
| `internal-experimental-evidence` | First-party implementation or experiment | observed in this implementation; not independent |
| `independent-evidence` | Third-party reproduction, experiment, critique, or adoption | independently observed/reported; scope still bounded |
| `hypothesis` | Testable but unconfirmed proposition | hypothesis, may, could |
| `open-question` | Unresolved question | remains unclear, requires evidence |

Internal implementation success may support feasibility for that implementation. It does not demonstrate general validity. Independent evidence must identify the independent actor and the claim actually examined.

Avoid `proves`, `validates the theory`, `confirms general validity`, `已证明`, `已验证该理论`, and `获得学术认可` unless the article states a narrowly defined proof or validation object and the cited evidence actually supports that exact strength.

## 6. Automation and original value

Automation improves discovery, organization, analysis, editing, and quality control. Publication quantity is not a success criterion.

- No SEO-driven minimum word count.
- No daily quota may override evidence gates.
- Insufficient evidence results in `No Publication`, a bounded `research-note`, or an explicit uncertainty statement.
- A release must add original analysis or substantial synthesis beyond restating sources.
- Source dates, research dates, and relevant generation/editing process information remain traceable.

This policy is aligned with Google's official people-first guidance, which asks whether content provides original research or analysis, substantial additional value, and a satisfying reader outcome; Google also warns against extensive automated production or scaled content without added value:

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- https://developers.google.com/search/docs/essentials/spam-policies

The Research Value Gate applies those principles as editorial quality controls, not as a promise of search ranking.

## 7. Weekly Research

Weekly Research is an independently readable AI Research Brief. It asks:

```text
What materially changed this week?
→ How are the changes connected?
→ What evidence and disputes remain?
→ What judgment is supportable?
→ What remains unresolved?
```

It must not concatenate Daily articles. `Implications for Current Work` is optional and uses the same independence rule as every other external article.

## 8. Research Center and Community Editions

The Research Center Edition is the complete evidence-bearing parent article. A Community Edition is a separate editorial output selected only when a professional community has a real discussion angle.

A Community Edition must declare its target community, new title, selected angle, evidence subset, engineering or architectural significance, and a discussion question. It is not a full copy, generic summary, or advertisement. A first-party project may appear as a bounded case or evidence only when relevant to that angle.

## 9. Pre-publication gates

Research Center 技术文章还必须完整执行 [`COMMUNITY-TECHNICAL-WRITING-STANDARD.md`](./COMMUNITY-TECHNICAL-WRITING-STANDARD.md)。该标准覆盖选题可理解性、第一屏读者价值、术语解释、端到端责任链、理论/协议/实现/验证分账、用户建议核验、双语同步与视觉门禁。

Every V2 candidate records `PASS` for:

1. **Research Value** — clear question, original information/analysis/synthesis, value without prior project familiarity;
2. **Independence** — no preset first-party destination and a valid deletion test for non-project research;
3. **Evidence** — facts sourced, inference labeled, internal and independent evidence separated, no publication-to-validation or implementation-to-generality leap;
4. **Structure** — modules serve the content, no empty template sections, and an open ending is allowed;
5. **Language** — accurate title, consistent terminology, no unnecessary language mixing, calibrated claim strength;
6. **Bilingual Consistency** — the Chinese and English claims preserve the same identity, strength, uncertainty, and conclusion boundary.

Production owns content repair. Publication only releases a complete candidate and must return failures upstream.
