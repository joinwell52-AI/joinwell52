---
schema: publication-candidate-article/v2
title: "The File Was Written Successfully. Why Check the Artifact Again? From Remote Sandboxes to Local Workspaces"
date: "2026-09-06"
published_date: "2026-09-07"
column: open-source-engineering
category: daily
article_type: engineering-case-study
edition: research-center
summary: "A real executor wrote a file, and a new process read back the matching digest. After a recoverable rename, the original path was unavailable while the success receipt remained true. Five workspace controls distinguish operation identity, historical success, and present availability."
cover: "/assets/execution-artifacts-20260906/02-artifact-cover-v2.png"
language: en
lifecycle: Published
publication_authorized: true
evidence_status: "Controlled study complete; no new product defect or development authorization"
pageClass: execution-artifacts-article
---

<ArticleCover image="/assets/execution-artifacts-20260906/02-artifact-cover-v2.png" kicker="Open-source Engineering · Controlled Study" title="The File Was Written Successfully. Why Check the Artifact Again? From Remote Sandboxes to Local Workspaces" summary="A real executor wrote a file, and a new process read back the matching digest. After a recoverable rename, the original path was unavailable while the success receipt remained true. Five workspace controls distinguish operation identity, historical success, and present availability." version="2026-09-06" languageHref="/zh/engineering/2026-09-06-workspace-artifact-continuity" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.execution-artifacts-article .vp-doc h1[id] { display: none; }</style>

[View full-resolution cover](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/02-artifact-cover-v2.png)

# The File Was Written Successfully. Why Check the Artifact Again? From Remote Sandboxes to Local Workspaces

In this experiment, the file really was written successfully.

We used CodeFlowMu's actual controlled file executor, then started another process to read the file. The SHA-256 content digest—a fingerprint used to compare bytes—exactly matched the post-write digest in the execution receipt.

Then we did something ordinary: renamed the file within the experiment directory while preserving every byte.

The original path no longer contained the file. The historical receipt still said `succeeded`.

There was no data-loss incident and no contradiction. The receipt correctly recorded the earlier write. The path check correctly answered whether the file could now be retrieved from its original location.

Renaming is only a minimal intervention. The question is not the filesystem truism that a rename changes a path. It is: **when an artifact's present availability changes, what judgments can its historical execution receipt still support?**

**The mistake would be collapsing these two records into one undifferentiated “task success.”** When agents work across processes, workspaces, or remote environments, the distinction affects both what the next turn receives and what a human ultimately gets.

## 1. Did we approve some content, or a particular operation?

First, move the camera from after the write to before it.

CodeFlowMu is the local multi-agent collaboration system we are developing. It organizes work around task files, execution sessions, and evidence. Its controlled file operations do not simply take text and write it. They construct a request, obtain approval, and check the request again before execution.

Two digests in this chain are easy to confuse.

A **content digest** identifies bytes. An **operation digest** identifies the particular operation that was approved. Writing identical text in a different workspace or for another task can preserve the content while changing the operation's identity.

To establish what the current system actually binds, we ran four controls through the real request builder at baseline `c008d9db91a21136fc61a4f60314e22db395d5d2`. Each used new isolated experiment directories across two rounds.

| Control | Observation, matching in both rounds | Misconception it rules out |
| --- | --- | --- |
| Rebuild the same request with the same workspace and task | Same operation digest | Identical input does not arbitrarily become a different approval object |
| After approval, change the target from absent to different existing content; rebuild and execute | `APPROVAL_STALE`; no file effect from this executor | Old approval cannot directly overwrite a changed target |
| Same proposed bytes, different workspace | Same content digest, different operation digest | Identical content does not mean identical execution location |
| Same workspace and content, different task | Different operation digest | Location and content do not replace task identity |

The second row matters particularly. We did not merely observe a digest change and declare protection effective. We attempted execution. The old approval was rejected as stale, and the intervening content was not overwritten.

These controls do not reach equally far. Changing the workspace or task verifies a different operation digest; the changed-target scenario additionally reaches rejection of the old approval during an execution attempt. **Distinguishing request identities does not establish acceptance coverage for every cross-workspace or cross-task execution path.**

The source explains why: the request incorporates the working directory, task subject, and target snapshot. The execution entry rebuilds it, and the approval service compares the operation digest.

The controls identify an existing foundation to reuse: requests incorporate workspace and task identity, and the tested target change makes the old approval inapplicable.

## 2. Why does strong write evidence not answer present delivery?

The fifth scenario specifically examined what happens after writing.

The tested executor writes a temporary file, renames it into the target, and returns a post-operation snapshot. We read the file through a separate process and compared its content digest. Then we renamed it within the experiment directory and separately checked the original path and historical receipt.

| Observation point | Current file fact | Execution evidence |
| --- | --- | --- |
| Actual executor finishes the write | Target exists | Success receipt includes the post-write digest |
| A new process reads the file | Read-back digest matches the receipt | Success is not merely an intention held in the original process's memory |
| After a recoverable rename within the experiment directory | Original path absent; preserved file exists | Original execution receipt still says success |

Both rounds matched. A new process reading the file demonstrates visibility outside the writing process. It is not a power-loss experiment and does not establish every durability property after power failure.

![The same artifact at write completion, independent read-back, and after a recoverable rename](/assets/execution-artifacts-20260906/02-artifact-inline-en-v1.png)

*Figure 1. B4 observes one file at three points, not three independent artifacts. The complete bytes remain at the preserved location; no file was deleted. Source: this study's controlled observations; AI-generated explanatory illustration.*

[View full-resolution figure](https://joinwell52-ai.github.io/joinwell52/assets/execution-artifacts-20260906/02-artifact-inline-en-v1.png)

This simple control corrects two opposite mistakes.

The first over-trusts historical success: because the write succeeded then, no one checks the artifact's location at delivery.

The second rewrites success as failure to keep a single status looking consistent: because the original path is empty now, the earlier write must have failed.

Both lose time. One substitutes the past for the present; the other uses the present to rewrite the past.

A more accurate account can retain all of these facts: what bytes were written then; which task and workspace they belonged to; where they can be retrieved now; and who checked when that they meet the delivery requirement.

We did not invoke business acceptance in this study. It would therefore be wrong to report that “acceptance passed missing artifacts.” We tested the responsibilities of execution evidence, not the correctness of the entire acceptance system.

## 3. Remote sandboxes make the distinction more expensive

On one persistent computer, the distinction may amount to another path check. In a replaceable remote environment, it can determine whether the previous turn's work survives.

Paperclip is an open-source system for organizing agent work and execution state. Daytona supplies remote sandboxes: isolated environments for running code. Paperclip [change #12901](https://github.com/paperclipai/paperclip/pull/12901) described successful changes remaining only in a remote sandbox. Reuse could appear normal, while replacement could restart from stale host data. The change exports and merges artifacts before successful completion, separates workspace recovery from another model turn, and blocks when unexported bytes cannot be recovered. As checked on September 6, 2026, the PR was merged. The author stated that the paid Daytona suite had not been run locally; we did not independently rerun remote tests either.

That external scenario and our local rename are not the same failure. Their connection is a question: **between “the executor did it” and “subsequent work can use it from the agreed location,” is there another handoff that needs confirmation?**

The local rename cannot validate remote export or merge correctness. The external change cannot establish that our product has the same deployment chain or the same data risk.

We searched the CodeFlowMu runtime and interface-layer source in this study's defined scope and did not find an equivalent Daytona export-and-sync recovery chain. This is a scoped search result, not a global claim about every dependency or user deployment.

The conclusion is therefore not “build a remote workspace system immediately.” First establish whether real usage requires that handoff. An external problem can suggest a direction; it cannot supply product requirements as facts.

## 4. Long-running work needs artifacts with a location, an owner, and a time

Restoring a task description is not enough for a long-running agent. If the next turn receives stale files, files from another workspace, or outputs with unverifiable ownership, its working basis may have changed even though the conversation continues.

This does not mean every team needs a new artifact platform. Where artifact handoff actually exists, five questions can examine the existing process:

1. **Where is delivery authoritative?** Which directory, repository commit, or storage object is the recognized source, rather than a temporary execution copy?
2. **Whose artifact is it?** Can it be linked to the task, execution record, and workspace instead of being claimed by filename alone?
3. **Do the bytes match?** Are we checking actual content, or only file existence and the model's description?
4. **When was it checked?** Evidence from the previous write is not automatically a current handoff check.
5. **Who owns business acceptance?** Proving a write does not authorize the executor to declare the content correct or the task complete.

These are recommendations derived from the study, not new CodeFlowMu interfaces or an authorized development task.

If the real deployment uses remote environments, add an environment-replacement control: preserve the output, change execution environments, and check the identity and bytes received by the next turn. On handoff failure, distinguish recovering existing artifacts from executing the original action again. Recovering completed work and potentially producing another external effect should not be hidden behind an ambiguous Retry button.

Conversely, for local workspace operations, precise request binding, post-operation snapshots, and an explicit delivery check may already be sufficient. Research is valuable when it establishes that a direction does not yet warrant development, too.

## 5. Do not make one “success” answer every question

Two conclusions survive this study together.

One is affirmative: the tested operation digests distinguish workspace, task, and target changes; the changed-target scenario additionally verifies rejection of the old approval. A new process can also verify actual write results.

The other is a boundary: a historical receipt proves what happened in the past; it does not inherently promise that the artifact remains at the same path forever. Current availability and business delivery require their own judgments, not an inference from one successful write.

The next engineering step is to check location, ownership, bytes, and verification time at a real delivery boundary, then decide whether the existing process is sufficient—not assume a new storage project is needed first.

**For a long-running agent, “it was completed” is history worth preserving. “It can be delivered now” is another fact worth checking.**

## Evidence and scope

This article uses five workspace scenarios, two rounds each, for ten controlled observations. The [bilingual evidence companion](/en/research/evidence/2026-09-06-execution-artifact-continuity) exports B0–B4 together with the related approval observations, source mappings, probes, and integrity checks. Local paths and process IDs are removed without changing outcomes. Record verification is available independently; product-probe execution additionally requires authorized access to the fixed source and its dependencies.

There is no production loss-rate sample, power-loss test, remote sandbox deletion, real remote synchronization, concurrent branch merge, or PM/QA business acceptance in this study. Publication reviewed existing evidence rather than inventing a new experimental round. The renamed artifact was preserved in full, and no user file was deleted.
