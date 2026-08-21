# Q-20260821-03 — MCP helper execution needs both trust admission and ambient-credential isolation

- Runtime date: 2026-08-21
- Column: Open-source Engineering
- Source object: Q-20260821-03
- Primary source: https://github.com/anthropics/claude-code/commit/8a8e81d098cbd0fae4ee5b9c853542945fe87016
- Supporting primary documentation: https://code.claude.com/docs/en/mcp
- Evidence class: Fact for published release/documentation behavior; maintainer claim where implementation details are not publicly shown; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

An MCP `headersHelper` is executable configuration: it runs a local shell command whose output can mint request headers, including short-lived authentication material. If that command is supplied by a repository or agent file, merely loading configuration can cross a code-execution trust boundary. Separately, even after execution is authorized, inheriting the launching Claude Code process's ambient credentials would give the helper access to secrets unrelated to the MCP server it is meant to authenticate. Claude Code v2.1.238 documents changes that address these as two distinct boundaries: workspace/folder trust before lower-scope helper execution, and removal of inherited credential environment variables from selected helper origins.

## Facts

1. The selected commit publishes Claude Code v2.1.238 release notes. It does not expose the implementation source for these MCP changes; the public repository change is the changelog/feed publication itself.
2. The v2.1.238 changelog states that MCP `headersHelper` in a project `.mcp.json`, and inline MCP servers in project or `--add-dir` agent files, now require the corresponding folder trust dialog to have been accepted, including under `claude -p`.
3. The same release note states that MCP `headersHelper` from a project `.mcp.json`, plugin, or agent file runs without inherited credential environment variables.
4. The release note separately states that user-, managed-, and claude.ai-scope helpers now run from the Claude config directory.
5. Current official MCP documentation describes `headersHelper` as arbitrary shell-command execution used to generate request headers at connection time; the command's JSON stdout is merged into connection headers.
6. Official documentation states that the helper has a 10-second timeout, dynamic headers override same-named static headers, and the helper reruns on connections rather than being cached by Claude Code.
7. Official documentation states that a `headersHelper` defined at project or local scope runs only after workspace trust is accepted. It also documents that a cloned repository cannot approve its own project MCP servers before the workspace is trusted; project-checked-in approvals are ignored while the folder is untrusted.
8. Official documentation gives the MCP server scope precedence as Local, Project, User, Plugin-provided, then claude.ai connectors for duplicate resolution. This is server-definition precedence; the selected release note does not publish a separate, more detailed precedence algorithm specifically for choosing among multiple `headersHelper` declarations inside one resolved server definition.
9. Official documentation says project-scoped MCP configuration is stored in the repository-root `.mcp.json` and is designed to be shared through version control. This makes the workspace trust gate directly relevant to repository-supplied executable helper configuration.
10. Official documentation states that the helper receives purpose-specific variables such as `CLAUDE_CODE_MCP_SERVER_NAME` and `CLAUDE_CODE_MCP_SERVER_URL`; plugin-provided helpers also receive `CLAUDE_PLUGIN_ROOT` and run from the plugin root in the documented current behavior.
11. The selected v2.1.238 release note does not enumerate the exact inherited credential variable names removed from project/plugin/agent-file helpers. The public changelog therefore supports the existence of credential-env filtering but not a complete variable-level denylist.
12. The current official MCP documentation likewise does not publish the v2.1.238 credential-stripping list in the `headersHelper` section. Exact stripped names remain unavailable from the source-complete public material read here and must be treated as Unknown rather than inferred.
13. The release note explicitly includes inline MCP servers in project or `--add-dir` agent files in the folder-trust requirement. This demonstrates that the admission boundary is not limited to `.mcp.json` files.
14. The selected release note states that project `.mcp.json`, plugin and agent-file `headersHelper` are credential-sanitized, while its separate working-directory statement names user, managed and claude.ai scopes. These are distinct claims; the note does not say every source has identical cwd or environment treatment.
15. The public changelog does not disclose the helper subprocess construction, environment-filtering function, failure propagation code, or regression-test names. Those implementation details cannot be verified from this repository commit.
16. The official documentation says authentication and not-found failures for MCP servers are not automatically retried because they require configuration changes, while the dynamic-header section states that a 401/403 tool response can cause the helper to rerun, reconnect and retry once. These documented connection semantics are broader MCP behavior, not proof of the private implementation details behind the v2.1.238 environment sanitization change.

## Maintainer claims

Anthropic's v2.1.238 release note claims two concrete hardening behaviors: lower-trust project/agent inline MCP configuration cannot execute until its folder has been trusted, and selected project/plugin/agent-file `headersHelper` commands no longer inherit credential environment variables. The public changelog is authoritative release documentation but not open implementation evidence, so exact filtering code, variable names and test coverage remain maintainer claims unless separately documented.

The official MCP documentation independently confirms the important surrounding semantics: `headersHelper` is shell execution, can mint authentication headers, project/local helpers are workspace-trust gated, project `.mcp.json` is repository-controlled configuration, and helper output becomes connection headers.

## Mechanisms

### Gate repository-controlled execution on workspace trust

A project `.mcp.json` is shareable repository content. Because `headersHelper` executes a shell command, accepting a repository and executing its helper are not safely separable unless the workspace has a trust state. The v2.1.238 release note extends that gate to project helpers and inline MCP definitions in project or additional-directory agent files, including non-interactive `claude -p` use.

The control is an admission boundary: untrusted repository content may be parsed or displayed, but it must not silently acquire authority to execute the helper merely because a timer, headless mode or MCP discovery path touches the configuration.

### Remove ambient credential authority from selected helper origins

Trusting a folder authorizes execution of its configured helper; it does not logically authorize that helper to read every credential inherited by the parent Claude Code process. The release note therefore describes a second mechanism: project `.mcp.json`, plugin and agent-file helpers execute without inherited credential environment variables.

This separates **code-admission authority** from **secret-access authority**. A helper can be permitted to run while still receiving a reduced environment.

### Supply task-specific context explicitly

Official documentation exposes `CLAUDE_CODE_MCP_SERVER_NAME` and `CLAUDE_CODE_MCP_SERVER_URL` to the helper, with `CLAUDE_PLUGIN_ROOT` for plugin cases. This is a safer design pattern than relying only on a broad inherited process environment: helper-relevant context can be passed intentionally even when ambient credential inheritance is reduced.

### Use scope-dependent working directories

The release note says user, managed and claude.ai-scope helpers now run from the Claude config directory, while current documentation says plugin-provided helpers run from the plugin root. The evidence demonstrates that helper cwd is treated as part of execution context and can vary by source. The public sources do not expose a complete source-to-cwd matrix for every v2.1.238 helper origin, so no broader claim is made.

## Evidence

- The v2.1.238 changelog explicitly requires folder trust for project `.mcp.json` `headersHelper` and inline MCP servers in project or `--add-dir` agent files, including `claude -p`.
- The same changelog explicitly says project `.mcp.json`, plugin and agent-file helpers run without inherited credential environment variables.
- The changelog explicitly moves user-, managed- and claude.ai-scope helper working directories to the Claude config directory.
- Official MCP documentation describes `headersHelper` as arbitrary shell execution that emits JSON headers and therefore establishes why the configuration is an execution boundary.
- Official documentation says project/local `headersHelper` runs only after workspace trust is accepted and explains that an untrusted cloned repository cannot self-approve its project MCP servers through checked-in settings.
- Official documentation publishes the general MCP server scope hierarchy and helper-specific context variables.

## Limitations

1. The selected public GitHub commit changes only `CHANGELOG.md` and `feed.xml`; it does not expose the product implementation diff for the hardening behavior.
2. The exact names of stripped inherited credential environment variables are not published in the selected commit or the official MCP documentation read for this note. They are therefore Unknown.
3. No public regression tests for the v2.1.238 trust/env filtering behavior are present in the selected repository commit, so test coverage cannot be independently enumerated.
4. The release note says credential environment variables are removed; it does not claim the helper receives an empty environment. Non-credential variables and explicitly supplied helper context may still be present.
5. Environment filtering is not a sandbox. A trusted helper can still execute arbitrary shell logic and may access files, network endpoints or other process-visible resources permitted by the host environment.
6. Workspace trust is an execution-admission decision, not proof that repository code is benign. A user can trust a malicious folder.
7. The general MCP scope hierarchy establishes which duplicate server definition wins, but it does not fully specify every helper-field merge or agent-file precedence case requested by the Research Plan.
8. The release note does not publish complete failure semantics for a helper rejected by trust, a sanitized helper missing a needed credential, or an inline server denied by folder trust.
9. The release note's cwd statement covers user, managed and claude.ai-scope helpers; current docs separately document plugin-root cwd. A complete cwd matrix for project, local and agent-file helpers is not established here.
10. Nothing in the evidence proves process isolation, filesystem isolation, network isolation, secret-manager isolation, or a guarantee against a helper deliberately acquiring credentials by another route.

## Comparisons

- **Before the documented hardening:** a project/agent-file helper could be reachable in contexts where the folder's trust boundary was not consistently enforced, and selected helpers inherited credential-bearing environment from the launching process according to the release note's fix description.
- **After v2.1.238:** project/agent inline execution is explicitly trust-gated, and project/plugin/agent-file helpers have inherited credential variables removed; higher scopes also receive explicit cwd treatment.
- Trust-only hardening would prevent accidental execution from an untrusted folder but would still give a trusted helper ambient credentials. Environment-only hardening would reduce secret exposure but could still permit untrusted repository code to execute. The release addresses both dimensions separately.
- A stronger isolation architecture would execute helpers inside a restricted sandbox with an explicit capability set and per-secret grants. The published evidence does not claim such a mechanism.

## Unresolved questions

1. What exact environment-variable denylist or classification function implements "credential env vars" in v2.1.238?
2. Are provider credentials such as Anthropic, AWS, Google Cloud, Azure, GitHub and proxy credentials all covered, and how is the list maintained as new providers are added?
3. Can a project/plugin/agent helper request an explicit credential grant, or must all intended credentials be obtained through its own external mechanism?
4. What is the exact precedence when an MCP server/helper is declared across project `.mcp.json`, agent files, plugin configuration and command-line injected configuration?
5. What cwd is used for each project/local/agent-file helper origin after v2.1.238, and how are symlinks/canonical paths handled?
6. What durable state records folder-trust acceptance for project and `--add-dir` agent files, and can it be invalidated when repository identity changes?
7. What user-visible and machine-readable failure is produced when a helper is blocked for missing trust?
8. What happens when sanitization removes a credential that a previously functioning helper depended on: explicit failure, empty header output, or fallback behavior?
9. Which regression tests verify `claude -p`, inline servers, plugins, project `.mcp.json`, additional directories and all supported operating systems?
10. Could a trusted helper recover stripped secrets from files, credential stores, parent IPC, shell startup files or network metadata, and what additional isolation layer addresses that risk?

## Reading boundary

This note establishes published Claude Code v2.1.238 behavior that separates two MCP helper controls: folder/workspace trust gates project-controlled helper and inline-MCP execution, while project `.mcp.json`, plugin and agent-file helpers are documented as running without inherited credential environment variables. Official documentation independently confirms that `headersHelper` is arbitrary shell execution used to produce authentication headers and that project/local helper execution is workspace-trust gated. The public material does not disclose the exact stripped variable list, implementation code, complete precedence/cwd matrix, regression tests, or a sandbox guarantee. Those missing details remain Unknown rather than inferred, and broader security judgments belong to Skill 04 Analysis.
