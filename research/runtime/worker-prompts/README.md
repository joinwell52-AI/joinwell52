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

The validation command fails when Scheduler metadata, the template, required sources, the generated prompt or the manifest drift apart. `npm run runtime:validate` includes this check.

## Program control

`generated/CONTROL.json` is the machine-readable admission policy in front of Agent intelligence. Its source configuration can:

- activate, pause or disable all workers or one task;
- restrict source branches and accepted wake sources;
- require concrete tool capabilities;
- enforce the formal not-before time;
- bound run duration, recovery attempts, revision rounds and candidate count;
- allow governed zero-output while forbidding direct Publication;
- require same-run-date inputs, prompt-hash verification and remote-commit verification.

The static admission decision can be exercised with:

```bash
npm run worker-control:resolve -- \
  --task production \
  --branch main \
  --wake-source chatgpt-scheduled-task \
  --capabilities github-read,github-write,web-research,command-execution,file-editing \
  --now 2026-08-12T15:00:00+08:00
```

`Admitted` means the Worker may proceed to Runtime reconciliation. It does not grant substantive execution authority; the Runtime state machine still decides the earliest due task and controls leases and terminal results. `Denied` is fail-closed and permits no Runtime business work.

## ChatGPT Production bootstrap

The account-level 15:00 task should contain only a stable bootstrap equivalent to:

```text
Wake task=production for joinwell52-AI/joinwell52.
Access the latest main branch.
Read the workerControlManifest declared by research/runtime/SCHEDULER.json.
Pass tasks.production admission, then read its prompt path from the same commit,
verify its version and SHA-256, and execute it.
Do not use cached, embedded, prior-run or prior-day business rules.
If main, control admission or the prompt cannot be read and verified, stop with Failed.
```

The long Production instructions live in the generated repository prompt, not in the ChatGPT scheduled task.
