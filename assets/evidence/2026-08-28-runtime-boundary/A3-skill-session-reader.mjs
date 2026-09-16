import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const percent = (part, total) => Number(((part / total) * 100).toFixed(1));

export async function evaluate(path = new URL("./A3-skill-session-fixture.json", import.meta.url)) {
  const fixture = JSON.parse(await readFile(path, "utf8"));
  const profile = fixture.historical_profile;
  const fields = profile.fields;
  const sumsValid = Object.values(fields).every((item) => item.present + item.missing === profile.records);
  const probe = fixture.current_binding_probe;
  const mixed = fixture.mixed_evidence_example;
  const mixedEvidenceLevels = new Set([
    mixed.ordinary_invocation.proves,
    mixed.planning_evidence.proves
  ]).size;
  const pass =
    profile.records === 59 &&
    profile.duplicate_invocation_ids === 0 &&
    sumsValid &&
    fields.session_id.present === 0 &&
    probe.input.session_id &&
    probe.session_used_for_in_memory_dedupe === true &&
    probe.persisted.session_id === false &&
    probe.persisted.task_id === true &&
    probe.persisted.thread_key === true &&
    mixed.ordinary_invocation.session_id === null &&
    Boolean(mixed.planning_evidence.session_id) &&
    mixedEvidenceLevels === 2;
  return {
    evidence_id: fixture.evidence_id,
    records: profile.records,
    session_id_missing: fields.session_id.missing,
    session_id_missing_percent: percent(fields.session_id.missing, profile.records),
    current_probe_persisted_task: probe.persisted.task_id,
    current_probe_persisted_thread: probe.persisted.thread_key,
    current_probe_persisted_session: probe.persisted.session_id,
    mixed_evidence_levels: mixedEvidenceLevels,
    status: pass ? "PASS" : "FAIL"
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await evaluate()));
}
