---
schema: "publication-candidate-article/v2"
title: "The secret came from an environment variable. Why was it still in the process list?"
date: "2026-09-18"
published_date: "2026-09-18"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Does sourcing a secret from an environment variable keep it out of child-process command lines?"
summary: "One synthetic token, three transport paths, and one process observer show why secret origin and secret transport are different claims."
cover: "/assets/context-authority-20260918/secret-argv.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded Windows synthetic-token experiment; not a Linux incident reproduction"
pageClass: "context-authority-article"
---

<ArticleCover image="/assets/context-authority-20260918/secret-argv.cover-v1.png" kicker="Open-source engineering · Security experiment" title="The secret came from an environment variable. Why was it still in the process list?" summary="A safe origin does not guarantee a safe path. Expanding a secret into command arguments moves it into a new observation surface." version="2026-09-18" languageHref="/zh/research/2026-09-18-secret-origin-vs-transport" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.context-authority-article .vp-doc h1[id] { display: none; }</style>

# The secret came from an environment variable. Why was it still in the process list?

Security instructions often say, “provide the API key through an environment variable.” That sounds like an endpoint. It only describes where the value starts.

Now consider this command:

```sh
curl -H "Authorization: Bearer $API_KEY" https://example.test/me
```

The shell expands `$API_KEY` before starting `curl`. The real token becomes a command-line argument. It began in the environment and then crossed into another observation surface.

## Where the question came from

An open Paperclip pull request, [#13572](https://github.com/paperclipai/paperclip/pull/13572), reports a concrete instance. The platform included a copyable `curl` example in agent prompts that expanded a run JWT into argv. Author Dmitry Novikov says continuous `/proc/<pid>/cmdline` sampling in a Linux deployment captured live JWTs from working agents. The PR changes prompts and scripts to feed authorization material through stdin.

The source matters because it challenges a convenient shortcut: “the secret is in an environment variable, so it is not in the command.” The full question is how the value is projected from storage to use.

We could not reproduce that Linux deployment on our Windows research host, and we did not use a real Paperclip token. We tested a narrower question: when the same synthetic token reaches a waiting child through argv, an environment variable, or stdin, what appears in the Windows process command line?

## One synthetic secret, three paths

The token was `SYNTHETIC-RUN-TOKEN-9f4c2a`. Three child processes received it in different ways:

1. argv: as the value of `--token`;
2. env: in a child-process environment variable;
3. stdin: written after process creation.

The parent, running under the same Windows account, read each command line through `Win32_Process.CommandLine`. The probe made no network request and used no real credential.

| Transport | Child started | Token visible in command line |
| --- | --- | --- |
| argv | Yes | **Yes** |
| Environment | Yes | No |
| stdin | Yes | No |

![Command-line visibility of the same token over three transports](/assets/context-authority-20260918/secret-argv.figure.en.svg)

*Figure 1: only the argv path exposed the synthetic token in the Windows command-line view we tested. This does not establish that environment variables or stdin are inaccessible through every other channel.*

## The security boundary changed during projection

The environment is the source; argv is a later carrier. Putting `$API_KEY` in a command template tells the shell to replace the variable with an ordinary string before creating the child process. Whether process listings, diagnostics, crash reports, or audit collectors can then see it depends on the operating system and deployment boundary.

This is why “no plaintext secret in the repository” and “no runtime secret disclosure” are separate checks. One is about static storage; the other is about the interfaces a value crosses while the program runs.

stdin is not a universal certificate of secrecy either. It only avoids making the value a target-process argument. The receiving program might log its input, the parent still holds the value, and a sufficiently privileged observer may have other access to memory or environment state. Our result is specifically about command-line visibility.

## What the upstream PR gets right, and what remains

PR #13572 adds more than a safer snippet. It introduces a regression probe with a red control: first prove that the detector can observe an intentionally leaked argv token, then require zero hits for the corrected path. Without that positive control, a broken sampler could report a false clean result.

The PR remains open. Its author also identifies follow-up locations, including pinned skill snapshots, smoke scripts, workflows, and documentation. We therefore cannot say that Paperclip has completed a comprehensive fix, and we do not present the author's Linux measurements as our experiment.

## Does CodeFlowMu need development work?

We inspected CodeFlowMu v2.1.2 process-launch paths and found no API key assembled into argv. The Windows Use Host path we examined passes configuration in the environment and sends call data as JSON over stdin; argv contains the Python interpreter, script path, and non-secret startup fields.

Our development-review decision is **do not implement a change this round**. The finding becomes a security review rule: look for second-stage expansion from env into argv and add a red-control regression when a real call site is found. There is no local defect evidence today.

## Four checks to take back to a project

1. Search for `$API_KEY` and `${TOKEN}` embedded in command arguments, not only hard-coded secrets.
2. Inspect documentation and agent prompts. Copyable examples become runtime behavior.
3. Give leak detectors a positive control so they first prove they can see a deliberate leak.
4. Record secret origin and final-hop transport separately.

A deeper question remains. When an agent can generate arbitrary shell commands, should a platform merely teach an argv-safe pattern, or should the execution layer reject sensitive values in argv? The first reduces mistakes; the second enforces a boundary. Their cost and false-positive profiles deserve separate experiments.

## Evidence

- [Paperclip PR #13572](https://github.com/paperclipai/paperclip/pull/13572)
- [Public experiment record](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-18-context-authority)

