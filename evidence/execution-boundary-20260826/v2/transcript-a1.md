# A1 — Call-time gate: sanitized source-faithful transcript

Source class: restricted runtime and shell evidence records. Brackets are redactions; all unbracketed results and observations are retained from the evidence records.

## Runtime full gate

```text
Command: npm run typecheck && npm test
Working directory: [runtime package]

Final result: exit 0; typecheck passed; tests 1702, pass 1702,
fail 0, duration 221582.3023 ms.

An earlier run exited 1 because the new acceptance-contract advisory
mechanically rejected legacy scheduler fixtures. The failure was retained;
it was not discarded or reclassified as pass.
```

## Shell full gate

```text
Command: npm run typecheck && npm test && npm run build
Working directory: [shell package]

Initial full run: exit 1 on three stale display-state assertions.
Corrected full run: exit 0; typecheck passed; tests 936, pass 936,
fail 0, duration 281061.1745 ms; bundle 8.5 MB.

After a live API compatibility correction: targeted tests 35/35,
typecheck and build passed; final full rerun: exit 0; tests 936,
pass 936, fail 0, duration 280308.4869 ms.
```

## Controlled restart observation

```text
First controlled restart: readiness ready; version projection aligned;
Gateway online; writer locks owned; active sessions 0.

Negative observation: the task list omitted a workflow-stage compatibility
field even though the display status was canonical. This was fixed after
the first restart.

Second controlled restart: the task API reported matching canonical stage
and display fields for the observed tasks; project graph remained
todo=0, doing=2, done=8, conflict=0.
```

Interpretation limit: these are named tests and two controlled checks, not a system-wide reliability or security claim.
