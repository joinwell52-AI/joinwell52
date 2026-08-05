import { createHash } from 'node:crypto'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

export function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
  }
  return value
}

export function canonicalBytes(value) {
  return Buffer.from(`${JSON.stringify(stable(value))}\n`, 'utf8')
}

export function sha256(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value)
  return `sha256:${createHash('sha256').update(bytes).digest('hex')}`
}

export function objectDigest(object) {
  const covered = structuredClone(object)
  covered.integrity = { ...covered.integrity, digest: '' }
  delete covered.integrity.signature_algorithm
  delete covered.integrity.key_id
  delete covered.integrity.signature
  return sha256(canonicalBytes(covered))
}

export function finalizeObject(object) {
  const value = structuredClone(object)
  value.integrity.digest = objectDigest(value)
  return value
}

const invalidCodes = new Set([
  'SCHEMA_INVALID',
  'UNKNOWN_TYPE',
  'INTEGRITY_MISMATCH',
  'DUPLICATE_ID_CONFLICT',
  'STREAM_DUPLICATE_SEQUENCE',
  'AUTHORITY_DENIED',
  'SOD_VIOLATION',
  'ILLEGAL_TRANSITION',
  'PROHIBITED_CYCLE'
])

const quarantineCodes = new Set([
  'SCHEMA_INVALID',
  'UNKNOWN_TYPE',
  'INTEGRITY_MISMATCH',
  'DUPLICATE_ID_CONFLICT',
  'STREAM_DUPLICATE_SEQUENCE',
  'PROHIBITED_CYCLE'
])

const disputedCodes = new Set(['PRIMARY_CARRIER_CONFLICT', 'UNRESOLVED_CONFLICT'])
const severityOrder = new Map([['critical', 0], ['error', 1], ['warning', 2], ['info', 3]])

function compareTuple(a, b) {
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const left = String(a[index] ?? '')
    const right = String(b[index] ?? '')
    if (left !== right) return left.localeCompare(right, 'en', { sensitivity: 'variant' })
  }
  return 0
}

function issueSeverity(code) {
  if (['DUPLICATE_ID_CONFLICT', 'PROHIBITED_CYCLE'].includes(code)) return 'critical'
  if (invalidCodes.has(code)) return 'error'
  return 'warning'
}

function issueJudgment(code) {
  return invalidCodes.has(code) ? 'invalid' : 'undetermined'
}

function setNodeJudgment(node, judgment, viewState) {
  if (!node) return
  if (node.judgment === 'invalid') return
  if (judgment === 'invalid' || node.judgment === 'valid') {
    node.judgment = judgment
    node.view_state = viewState
  }
}

function cycleNodes(edges) {
  const adjacency = new Map()
  for (const edge of edges) {
    if (!adjacency.has(edge.source_id)) adjacency.set(edge.source_id, [])
    adjacency.get(edge.source_id).push(edge.target_id)
  }
  const visiting = new Set()
  const visited = new Set()
  const stack = []
  const found = new Set()

  function visit(node) {
    if (visiting.has(node)) {
      const start = stack.indexOf(node)
      for (const member of stack.slice(start)) found.add(member)
      return
    }
    if (visited.has(node)) return
    visiting.add(node)
    stack.push(node)
    for (const target of adjacency.get(node) ?? []) visit(target)
    stack.pop()
    visiting.delete(node)
    visited.add(node)
  }

  for (const node of [...adjacency.keys()].sort()) visit(node)
  return found
}

function orderTransitions(candidates) {
  const pending = new Map(candidates.map((candidate) => [candidate.object.id, candidate]))
  const ordered = []
  while (pending.size) {
    const ready = [...pending.values()].filter((candidate) => {
      const dependencies = candidate.object.references
        .filter((reference) => reference.relation === 'depends_on')
        .map((reference) => reference.target)
      return dependencies.every((dependency) => !pending.has(dependency))
    }).sort((a, b) => a.object.id.localeCompare(b.object.id))
    const selected = ready[0] ?? [...pending.values()].sort((a, b) => a.object.id.localeCompare(b.object.id))[0]
    ordered.push(selected)
    pending.delete(selected.object.id)
  }
  return ordered
}

export function createReader({ objectSchema, readerResultSchema, lifecycleProfile, profileBundle }) {
  const ajv = new Ajv2020({ allErrors: true, strict: true })
  addFormats(ajv)
  const validateObject = ajv.compile(objectSchema)
  const validateResult = ajv.compile(readerResultSchema)
  const allowedTypes = new Set(lifecycleProfile.extensions.document_types)
  const transitionMap = new Map(lifecycleProfile.transitions.map((item) => [
    `${item.from}\u0000${item.action}\u0000${item.to}`,
    item
  ]))
  const assignments = lifecycleProfile.extensions.assignments
  const acyclicRelations = new Set(lifecycleProfile.extensions.acyclic_relations)
  const acceptanceProfile = lifecycleProfile.acceptance
  const workGraphProfile = lifecycleProfile.work_graph
  const riskProfile = lifecycleProfile.risk_policy
  const profileDigest = profileBundle.conformance_profile.digest

  function read(sources) {
    const sourceRecords = sources.map((source) => ({
      ...source,
      byte_digest: sha256(source.bytes)
    })).sort((a, b) => a.source_id.localeCompare(b.source_id))

    const sourceSetDigest = sha256(canonicalBytes(sourceRecords.map(({ source_id, byte_digest }) => ({ source_id, byte_digest }))))
    const issues = []
    const parsed = []

    function addIssue(code, sourceId, objectId = '', relation = '', targetId = '', parameters = {}) {
      const tuple = { code, object_id: objectId, relation, target_id: targetId, profile_digest: profileDigest }
      const issueId = sha256(canonicalBytes(tuple))
      if (issues.some((item) => item.issue_id === issueId)) return
      issues.push({
        issue_id: issueId,
        code,
        severity: issueSeverity(code),
        source_id: sourceId,
        ...(objectId ? { source_object_id: objectId } : {}),
        object_id: objectId,
        ...(relation ? { relation } : {}),
        ...(targetId ? { target_id: targetId } : {}),
        message: JSON.stringify(stable(parameters))
      })
    }

    for (const source of sourceRecords) {
      let object
      try {
        object = JSON.parse(source.bytes.toString('utf8'))
      } catch {
        addIssue('SCHEMA_INVALID', source.source_id, '', '', '', { reason: 'json_parse' })
        continue
      }
      if (!validateObject(object)) {
        addIssue('SCHEMA_INVALID', source.source_id, object.id ?? '', '', '', {
          errors: validateObject.errors.map((error) => `${error.instancePath}:${error.keyword}`).sort()
        })
        continue
      }
      if (!allowedTypes.has(object.type)) {
        addIssue('UNKNOWN_TYPE', source.source_id, object.id, '', '', { type: object.type })
        continue
      }
      if (object.integrity.digest !== objectDigest(object)) {
        addIssue('INTEGRITY_MISMATCH', source.source_id, object.id)
        continue
      }
      parsed.push({ source, object, canonical_digest: sha256(canonicalBytes(object)) })
    }

    const groups = new Map()
    for (const candidate of parsed) {
      if (!groups.has(candidate.object.id)) groups.set(candidate.object.id, [])
      groups.get(candidate.object.id).push(candidate)
    }
    const accepted = []
    for (const [id, candidates] of [...groups.entries()].sort()) {
      const distinct = new Set(candidates.map((candidate) => candidate.canonical_digest))
      if (distinct.size > 1) {
        addIssue('DUPLICATE_ID_CONFLICT', candidates[0].source.source_id, id, '', '', {
          source_ids: candidates.map((candidate) => candidate.source.source_id).sort()
        })
        continue
      }
      accepted.push(candidates.sort((a, b) => a.source.source_id.localeCompare(b.source.source_id))[0])
    }

    const byId = new Map(accepted.map((candidate) => [candidate.object.id, candidate]))
    const nodes = accepted.map(({ object, source, canonical_digest }) => ({
      id: object.id,
      source_object_id: object.id,
      source_ids: [source.source_id],
      canonical_digest,
      governed_work_id: object.governed_work.id,
      primary_carrier_id: object.governed_work.primary_carrier_id,
      ...(object.governed_work.parent_id ? { parent_work_id: object.governed_work.parent_id } : {}),
      ...(object.governed_work.thread_id ? { thread_id: object.governed_work.thread_id } : {}),
      type: object.type,
      stream_id: object.stream.id,
      stream_sequence: object.stream.sequence,
      role: object.role,
      creator: object.creator,
      judgment: 'valid',
      view_state: 'authoritative'
    }))
    const nodeById = new Map(nodes.map((node) => [node.id, node]))

    const workGroups = new Map()
    for (const candidate of accepted) {
      const workId = candidate.object.governed_work.id
      if (!workGroups.has(workId)) workGroups.set(workId, [])
      workGroups.get(workId).push(candidate)
    }

    for (const [workId, candidates] of [...workGroups.entries()].sort()) {
      const carriers = [...new Set(candidates.map((candidate) => candidate.object.governed_work.primary_carrier_id))].sort()
      if (carriers.length > 1 || !carriers.every((carrier) => byId.has(carrier))) {
        addIssue('PRIMARY_CARRIER_CONFLICT', candidates[0].source.source_id, candidates[0].object.id, '', '', { work_id: workId, carriers })
        for (const candidate of candidates) setNodeJudgment(nodeById.get(candidate.object.id), 'undetermined', 'disputed')
      }
    }

    const streamGroups = new Map()
    for (const candidate of accepted) {
      const streamId = candidate.object.stream.id
      if (!streamGroups.has(streamId)) streamGroups.set(streamId, [])
      streamGroups.get(streamId).push(candidate)
    }
    for (const [streamId, candidates] of [...streamGroups.entries()].sort()) {
      const sequenceGroups = new Map()
      for (const candidate of candidates) {
        const sequence = candidate.object.stream.sequence
        if (!sequenceGroups.has(sequence)) sequenceGroups.set(sequence, [])
        sequenceGroups.get(sequence).push(candidate)
      }
      for (const [sequence, members] of [...sequenceGroups.entries()].sort((a, b) => a[0] - b[0])) {
        if (members.length > 1) {
          addIssue('STREAM_DUPLICATE_SEQUENCE', members[0].source.source_id, members[0].object.id, '', '', { stream_id: streamId, sequence })
          for (const member of members) setNodeJudgment(nodeById.get(member.object.id), 'invalid', 'quarantined')
        }
      }
      const sequences = [...sequenceGroups.keys()].sort((a, b) => a - b)
      for (let expected = sequences[0] ?? 1; expected <= (sequences.at(-1) ?? 0); expected += 1) {
        if (!sequenceGroups.has(expected)) {
          addIssue('STREAM_GAP', candidates[0].source.source_id, candidates[0].object.id, '', '', { stream_id: streamId, sequence: expected })
        }
      }
    }

    const edges = []
    for (const candidate of accepted) {
      for (const reference of candidate.object.references) {
        const edgeId = sha256(canonicalBytes({ source_id: candidate.object.id, relation: reference.relation, target_id: reference.target }))
        edges.push({
          id: edgeId,
          source_object_id: candidate.object.id,
          source_id: candidate.object.id,
          relation: reference.relation,
          target_id: reference.target,
          ordering: lifecycleProfile.extensions.ordering_relations.includes(reference.relation)
        })
        if (!byId.has(reference.target)) {
          addIssue('MISSING_REFERENCE', candidate.source.source_id, candidate.object.id, reference.relation, reference.target)
          setNodeJudgment(nodeById.get(candidate.object.id), 'undetermined', 'partial')
        }
      }
    }

    for (const candidate of accepted) {
      const object = candidate.object
      for (const claim of object.claims ?? []) {
        const missingEvidence = claim.evidence.filter((id) => !byId.has(id))
        const completionClaim = workGraphProfile.completion_claim_predicates.includes(claim.predicate)
        if (missingEvidence.length || (completionClaim && claim.evidence.length === 0)) {
          addIssue('CLAIM_EVIDENCE_MISSING', candidate.source.source_id, object.id, 'evidences', missingEvidence[0] ?? '', {
            claim_id: claim.id,
            predicate: claim.predicate,
            missing_evidence: missingEvidence
          })
          setNodeJudgment(nodeById.get(object.id), 'undetermined', 'partial')
        }
      }

      const requiresHuman = object.risk?.requires_human_approval === true || riskProfile.human_approval_levels.includes(object.risk?.level)
      if (requiresHuman) {
        const approved = object.references.some((reference) => {
          if (!riskProfile.approval_relations.includes(reference.relation)) return false
          const approval = byId.get(reference.target)?.object
          return approval
            && riskProfile.approval_roles.includes(approval.role)
            && ['approve', 'approved'].includes(approval.content.body?.decision)
        })
        if (!approved) {
          addIssue('HUMAN_APPROVAL_REQUIRED', candidate.source.source_id, object.id, '', '', { risk_level: object.risk?.level ?? 'unspecified' })
          setNodeJudgment(nodeById.get(object.id), 'undetermined', 'pending_human')
        }
      }
    }

    const prohibitedEdges = edges.filter((edge) => acyclicRelations.has(edge.relation) && byId.has(edge.target_id))
    const membersInCycle = cycleNodes(prohibitedEdges)
    if (membersInCycle.size) {
      const members = [...membersInCycle].sort()
      addIssue('PROHIBITED_CYCLE', byId.get(members[0]).source.source_id, members[0], '', '', { members })
      for (const member of members) setNodeJudgment(nodeById.get(member), 'invalid', 'quarantined')
    }

    const workState = {}
    const responsibility = {}
    const acceptanceState = {}
    for (const [workId, candidates] of [...workGroups.entries()].sort()) {
      let current = lifecycleProfile.initial_state
      let currentRole = candidates.find((candidate) => candidate.object.id === candidate.object.governed_work.primary_carrier_id)?.object.role ?? ''
      let acceptedForWork = false
      const transitions = orderTransitions(candidates.filter((candidate) => candidate.object.lifecycle.transition))
      for (const candidate of transitions) {
        const object = candidate.object
        const node = nodeById.get(object.id)
        if (node?.judgment === 'invalid') continue
        const transition = object.lifecycle.transition
        const definition = transitionMap.get(`${transition.from}\u0000${transition.action}\u0000${transition.to}`)
        if (!definition) {
          addIssue('ILLEGAL_TRANSITION', candidate.source.source_id, object.id, '', '', transition)
          setNodeJudgment(node, 'invalid', 'rejected')
          continue
        }
        if (transition.from !== current) {
          addIssue('LIFECYCLE_UNDETERMINED', candidate.source.source_id, object.id, '', '', { expected_from: current, actual_from: transition.from })
          setNodeJudgment(node, 'undetermined', 'partial')
          continue
        }
        const identityAssignments = assignments.filter((assignment) => assignment.identity === object.creator && assignment.role === object.role)
        if (!identityAssignments.length) {
          addIssue('AUTHORITY_UNDETERMINED', candidate.source.source_id, object.id, '', '', { action: transition.action })
          setNodeJudgment(node, 'undetermined', 'partial')
          continue
        }
        if (!identityAssignments.some((assignment) => assignment.actions.includes(transition.action))) {
          addIssue('AUTHORITY_DENIED', candidate.source.source_id, object.id, '', '', { action: transition.action })
          setNodeJudgment(node, 'invalid', 'rejected')
          continue
        }
        if (!definition.allowed_roles.includes(object.role)) {
          addIssue('AUTHORITY_DENIED', candidate.source.source_id, object.id, '', '', { action: transition.action, role: object.role })
          setNodeJudgment(node, 'invalid', 'rejected')
          continue
        }
        const missingRequired = definition.required_relations.filter((relation) => !object.references.some((reference) => reference.relation === relation && byId.has(reference.target)))
        if (missingRequired.length) {
          addIssue('LIFECYCLE_UNDETERMINED', candidate.source.source_id, object.id, missingRequired[0], '', { missing_relations: missingRequired })
          setNodeJudgment(node, 'undetermined', 'partial')
          continue
        }
        if (transition.action === 'approve') {
          const reviewed = object.references.find((reference) => reference.relation === 'reviews')
          if (reviewed && byId.get(reviewed.target)?.object.creator === object.creator) {
            addIssue('SOD_VIOLATION', candidate.source.source_id, object.id, 'reviews', reviewed.target)
            setNodeJudgment(node, 'invalid', 'rejected')
            continue
          }
        }
        if (acceptanceProfile.states_requiring_acceptance.includes(transition.to) && !acceptedForWork) {
          const acceptanceReference = object.references.find((reference) => acceptanceProfile.acceptance_relations.includes(reference.relation) && byId.has(reference.target))
          const acceptedTarget = acceptanceReference ? byId.get(acceptanceReference.target)?.object : null
          const roleAllowed = acceptanceProfile.allowed_roles.includes(object.role)
          const independent = !acceptanceProfile.requires_independent_actor || (acceptedTarget && acceptedTarget.creator !== object.creator)
          if (!acceptanceReference || !roleAllowed || !independent) {
            addIssue('ACCEPTANCE_UNDETERMINED', candidate.source.source_id, object.id, acceptanceReference?.relation ?? '', acceptanceReference?.target ?? '', {
              role_allowed: roleAllowed,
              independent,
              target_state: transition.to
            })
            setNodeJudgment(node, 'undetermined', 'partial')
            continue
          }
          acceptedForWork = true
        }
        current = transition.to
        currentRole = object.role
      }
      workState[workId] = current
      responsibility[workId] = currentRole
      acceptanceState[workId] = acceptedForWork ? 'accepted' : acceptanceProfile.states_requiring_acceptance.includes(current) ? 'undetermined' : 'not_required'
    }

    for (const candidate of accepted.filter((item) => item.object.type === 'STATE_OBSERVATION')) {
      const observedState = candidate.object.content.body?.state
      const workId = candidate.object.governed_work.id
      if (typeof observedState === 'string' && workState[workId] !== undefined && observedState !== workState[workId]) {
        addIssue('STATE_EVIDENCE_CONFLICT', candidate.source.source_id, candidate.object.id, '', '', {
          reconstructed_state: workState[workId],
          observed_state: observedState,
          work_id: workId
        })
        setNodeJudgment(nodeById.get(candidate.object.id), 'undetermined', 'disputed')
      }
    }

    const childrenByParent = new Map()
    for (const [workId, candidates] of workGroups) {
      const parentId = candidates.map((candidate) => candidate.object.governed_work.parent_id).find(Boolean)
      if (!parentId) continue
      if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, [])
      childrenByParent.get(parentId).push(workId)
    }
    for (const [workId, state] of Object.entries(workState)) {
      if (!acceptanceProfile.states_requiring_acceptance.includes(state)) continue
      const candidates = workGroups.get(workId) ?? []
      const carrier = candidates.find((candidate) => candidate.object.id === candidate.object.governed_work.primary_carrier_id) ?? candidates[0]
      const openChildren = (childrenByParent.get(workId) ?? []).filter((childId) => !workGraphProfile.child_terminal_states.includes(workState[childId]))
      if (openChildren.length) {
        addIssue('CHILD_WORK_OPEN', carrier.source.source_id, carrier.object.id, 'parent', '', { work_id: workId, open_children: openChildren.sort() })
        setNodeJudgment(nodeById.get(carrier.object.id), 'undetermined', 'partial')
        acceptanceState[workId] = 'undetermined'
      }
      const hasResponse = candidates.some((candidate) => candidate.object.type === 'REPORT')
      if (!hasResponse) {
        addIssue('RECIPROCITY_MISSING', carrier.source.source_id, carrier.object.id, '', '', { work_id: workId })
        setNodeJudgment(nodeById.get(carrier.object.id), 'undetermined', 'partial')
        acceptanceState[workId] = 'undetermined'
      }
    }

    const reviews = accepted.filter((candidate) => candidate.object.type === 'REVIEW' && candidate.object.content.body?.decision)
    const reviewGroups = new Map()
    for (const review of reviews) {
      const target = review.object.references.find((reference) => reference.relation === 'reviews')?.target
      if (!target) continue
      if (!reviewGroups.has(target)) reviewGroups.set(target, [])
      reviewGroups.get(target).push(review)
    }
    const decisions = accepted.filter((candidate) => candidate.object.type === 'DECISION')
    for (const [target, members] of [...reviewGroups.entries()].sort()) {
      const values = new Set(members.map((member) => member.object.content.body.decision))
      if (values.size < 2) continue
      const memberIds = new Set(members.map((member) => member.object.id))
      const resolved = decisions.some((decision) => {
        const resolvedIds = decision.object.references.filter((reference) => reference.relation === 'resolves').map((reference) => reference.target)
        return [...memberIds].every((id) => resolvedIds.includes(id)) && memberIds.has(decision.object.content.body?.selects)
      })
      if (!resolved) {
        addIssue('UNRESOLVED_CONFLICT', members[0].source.source_id, members[0].object.id, 'reviews', target, { reviews: [...memberIds].sort() })
        for (const member of members) setNodeJudgment(nodeById.get(member.object.id), 'undetermined', 'disputed')
      }
    }

    nodes.sort((a, b) => compareTuple([a.id, a.source_object_id], [b.id, b.source_object_id]))
    edges.sort((a, b) => compareTuple([a.source_id, a.relation, a.target_id, a.id], [b.source_id, b.relation, b.target_id, b.id]))
    issues.sort((a, b) => {
      const severity = (severityOrder.get(a.severity) ?? 9) - (severityOrder.get(b.severity) ?? 9)
      return severity || compareTuple(
        [a.code, a.object_id, a.relation, a.target_id, a.issue_id],
        [b.code, b.object_id, b.relation, b.target_id, b.issue_id]
      )
    })

    const hasInvalid = issues.some((issue) => issueJudgment(issue.code) === 'invalid')
    const hasUndetermined = issues.some((issue) => issueJudgment(issue.code) === 'undetermined')
    const judgment = hasInvalid ? 'invalid' : hasUndetermined ? 'undetermined' : 'valid'
    let viewState = 'authoritative'
    if (issues.some((issue) => quarantineCodes.has(issue.code))) viewState = 'quarantined'
    else if (hasInvalid) viewState = 'rejected'
    else if (issues.some((issue) => disputedCodes.has(issue.code))) viewState = 'disputed'
    else if (issues.some((issue) => issue.code === 'HUMAN_APPROVAL_REQUIRED')) viewState = 'pending_human'
    else if (hasUndetermined) viewState = 'partial'

    const result = {
      core_version: 'S0.5',
      output_version: '1',
      profile: profileBundle,
      reader: { id: 'tmpa-s0.5-reference-reader', version: '0.1.0' },
      source_set_digest: sourceSetDigest,
      judgment,
      view_state: viewState,
      authentication_state: 'not_applicable',
      nodes,
      edges,
      issues,
      extensions: { summary: { work_state: stable(workState), acceptance_state: stable(acceptanceState), responsibility: stable(responsibility) } }
    }
    if (!validateResult(result)) throw new Error(`Reader emitted invalid result: ${JSON.stringify(validateResult.errors)}`)
    return result
  }

  return { read }
}
