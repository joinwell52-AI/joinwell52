---
title: "Trust to Run Is Not Authority to Inherit Secrets"
date: '2026-08-21'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When repository- or plugin-supplied configuration can execute a helper, how should an engineering runtime separate authority to execute code from authority to inherit ambient credentials and other host capabilities?"
summary: "Workspace trust can authorize repository-controlled helper execution without granting the helper every credential inherited by the parent process. Claude Code v2.1.238 material exposes the value—and the limits—of that two-gate design."
sources:
  - research/analysis/Q-20260821-03-execution-trust-secret-authority-separation.md
item_id: "Q-20260821-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-21-trust-run-not-inherit-secrets-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-21-trust-run-not-inherit-secrets-cover-v2.png"
  kicker="Open-source Engineering · Daily Research"
  title="Trust to Run Is Not Authority to Inherit Secrets"
  summary="Workspace trust can authorize repository-controlled helper execution without granting the helper every credential inherited by the parent process. Claude Code v2.1.238 material exposes the value—and the limits—of that two-gate design."
  version="Q-20260821-03"
  status="Daily Runtime V5 · 2026-08-21"
  languageHref="/zh/engineering/2026-08-21-trust-run-not-inherit-secrets"
  languageLabel="中文"
/>

# Trust to Run Is Not Authority to Inherit Secrets

An MCP `headersHelper` looks like a configuration field, but its value is a shell command. The command runs at connection time, emits JSON and can create authentication headers. When a repository, plugin or agent file supplies that helper, loading configuration crosses a code-execution boundary. Once execution is allowed, the child process may also inherit credentials from the runtime that launched it. Those are two different grants.

Claude Code v2.1.238 release material documents controls on both sides. Project `.mcp.json` helpers and inline MCP servers in project or `--add-dir` agent files require the relevant folder trust to be accepted, including under `claude -p`. The same notes state that project, plugin and agent-file `headersHelper` commands run without inherited credential environment variables. Official MCP documentation independently establishes that the helper is shell execution whose output becomes connection headers and that purpose-specific variables such as server name and URL are available.

The engineering rule is simple but consequential: **trust to execute repository-controlled code is not authority to inherit ambient secrets.**

## Executable configuration is code

Project `.mcp.json` is designed to be shared in version control. That makes it useful for reproducible setup, but it also means a cloned repository can propose executable behavior. A trust gate asks whether code from this folder may run. The current documentation explicitly says project or local `headersHelper` execution waits for workspace trust, and a cloned repository cannot approve its own project servers while the folder remains untrusted.

This is code admission, not a benign-code certificate. A user can trust a repository that later changes, and a trusted helper can still contain malicious or overly broad shell logic. Trust state is therefore evidence for one decision: the runtime may cross from parsing configuration into executing the declared helper.

The origin matters as well. Project files, plugins, user configuration and managed settings have different ownership and review paths. Recording source, canonical path, trust state and content identity makes the admission decision attributable instead of treating every resolved configuration value as equivalent.

## Admission and capability grants need separate gates

After admission, the runtime must decide what authority the child receives. Inheriting the complete parent environment is convenient because credentials, proxies and provider settings appear automatically. It is also accidental delegation: the helper gains secrets because of how the launcher was configured, not because the task requires them.

The v2.1.238 note describes removing inherited credential environment variables from selected helper origins. That is a least-authority control. Folder trust can permit the code to run, while environment policy withholds a distinct class of capability. Either control alone is incomplete. Trust without sanitization can over-authorize accepted helpers; sanitization without trust can still execute untrusted repository code.

The two decisions should remain independently reviewable because their blast radii differ. Changing repository identity or helper content may invalidate execution trust. Changing which provider secrets exist, or what the helper is expected to contact, may require a different secret-access decision even when execution admission remains valid.

## Prefer explicit context to ambient inheritance

Official documentation exposes purpose-specific inputs such as `CLAUDE_CODE_MCP_SERVER_NAME` and `CLAUDE_CODE_MCP_SERVER_URL`, with additional plugin context where applicable. This points toward a stronger child-process contract: pass the context required for the declared task, then grant other capabilities intentionally.

Such a contract can describe:

- origin and content identity for the executable configuration;
- the trusted folder or plugin boundary that admitted execution;
- allowlisted task inputs supplied to the helper;
- separately granted secrets, filesystem locations, network destinations and external effects.

Denial must also fail visibly. If sanitization removes a credential a helper expected, the runtime should distinguish `capability-denied` from remote authentication failure, network failure or malformed helper output. Otherwise operators may repair the wrong layer by widening ambient access.

Not every helper needs a heavyweight sandbox. A low-risk local command in a user-controlled repository may justify a coarse trust boundary. The principle is not maximal isolation at any cost; it is that each capability should be granted because the task needs it, not because the parent happened to possess it.

## Environment filtering is not a sandbox

The public evidence supports the existence of credential-environment filtering, not its exact implementation. The selected public commit publishes release notes rather than product source. Neither that material nor the documentation read here enumerates the stripped variable list or public regression matrix. The helper may still receive non-credential environment values and explicit context.

More importantly, environment filtering closes only one authority channel. A trusted shell helper may still read files, contact networks, inspect process-visible resources or access credential stores permitted by the host. No public evidence here establishes filesystem, network, keychain, process or external-effect isolation.

That boundary defines the next design questions. Should helpers declare required capabilities before execution? How is the credential classification maintained as providers change? When repository identity, path ownership or helper content changes, which trust decisions expire? And which machine-readable error tells automation that authority was deliberately withheld?

Workspace trust and credential filtering are valuable precisely because they answer different questions. The first decides whether executable configuration may run. The second limits one class of authority after admission. Stronger isolation begins by keeping those facts separate—and by refusing to call either one a sandbox without additional evidence.

**Primary evidence:** [Claude Code release commit 8a8e81d](https://github.com/anthropics/claude-code/commit/8a8e81d098cbd0fae4ee5b9c853542945fe87016) and [official MCP documentation](https://code.claude.com/docs/en/mcp). The release notes are authoritative product documentation but do not expose the private filtering implementation or independent validation.
