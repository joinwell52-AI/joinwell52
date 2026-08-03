import { canonicalBytes, finalizeObject, sha256 } from './reader.mjs'

const createdAt = '2026-08-03T20:00:00Z'

function object(overrides = {}) {
  const id = overrides.id ?? 'object-1'
  const workId = overrides.work_id ?? id
  const carrierId = overrides.carrier_id ?? id
  const value = {
    tmpa_version: 'S0.4',
    id,
    type: overrides.type ?? 'TASK',
    governed_work: { id: workId, primary_carrier_id: carrierId },
    stream: { id: overrides.stream_id ?? 'stream-main', sequence: overrides.sequence ?? 1 },
    creator: overrides.creator ?? 'alice',
    role: overrides.role ?? 'PM',
    created_at: overrides.created_at ?? createdAt,
    lifecycle: { profile: 'tmpa-s0.4-case-profile', state: overrides.state ?? 'created' },
    references: structuredClone(overrides.references ?? []),
    content: { media_type: 'application/json', body: structuredClone(overrides.body ?? {}) },
    integrity: { canonicalization: 'tmpa-s0.4-stable-json-1', hash_algorithm: 'sha256', digest: '' }
  }
  if (overrides.transition) value.lifecycle.transition = structuredClone(overrides.transition)
  return finalizeObject(value)
}

function source(value, sourceId = `source-${value.id}`) {
  return { source_id: sourceId, media_type: 'application/json', bytes: canonicalBytes(value) }
}

function transition({ id, work, carrier, stream, sequence, creator, role, from, action, to, references = [] }) {
  return object({
    id,
    type: 'TRANSITION',
    work_id: work,
    carrier_id: carrier,
    stream_id: stream,
    sequence,
    creator,
    role,
    state: to,
    transition: { from, action, to },
    references
  })
}

function issueCodes(result) {
  return result.issues.map((issue) => issue.code)
}

function digestResult(result) {
  return sha256(canonicalBytes(result))
}

function permutations(values, limit = 24) {
  const output = []
  function visit(prefix, remaining) {
    if (output.length >= limit) return
    if (!remaining.length) {
      output.push(prefix)
      return
    }
    for (let index = 0; index < remaining.length && output.length < limit; index += 1) {
      visit([...prefix, remaining[index]], [...remaining.slice(0, index), ...remaining.slice(index + 1)])
    }
  }
  visit([], values)
  return output
}

function assertion(id, target, operator, expected) {
  return { id, target, operator, expected, mandatory: true }
}

export const tests = [
  {
    id: 'C01',
    name: 'Schema validation',
    assertions: [
      assertion('six-invalid-shapes', '/schema_invalid_count', 'equals', 6),
      assertion('all-rejected', '/node_count', 'equals', 0),
      assertion('canonical-code', '/issue_codes', 'all_equal', 'SCHEMA_INVALID')
    ],
    run(read) {
      const invalid = []
      const missingWork = object({ id: 'c01-missing-work' }); delete missingWork.governed_work; invalid.push(missingWork)
      const wrongVersion = object({ id: 'c01-version' }); wrongVersion.tmpa_version = 'S0.3'; invalid.push(wrongVersion)
      const extraField = object({ id: 'c01-extra' }); extraField.prohibited = true; invalid.push(extraField)
      const badTransition = object({ id: 'c01-transition' }); badTransition.lifecycle.transition = { from: 'created', to: 'active' }; invalid.push(badTransition)
      const incompleteSignature = object({ id: 'c01-signature' }); incompleteSignature.integrity.signature_algorithm = 'ed25519'; invalid.push(incompleteSignature)
      const invalidDate = object({ id: 'c01-date' }); invalidDate.created_at = '2026-99-99'; invalid.push(invalidDate)
      const result = read(invalid.map((value, index) => source(value, `c01-${index + 1}`)))
      return {
        result,
        context: {
          schema_invalid_count: result.issues.filter((issue) => issue.code === 'SCHEMA_INVALID').length,
          node_count: result.nodes.length,
          issue_codes: issueCodes(result)
        }
      }
    }
  },
  {
    id: 'C02',
    name: 'Primary-carrier and single-writer immutability',
    assertions: [
      assertion('carrier-conflict-reported', '/issue_codes', 'includes', 'PRIMARY_CARRIER_CONFLICT'),
      assertion('original-preserved', '/node_ids', 'includes', 'c02-carrier-a'),
      assertion('correction-preserved', '/node_ids', 'includes', 'c02-carrier-b'),
      assertion('no-overwrite-selection', '/view_state', 'equals', 'disputed')
    ],
    run(read) {
      const first = object({ id: 'c02-carrier-a', work_id: 'work-c02', carrier_id: 'c02-carrier-a', body: { value: 1 } })
      const correction = object({ id: 'c02-carrier-b', type: 'CORRECTION', work_id: 'work-c02', carrier_id: 'c02-carrier-b', stream_id: 'stream-correction', creator: 'bob', role: 'DEV', references: [{ relation: 'corrects', target: first.id }], body: { value: 2 } })
      const result = read([source(first), source(correction)])
      return { result, context: { issue_codes: issueCodes(result), node_ids: result.nodes.map((node) => node.id), view_state: result.view_state } }
    }
  },
  {
    id: 'C03',
    name: 'Duplicate object identity',
    assertions: [
      assertion('duplicate-reported', '/issue_codes', 'includes', 'DUPLICATE_ID_CONFLICT'),
      assertion('duplicate-not-authoritative', '/node_ids', 'not_includes', 'c03-duplicate'),
      assertion('quarantined-view', '/view_state', 'equals', 'quarantined')
    ],
    run(read) {
      const left = object({ id: 'c03-duplicate', body: { value: 'left' } })
      const right = object({ id: 'c03-duplicate', body: { value: 'right' } })
      const result = read([source(left, 'c03-left'), source(right, 'c03-right')])
      return { result, context: { issue_codes: issueCodes(result), node_ids: result.nodes.map((node) => node.id), view_state: result.view_state } }
    }
  },
  {
    id: 'C04',
    name: 'Serial-stream continuity and asynchronous progress',
    assertions: [
      assertion('gap-reported', '/issue_codes', 'includes', 'STREAM_GAP'),
      assertion('duplicate-sequence-reported', '/issue_codes', 'includes', 'STREAM_DUPLICATE_SEQUENCE'),
      assertion('independent-stream-retained', '/node_ids', 'includes', 'c04-independent'),
      assertion('permutation-stable', '/unique_result_digests', 'equals', 1)
    ],
    run(read) {
      const carrier = object({ id: 'c04-carrier', work_id: 'work-c04', stream_id: 'stream-a', sequence: 1 })
      const late = object({ id: 'c04-late', type: 'REPORT', work_id: 'work-c04', carrier_id: carrier.id, stream_id: 'stream-a', sequence: 3, creator: 'bob', role: 'DEV' })
      const duplicate = object({ id: 'c04-duplicate-sequence', type: 'ISSUE', work_id: 'work-c04', carrier_id: carrier.id, stream_id: 'stream-a', sequence: 3, creator: 'carol', role: 'QA' })
      const independent = object({ id: 'c04-independent', work_id: 'work-c04-independent', stream_id: 'stream-b', sequence: 1 })
      const sources = [source(carrier), source(late), source(duplicate), source(independent)]
      const results = permutations(sources).map((items) => read(items))
      const result = results[0]
      return {
        result,
        context: {
          issue_codes: issueCodes(result),
          node_ids: result.nodes.map((node) => node.id),
          unique_result_digests: new Set(results.map(digestResult)).size
        }
      }
    }
  },
  {
    id: 'C05',
    name: 'Role authority',
    assertions: [
      assertion('denied-code', '/denied_codes', 'includes', 'AUTHORITY_DENIED'),
      assertion('denied-judgment', '/denied_judgment', 'equals', 'invalid'),
      assertion('missing-code', '/missing_codes', 'includes', 'AUTHORITY_UNDETERMINED'),
      assertion('missing-judgment', '/missing_judgment', 'equals', 'undetermined'),
      assertion('state-not-applied', '/states_equal_created', 'equals', true)
    ],
    run(read) {
      const carrier = object({ id: 'c05-carrier', work_id: 'work-c05' })
      const denied = transition({ id: 'c05-denied', work: 'work-c05', carrier: carrier.id, stream: 'stream-dev', sequence: 1, creator: 'bob', role: 'DEV', from: 'created', action: 'start', to: 'active' })
      const missing = transition({ id: 'c05-missing', work: 'work-c05', carrier: carrier.id, stream: 'stream-unknown', sequence: 1, creator: 'zoe', role: 'PM', from: 'created', action: 'start', to: 'active' })
      const deniedResult = read([source(carrier), source(denied)])
      const missingResult = read([source(carrier), source(missing)])
      return {
        result: deniedResult,
        context: {
          denied_codes: issueCodes(deniedResult),
          denied_judgment: deniedResult.nodes.find((node) => node.id === denied.id)?.judgment,
          missing_codes: issueCodes(missingResult),
          missing_judgment: missingResult.nodes.find((node) => node.id === missing.id)?.judgment,
          states_equal_created: deniedResult.extensions.summary.work_state['work-c05'] === 'created' && missingResult.extensions.summary.work_state['work-c05'] === 'created'
        }
      }
    }
  },
  {
    id: 'C06',
    name: 'Lifecycle legality',
    assertions: [
      assertion('illegal-code', '/illegal_codes', 'includes', 'ILLEGAL_TRANSITION'),
      assertion('illegal-invalid', '/illegal_judgment', 'equals', 'invalid'),
      assertion('missing-precondition-code', '/missing_codes', 'includes', 'LIFECYCLE_UNDETERMINED'),
      assertion('missing-undetermined', '/missing_judgment', 'equals', 'undetermined'),
      assertion('state-not-applied', '/missing_state', 'equals', 'active')
    ],
    run(read) {
      const carrier = object({ id: 'c06-carrier', work_id: 'work-c06' })
      const illegal = transition({ id: 'c06-illegal', work: 'work-c06', carrier: carrier.id, stream: 'stream-pm', sequence: 2, creator: 'alice', role: 'PM', from: 'created', action: 'launch', to: 'done' })
      const start = transition({ id: 'c06-01-start', work: 'work-c06', carrier: carrier.id, stream: 'stream-pm', sequence: 2, creator: 'alice', role: 'PM', from: 'created', action: 'start', to: 'active' })
      const submit = transition({ id: 'c06-02-submit', work: 'work-c06', carrier: carrier.id, stream: 'stream-dev', sequence: 1, creator: 'bob', role: 'DEV', from: 'active', action: 'submit', to: 'review', references: [{ relation: 'depends_on', target: start.id }] })
      const illegalResult = read([source(carrier), source(illegal)])
      const missingResult = read([source(carrier), source(start), source(submit)])
      return {
        result: illegalResult,
        context: {
          illegal_codes: issueCodes(illegalResult),
          illegal_judgment: illegalResult.nodes.find((node) => node.id === illegal.id)?.judgment,
          missing_codes: issueCodes(missingResult),
          missing_judgment: missingResult.nodes.find((node) => node.id === submit.id)?.judgment,
          missing_state: missingResult.extensions.summary.work_state['work-c06']
        }
      }
    }
  },
  {
    id: 'C07',
    name: 'Separation of duties',
    assertions: [
      assertion('sod-code', '/issue_codes', 'includes', 'SOD_VIOLATION'),
      assertion('review-invalid', '/review_judgment', 'equals', 'invalid'),
      assertion('state-remains-review', '/state', 'equals', 'review')
    ],
    run(read) {
      const carrier = object({ id: 'c07-carrier', work_id: 'work-c07' })
      const start = transition({ id: 'c07-01-start', work: 'work-c07', carrier: carrier.id, stream: 'stream-pm', sequence: 2, creator: 'alice', role: 'PM', from: 'created', action: 'start', to: 'active' })
      const report = object({ id: 'c07-report', type: 'REPORT', work_id: 'work-c07', carrier_id: carrier.id, stream_id: 'stream-dev', sequence: 1, creator: 'bob', role: 'DEV' })
      const submit = transition({ id: 'c07-02-submit', work: 'work-c07', carrier: carrier.id, stream: 'stream-dev', sequence: 2, creator: 'bob', role: 'DEV', from: 'active', action: 'submit', to: 'review', references: [{ relation: 'depends_on', target: start.id }, { relation: 'reports', target: report.id }] })
      const review = transition({ id: 'c07-03-review', work: 'work-c07', carrier: carrier.id, stream: 'stream-qa', sequence: 1, creator: 'bob', role: 'QA', from: 'review', action: 'approve', to: 'done', references: [{ relation: 'depends_on', target: submit.id }, { relation: 'reviews', target: submit.id }] })
      const result = read([carrier, start, report, submit, review].map((value) => source(value)))
      return { result, context: { issue_codes: issueCodes(result), review_judgment: result.nodes.find((node) => node.id === review.id)?.judgment, state: result.extensions.summary.work_state['work-c07'] } }
    }
  },
  {
    id: 'C08',
    name: 'Integrity tampering',
    assertions: [
      assertion('digest-code', '/issue_codes', 'includes', 'INTEGRITY_MISMATCH'),
      assertion('tampered-excluded', '/node_ids', 'not_includes', 'c08-object'),
      assertion('source-retained-as-issue', '/issue_source_ids', 'includes', 'source-c08-object')
    ],
    run(read) {
      const tampered = object({ id: 'c08-object', body: { value: 'original' } })
      tampered.content.body.value = 'tampered'
      const result = read([source(tampered)])
      return { result, context: { issue_codes: issueCodes(result), node_ids: result.nodes.map((node) => node.id), issue_source_ids: result.issues.map((issue) => issue.source_id) } }
    }
  },
  {
    id: 'C09',
    name: 'Missing reference',
    assertions: [
      assertion('missing-code', '/issue_codes', 'includes', 'MISSING_REFERENCE'),
      assertion('undetermined', '/judgment', 'equals', 'undetermined'),
      assertion('partial', '/view_state', 'equals', 'partial')
    ],
    run(read) {
      const carrier = object({ id: 'c09-carrier', work_id: 'work-c09' })
      const report = object({ id: 'c09-report', type: 'REPORT', work_id: 'work-c09', carrier_id: carrier.id, stream_id: 'stream-dev', creator: 'bob', role: 'DEV', references: [{ relation: 'depends_on', target: 'c09-missing' }] })
      const result = read([source(carrier), source(report)])
      return { result, context: { issue_codes: issueCodes(result), judgment: result.judgment, view_state: result.view_state } }
    }
  },
  {
    id: 'C10',
    name: 'Prohibited cycle',
    assertions: [
      assertion('cycle-code', '/issue_codes', 'includes', 'PROHIBITED_CYCLE'),
      assertion('cycle-a-quarantined', '/cycle_a_view', 'equals', 'quarantined'),
      assertion('cycle-b-quarantined', '/cycle_b_view', 'equals', 'quarantined'),
      assertion('unaffected-authoritative', '/unaffected_view', 'equals', 'authoritative')
    ],
    run(read) {
      const a = object({ id: 'c10-a', work_id: 'work-c10-a', references: [{ relation: 'depends_on', target: 'c10-b' }] })
      const b = object({ id: 'c10-b', work_id: 'work-c10-b', references: [{ relation: 'depends_on', target: 'c10-a' }] })
      const unaffected = object({ id: 'c10-unaffected', work_id: 'work-c10-unaffected', stream_id: 'stream-other' })
      const result = read([a, b, unaffected].map((value) => source(value)))
      return {
        result,
        context: {
          issue_codes: issueCodes(result),
          cycle_a_view: result.nodes.find((node) => node.id === a.id)?.view_state,
          cycle_b_view: result.nodes.find((node) => node.id === b.id)?.view_state,
          unaffected_view: result.nodes.find((node) => node.id === unaffected.id)?.view_state
        }
      }
    }
  },
  {
    id: 'C11',
    name: 'Aggregation and reconstruction determinism',
    assertions: [
      assertion('twenty-four-permutations', '/permutation_count', 'equals', 24),
      assertion('one-byte-result', '/unique_result_digests', 'equals', 1),
      assertion('cross-stream-incomparable', '/cross_stream_order_edges', 'equals', 0)
    ],
    run(read) {
      const values = [
        object({ id: 'c11-a', work_id: 'work-c11-a', stream_id: 'stream-a' }),
        object({ id: 'c11-b', work_id: 'work-c11-b', stream_id: 'stream-b' }),
        object({ id: 'c11-c', work_id: 'work-c11-c', stream_id: 'stream-c' }),
        object({ id: 'c11-d', work_id: 'work-c11-d', stream_id: 'stream-d' })
      ].map((value) => source(value))
      const results = permutations(values).map((items) => read(items))
      const result = results[0]
      return {
        result,
        context: {
          permutation_count: results.length,
          unique_result_digests: new Set(results.map(digestResult)).size,
          cross_stream_order_edges: result.edges.filter((edge) => edge.ordering).length
        }
      }
    }
  },
  {
    id: 'C12',
    name: 'Conflict preservation',
    assertions: [
      assertion('conflict-code-before', '/before_codes', 'includes', 'UNRESOLVED_CONFLICT'),
      assertion('disputed-before', '/before_view', 'equals', 'disputed'),
      assertion('both-reviews-before', '/before_review_count', 'equals', 2),
      assertion('conflict-removed-after-resolution', '/after_codes', 'not_includes', 'UNRESOLVED_CONFLICT'),
      assertion('authoritative-after', '/after_view', 'equals', 'authoritative')
    ],
    run(read) {
      const carrier = object({ id: 'c12-carrier', work_id: 'work-c12' })
      const report = object({ id: 'c12-report', type: 'REPORT', work_id: 'work-c12', carrier_id: carrier.id, stream_id: 'stream-dev', creator: 'bob', role: 'DEV' })
      const approve = object({ id: 'c12-review-approve', type: 'REVIEW', work_id: 'work-c12', carrier_id: carrier.id, stream_id: 'stream-qa-a', creator: 'carol', role: 'QA', references: [{ relation: 'reviews', target: report.id }], body: { decision: 'approve' } })
      const reject = object({ id: 'c12-review-reject', type: 'REVIEW', work_id: 'work-c12', carrier_id: carrier.id, stream_id: 'stream-qa-b', creator: 'dave', role: 'QA', references: [{ relation: 'reviews', target: report.id }], body: { decision: 'reject' } })
      const resolution = object({ id: 'c12-resolution', type: 'DECISION', work_id: 'work-c12', carrier_id: carrier.id, stream_id: 'stream-admin', creator: 'erin', role: 'ADMIN', references: [{ relation: 'resolves', target: approve.id }, { relation: 'resolves', target: reject.id }], body: { selects: approve.id } })
      const baseSources = [carrier, report, approve, reject].map((value) => source(value))
      const before = read(baseSources)
      const after = read([...baseSources, source(resolution)])
      return {
        result: before,
        context: {
          before_codes: issueCodes(before),
          before_view: before.view_state,
          before_review_count: before.nodes.filter((node) => node.type === 'REVIEW').length,
          after_codes: issueCodes(after),
          after_view: after.view_state
        }
      }
    }
  },
  {
    id: 'C13',
    name: 'Recovery',
    assertions: [
      assertion('fresh-reader-equal', '/fresh_reader_equal', 'equals', true),
      assertion('state-reconstructed', '/state', 'equals', 'active'),
      assertion('responsibility-reconstructed', '/responsibility', 'equals', 'PM'),
      assertion('unresolved-dependency-reconstructed', '/issue_codes', 'includes', 'MISSING_REFERENCE')
    ],
    run(read) {
      const carrier = object({ id: 'c13-carrier', work_id: 'work-c13' })
      const start = transition({ id: 'c13-01-start', work: 'work-c13', carrier: carrier.id, stream: 'stream-pm', sequence: 2, creator: 'alice', role: 'PM', from: 'created', action: 'start', to: 'active' })
      const report = object({ id: 'c13-report', type: 'REPORT', work_id: 'work-c13', carrier_id: carrier.id, stream_id: 'stream-dev', creator: 'bob', role: 'DEV', references: [{ relation: 'depends_on', target: 'c13-missing' }] })
      const sources = [carrier, start, report].map((value) => source(value))
      const first = read(sources)
      const fresh = read(sources.map((item) => ({ ...item, bytes: Buffer.from(item.bytes) })))
      return {
        result: first,
        context: {
          fresh_reader_equal: digestResult(first) === digestResult(fresh),
          state: fresh.extensions.summary.work_state['work-c13'],
          responsibility: fresh.extensions.summary.responsibility['work-c13'],
          issue_codes: issueCodes(fresh)
        }
      }
    }
  },
  {
    id: 'C14',
    name: 'Terminal-history preservation',
    assertions: [
      assertion('terminal-state', '/state', 'equals', 'archive'),
      assertion('history-count', '/node_count', 'equals', 6),
      assertion('all-history-identifiers', '/node_ids', 'contains_all', ['c14-carrier', 'c14-report', 'c14-01-start', 'c14-02-submit', 'c14-03-approve', 'c14-04-archive']),
      assertion('no-issues', '/issue_count', 'equals', 0)
    ],
    run(read) {
      const carrier = object({ id: 'c14-carrier', work_id: 'work-c14' })
      const start = transition({ id: 'c14-01-start', work: 'work-c14', carrier: carrier.id, stream: 'stream-pm', sequence: 2, creator: 'alice', role: 'PM', from: 'created', action: 'start', to: 'active' })
      const report = object({ id: 'c14-report', type: 'REPORT', work_id: 'work-c14', carrier_id: carrier.id, stream_id: 'stream-dev', sequence: 1, creator: 'bob', role: 'DEV' })
      const submit = transition({ id: 'c14-02-submit', work: 'work-c14', carrier: carrier.id, stream: 'stream-dev', sequence: 2, creator: 'bob', role: 'DEV', from: 'active', action: 'submit', to: 'review', references: [{ relation: 'depends_on', target: start.id }, { relation: 'reports', target: report.id }] })
      const approve = transition({ id: 'c14-03-approve', work: 'work-c14', carrier: carrier.id, stream: 'stream-qa', sequence: 1, creator: 'carol', role: 'QA', from: 'review', action: 'approve', to: 'done', references: [{ relation: 'depends_on', target: submit.id }, { relation: 'reviews', target: submit.id }] })
      const archive = transition({ id: 'c14-04-archive', work: 'work-c14', carrier: carrier.id, stream: 'stream-ops', sequence: 1, creator: 'dave', role: 'OPS', from: 'done', action: 'archive', to: 'archive', references: [{ relation: 'depends_on', target: approve.id }, { relation: 'archives', target: approve.id }] })
      const result = read([carrier, start, report, submit, approve, archive].map((value) => source(value)))
      return {
        result,
        context: {
          state: result.extensions.summary.work_state['work-c14'],
          node_count: result.nodes.length,
          node_ids: result.nodes.map((node) => node.id),
          issue_count: result.issues.length
        }
      }
    }
  }
]

export function fixtureSourceDigest() {
  return sha256(canonicalBytes(tests.map((test) => ({ id: test.id, name: test.name, assertions: test.assertions }))))
}
