# Q-20260820-01 — Git command names are not sufficient evidence of safe execution

- Runtime date: 2026-08-20
- Column: Digital Employee
- Source object: Q-20260820-01
- Primary source: https://github.com/openai/codex/commit/3b45c29062ff0e76e71c91b6753290400e7fa8da
- Evidence class: Fact for merged code/tests; maintainer claim where explicitly labeled; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A command may look read-only from its argv while the repository or host environment changes what actually executes. Git is particularly sensitive to configuration-driven helpers and execution hooks. The merged Codex change therefore stops using the lexical identity of a Git command as sufficient evidence that it is safe to auto-approve. The approval boundary moves from a static command-name allowlist toward the effective execution policy and explicit trust rules.

## Facts

1. The merged change explicitly states that repository configuration can cause even read-only Git commands to execute helpers, so Git command arguments alone are insufficient to establish trust.
2. On the Unix-like command-safety path, `is_safe_to_call_with_exec` now returns `false` for every executable resolved as `git`; the former Git-specific safe-subcommand classifier was removed.
3. The removed classifier had previously tried to recognize read-only forms such as `status`, `log`, `diff`, `show` and read-only `branch` variants while rejecting selected unsafe global options. The new implementation no longer attempts to prove Git safety through that argv grammar.
4. The Windows/PowerShell safe-command path likewise returns `false` for `git`, replacing the previous delegation to a Git safe-command helper.
5. The change removes the shared Git-subcommand/global-option scanning helpers that were used to support the former lexical safe classification.
6. Under `AskForApproval::UnlessTrusted`, the regression test for plain `git status` with no explicit execution-policy rule expects `NeedsApproval` and proposes an execution-policy amendment for the exact command.
7. Under `AskForApproval::OnRequest`, the same plain `git status` test still expects `Skip` with `bypass_sandbox=false`; therefore the merged change does not impose one universal approval outcome independent of the configured approval policy.
8. Under `UnlessTrusted`, an explicit `prefix_rule(pattern=["git", "status"], decision="allow")` changes the expected result to `Skip` with `bypass_sandbox=true` and no proposed amendment. Explicit execution policy remains an authority channel that can intentionally allow the command.
9. Absolute-path handling is tested separately. A host executable path explicitly declared for Git and covered by an allow rule can be skipped, while a different absolute Git path not covered by the declared host-executable rule now requires approval.
10. The end-to-end UnifiedExec regression configures `UnlessTrusted`, workspace-write permissions and user review, sends `git status`, waits for an `ExecApprovalRequest`, then verifies that a denied approval terminates the command path with the denial text rather than silently executing.
11. The commit message states that regression coverage includes direct Git invocation, shell-wrapped forms, absolute-path forms and PowerShell Git commands.
12. The change removes Git from known-safe classification rather than reclassifying Git as intrinsically malicious. Other policy modes and explicit execution-policy decisions still determine the eventual approval requirement.

## Maintainer claims

The maintainers characterize the defect as a trust-model problem: repository configuration can make a nominally read-only Git command execute helpers, so argv inspection alone cannot establish safety. The same change claims coverage across Unix, Windows, supported shell nesting and absolute-path forms. These claims are directly supported by the merged classifier changes and approval-policy regression tests, but they remain scoped to the Codex command-approval mechanism demonstrated by this commit.

## Mechanisms

### Remove the lexical Git safe-command exception

The strongest mechanism is deletion rather than a larger blacklist. Codex no longer tries to prove that selected Git subcommands are harmless by parsing subcommands and options. Once the executable resolves to Git, the generic known-safe shortcut returns false.

This is a fail-closed change at the classifier boundary: lack of a known-safe classification does not itself mean denial; it means later approval and execution-policy logic must decide.

### Separate command classification from approval policy

The regression matrix demonstrates three distinct layers:

- known-safe classification no longer automatically blesses Git;
- the configured approval policy still matters (`UnlessTrusted` differs from `OnRequest`);
- an explicit execution-policy rule can intentionally authorize a specific Git command.

The effective authority therefore comes from policy plus execution context, not a hard-coded assumption that a command name is harmless.

### Bind explicit rules to executable identity

Absolute-path tests distinguish a declared host executable path from another path that merely points to a binary named Git. A rule associated with the allowed host executable can skip approval, while an unmatched path under `UnlessTrusted` requires approval. This narrows the trust decision from command token alone toward the executable identity represented in policy.

### Preserve human denial as a terminal control decision

The UnifiedExec integration test exercises the whole approval path: model requests `git status`, Codex emits an approval request, the reviewer denies it, and the tool result contains the denial. The test demonstrates that removing Git from the safe shortcut actually reaches the governed reviewer boundary.

## Evidence

- `codex-rs/shell-command/src/command_safety/is_safe_command.rs` now contains `Some("git") => false` with the explicit repository-configuration rationale.
- `codex-rs/shell-command/src/command_safety/windows_safe_commands.rs` applies the same `"git" => false` rule in the Windows/PowerShell safe-command path.
- The previous Git safe-subcommand parsing and read-only argument logic were deleted rather than expanded.
- `codex-rs/core/src/exec_policy_tests.rs` verifies `git status` across `UnlessTrusted`, `OnRequest` and an explicit allow rule.
- The same test file distinguishes an approved declared absolute host-executable path from an unapproved absolute Git path.
- `codex-rs/core/tests/suite/exec_policy.rs` verifies an actual `ExecApprovalRequest` for `git status` under `UnlessTrusted` and preserves a user denial as the command result.

## Limitations

1. The change proves a Codex approval-classification behavior, not that every Git invocation on every host is dangerous.
2. Removing Git from the known-safe set does not prove that the subsequent approval decision is always correct; explicit rules and policy configuration can still authorize execution.
3. The reason describes repository configuration executing helpers, but this commit does not enumerate or formally model every Git configuration variable, helper, hook or external program that could affect execution.
4. An explicit allow rule can bypass approval in the tested policy path. The safety of such a rule depends on how administrators define and govern it.
5. The absolute-path tests demonstrate policy identity handling for selected host paths; they do not prove binary provenance, signature validation or filesystem integrity of the executable itself.
6. The regression tests establish selected Unix/Windows/shell/absolute-path behaviors, not a complete proof over every command wrapper or future execution backend.
7. This is not a sandbox guarantee. The test outcomes explicitly distinguish approval from `bypass_sandbox`, and approval policy is only one layer of execution governance.

## Comparisons

- **Before:** Codex attempted to recognize a bounded grammar of read-only Git invocations and auto-classify those forms as known safe.
- **After:** Git is not eligible for that lexical safe shortcut; approval policy and explicit execution rules decide whether it may execute.
- A larger argv blacklist would still assume that all dangerous behavior is visible in command arguments. The merged approach instead treats repository-configured effective execution as information not reliably captured by argv alone.
- A universal “always ask for Git” rule would be simpler but would ignore intentional policy modes and explicit allow rules. The merged behavior preserves those separate governance layers.

## Unresolved questions

1. Which concrete Git configuration mechanisms or helper classes motivated the change, and are they surfaced to the reviewer when approval is requested?
2. Can the approval UI expose the relevant repository configuration or effective helper chain so the user can make an informed decision rather than approving only the visible argv?
3. How are explicit execution-policy rules reviewed, versioned and audited when they intentionally re-authorize Git commands?
4. Does executable identity include provenance stronger than a path match, such as inode/hash/signature or package identity?
5. Are there other commands whose apparently read-only behavior can be redirected by local configuration and therefore need the same treatment?
6. How does this approval decision interact with sandbox constraints when a command is approved but still potentially launches a helper?

## Reading boundary

This note establishes a merged and tested Codex mechanism: Git was removed from Unix and Windows known-safe command classification because repository configuration can change effective execution; under `UnlessTrusted`, plain `git status` now reaches approval unless an explicit execution-policy rule authorizes it, while other approval-policy modes retain their own semantics. The evidence does not establish that every Git invocation is unsafe, that explicit policy rules are themselves trustworthy, or that approval alone contains all external side effects. Those broader judgments belong to Skill 04 Analysis.
