# Reading Record — Q-20260806-02 Managed policy, sandbox and resume boundaries in enterprise coding-agent runtimes

- **Queue item:** `Q-20260806-02`
- **Column:** Industry Architecture
- **Selection status:** Selected
- **Priority:** P0
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-06 (Asia/Shanghai)
- **Primary source class:** Official product release and official security, settings, permissions and marketplace documentation

## Reading scope

This pass reads Claude Code v2.1.223 and the corresponding official documentation as evidence about enterprise policy distribution, permission enforcement, sandbox containment, model fallback disclosure and session recovery. Release-note statements are retained as vendor claims unless directly established by the documented configuration contract. No Research Analysis, architecture recommendation or article drafting is performed.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - Enterprise coding agents combine organization policy, machine settings, project configuration, tool permissions, sandbox enforcement, subagent model selection and resumable sessions.
    - A control can appear in documentation yet fail at a specific enforcement point, allowing lower-level execution paths to bypass the intended organizational boundary.
    - The selected question is what control-plane surfaces and failure boundaries are exposed when policy, sandbox, fallback and resume behavior are changed together in one official release.

  facts:
    - Claude Code v2.1.223 was published as an official release on 2026-08-06.
    - The release adds owner wildcard entries such as owner/* for strictKnownMarketplaces and blockedMarketplaces.
    - The release adds warnings when workflow agents, forked skills, slash commands or resumed background agents request a restricted subagent model and execution falls back to the parent model.
    - The release states that it fixed a crafted Bash permission bypass and a separate issue in which tabs or invisible Unicode could hide command parts from permission prompts.
    - The release states that dynamic import() in workflow scripts could run outside the workflow sandbox and was fixed.
    - The release states that an agent definition using bypassPermissions could ignore an organization policy disabling bypass mode and was fixed.
    - The release states that resumed sessions could return empty after a mid-session /cd and that resumed forked background agents could become stuck.
    - Official settings documentation gives managed settings the highest precedence and describes strictKnownMarketplaces as a managed-only control checked before marketplace network or filesystem access.
    - Official permissions documentation distinguishes tool permission rules from the operating-system sandbox: permissions cover tools generally, while sandbox enforcement applies to Bash and child processes.

  vendor_claims:
    - Each item labeled fixed in the release is an Anthropic claim about the corrected implementation; the release does not provide an independent exploit reproduction, CVE record or external verification result.
    - The documentation claims that managed settings cannot be overridden by user or project configuration and that marketplace restrictions are enforced before download or filesystem access.
    - The sandbox documentation presents permissions and sandboxing as defense in depth and describes filesystem and network isolation when sandboxing is available.

  mechanisms:
    - Configuration precedence places server-managed settings above MDM or operating-system managed settings, managed files and lower-precedence user or project settings.
    - strictKnownMarketplaces and blockedMarketplaces constrain marketplace identity and are intended to be evaluated before add, install, update, refresh or automatic-update operations retrieve content.
    - permissions.disableBypassPermissionsMode is the organization-level switch intended to prevent bypass-permission operation, including agent definitions that request bypassPermissions.
    - The operating-system sandbox controls filesystem and network access for shell execution and child processes, while tool permission rules provide a separate allow, ask or deny policy surface.
    - Restricted subagent-model fallback is disclosed to the operator when the requested model cannot be used and the parent model is substituted.
    - Resume behavior depends on preserving working-directory and background-agent state across session restoration; the release addresses multiple paths where that state was lost or stalled.

  evidence:
    - The release groups policy-distribution features and fixes across marketplace rules, permission prompt integrity, sandbox boundaries, bypass enforcement, model substitution and resume recovery.
    - The official settings reference documents exact precedence and the managed-only status of strictKnownMarketplaces.
    - The official marketplace documentation states that organization restrictions apply before marketplace content is downloaded.
    - The official permissions documentation names disableBypassPermissionsMode and explains the scope of bypass mode.
    - The official sandbox documentation identifies filesystem and network isolation, platform availability and the optional failIfUnavailable behavior.

  limitations:
    - Release notes are vendor-authored and do not disclose affected-version ranges, exploitability conditions, regression-test details or a platform-by-platform validation matrix.
    - No independent security advisory or reproduction was found in the selected source package for the permission or sandbox bypass fixes.
    - Current documentation may have evolved after v2.1.223; it is normative evidence for the documented control surface, not proof of the exact internal implementation at release time.
    - A fallback warning improves observability but does not establish that the substituted parent model has equivalent capability, cost, policy or data-handling properties.
    - The source set does not define one unified transaction or audit model spanning managed settings, permission prompts, sandbox decisions, model fallback and resumed-session recovery.
    - The release does not quantify incident reduction, policy-evaluation latency, sandbox escape probability, recovery success rate or enterprise operational cost.

  comparisons:
    - Policy distribution specifies intended precedence, while permission and sandbox fixes reveal that enforcement must also be correct at each execution path; configuration authority alone is insufficient.
    - Permission prompts are user-facing decision controls, whereas the OS sandbox is a lower-level containment mechanism; the release demonstrates why both are needed.
    - Model fallback disclosure is an observability control, not the same as blocking an unauthorized model or proving equivalence of the substituted model.
    - Session resume is a continuity mechanism, but it also creates a governance requirement to restore the same directory, agent, model and policy context rather than only the conversation text.

  contradictions:
    - The documentation describes organization-managed settings as highest-precedence and non-overridable, yet the release acknowledges that bypassPermissions in an agent definition could ignore the organization bypass-disable policy before the fix.
    - The sandbox documentation describes workflow isolation, while the release acknowledges a dynamic import() path that executed outside the workflow sandbox before the fix.
    - A warning that fallback occurred makes substitution visible, but it does not resolve whether fallback should have been permitted or whether downstream evidence remains comparable.

  unresolved_questions:
    - Which policy decisions are evaluated centrally, which are cached locally, and how is policy version provenance attached to each execution?
    - How are conflicts between server-managed, machine-managed and local managed settings surfaced and audited?
    - Does model fallback require explicit authorization when the parent model has different residency, cost, capability or safety properties?
    - What state is considered authoritative when a session resumes after directory changes, background work or partial tool execution?
    - How are sandbox-denied operations, unavailable sandbox implementations and fail-open or fail-closed decisions recorded durably?
    - What regression suite proves that every agent, workflow, skill, slash-command and resume path passes through the same policy enforcement points?
```

## Source traceability

1. Official release: `https://github.com/anthropics/claude-code/releases/tag/v2.1.223`
2. Claude Code settings documentation: `https://docs.anthropic.com/en/docs/claude-code/settings`
3. Claude Code permissions documentation: `https://docs.anthropic.com/en/docs/claude-code/iam`
4. Claude Code sandboxing documentation: `https://docs.anthropic.com/en/docs/claude-code/sandboxing`
5. Claude Code plugin marketplace documentation: `https://docs.anthropic.com/en/docs/claude-code/plugin-marketplaces`
6. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-06-plan.json`
7. Skill 03: `research/skills/03-deep-reading.md`

## Reading gate decision

**Result:** Deep Reading completed. The official source package establishes the named control surfaces and vendor-reported fixes while preserving the lack of independent validation and unified audit semantics. No Research Analysis, architecture recommendation or article was produced.
