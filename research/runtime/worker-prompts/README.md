# Generated Worker Prompt Bundle

ChatGPT scheduled tasks are wake-only bootstraps. They do not own the Research Runtime business prompt.

At wake time, an automation must:

1. access the latest `main` commit for `joinwell52-AI/joinwell52`;
2. read `research/runtime/worker-prompts/generated/MANIFEST.json`;
3. resolve its task ID to a generated prompt path;
4. read that prompt completely from the same commit;
5. verify the declared version and SHA-256 when a deterministic tool is available;
6. execute the generated prompt without cached or embedded business rules.

`CONFIG.json`, the Scheduler and the task template are source inputs. Files under `generated/` are deterministic committed artifacts and must not be edited directly.

```bash
npm run worker-prompts:build
npm run worker-prompts:validate
```

The validation command fails when Scheduler metadata, the template, required sources, the generated prompt or the manifest drift apart. `npm run runtime:validate` includes this check.

## ChatGPT Production bootstrap

The account-level 15:00 task should contain only a stable bootstrap equivalent to:

```text
Wake task=production for joinwell52-AI/joinwell52.
Access the latest main branch.
Read research/runtime/worker-prompts/generated/MANIFEST.json.
Resolve tasks.production, read its prompt path completely from the same commit,
verify its version and SHA-256, and execute it.
Do not use cached, embedded, prior-run or prior-day business rules.
If main, the manifest or the prompt cannot be read and verified, stop with Failed.
```

The long Production instructions live in the generated repository prompt, not in the ChatGPT scheduled task.
