# Generated Worker Prompt Bundle

ChatGPT scheduled tasks are wake-only bootstraps. They do not own the Research Runtime business prompt.

At wake time, an automation must:

1. access the latest `main` commit for `joinwell52-AI/joinwell52`;
2. read the Worker Control path declared by `SCHEDULER.json` and pass admission;
3. resolve its task ID and authoritative prompt reference from that control file;
4. read that prompt completely from the same commit;
5. verify the declared version and SHA-256 with a deterministic tool;
6. execute the generated prompt within the declared limits and without cached or embedded business rules.

`CONFIG.json`, the Scheduler and the task template are source inputs. Files under `generated/` are deterministic committed artifacts and must not be edited directly.

```bash
npm run worker-prompts:build
npm run worker-prompts:validate
```

The validation command fails when Scheduler metadata, a task template, required sources, a generated prompt or either generated manifest drifts apart. `npm run runtime:validate` includes this check. All nine Scheduler tasks are generated and controlled; a missing task is a validation failure.

## Program control

`generated/CONTROL.json` is the machine-readable admission policy in front of Agent intelligence. Its source configuration can:

- activate, pause or disable all workers or one task;
- restrict source branches and accepted wake sources;
- require common and task-specific tool capabilities;
- enforce the formal weekday and not-before time;
- bound run duration, recovery attempts, revision rounds and output count;
- allow governed zero-output while forbidding direct Publication;
- require same-run-date inputs, prompt-hash verification and remote-commit verification.

The static admission decision can be exercised with:

```bash
npm run worker-control:resolve -- \
  --task production \
  --branch main \
  --wake-source chatgpt-scheduled-task \
  --capabilities github-read,github-write,command-execution,file-editing \
  --now 2026-08-12T15:00:00+08:00
```

`Admitted` means the Worker may proceed to Runtime reconciliation. It does not grant substantive execution authority; the Runtime state machine still decides the earliest due task and controls leases and terminal results. `Denied` is fail-closed and permits no Runtime business work.

## ChatGPT scheduled-task bootstrap

Every account-level task should contain only a stable task-specific bootstrap equivalent to:

```text
Wake task=<scheduler-task-id> for joinwell52-AI/joinwell52.
Access the latest main branch.
Read the workerControlManifest declared by research/runtime/SCHEDULER.json.
Pass that task's admission, then read its prompt path from the same commit,
verify its version and SHA-256, and execute it.
Do not use cached, embedded, prior-run or prior-day business rules.
If main, control admission or the prompt cannot be read and verified, stop with Failed.
```

All business instructions live in generated repository prompts, not in ChatGPT scheduled tasks. A scheduled task contributes only a wake opportunity, repository access and Agent intelligence.
