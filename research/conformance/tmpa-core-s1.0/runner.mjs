import { readFile, readdir, rm, stat, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { canonicalBytes, compareUnicodeCodePoints, createReader, sha256, stable } from './reader.mjs'
import { fixtureSourceDigest, tests } from './fixtures.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const corpus = path.join(root, 'research/conformance/tmpa-core-s1.0')
const artifacts = path.join(corpus, 'artifacts')
const executedAt = process.env.TMPA_EXECUTED_AT ?? '2026-08-09T23:55:00Z'

async function json(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'))
}

async function fileDigest(relativePath) {
  return sha256(await readFile(path.join(root, relativePath)))
}

async function output(relativePath, value) {
  const target = path.join(corpus, 'artifacts', relativePath)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, canonicalBytes(value))
  return sha256(await readFile(target))
}

function getPointer(value, pointer) {
  if (pointer === '' || pointer === '/') return value
  return pointer.split('/').slice(1).reduce((current, token) => current?.[token.replaceAll('~1', '/').replaceAll('~0', '~')], value)
}

function evaluate(operator, actual, expected) {
  if (operator === 'equals') return JSON.stringify(stable(actual)) === JSON.stringify(stable(expected))
  if (operator === 'includes') return Array.isArray(actual) && actual.includes(expected)
  if (operator === 'not_includes') return Array.isArray(actual) && !actual.includes(expected)
  if (operator === 'all_equal') return Array.isArray(actual) && actual.length > 0 && actual.every((item) => item === expected)
  if (operator === 'contains_all') return Array.isArray(actual) && expected.every((item) => actual.includes(item))
  throw new Error(`Unknown assertion operator: ${operator}`)
}

function verdict(assertions) {
  const mandatory = assertions.filter((assertion) => assertion.mandatory)
  if (mandatory.some((assertion) => assertion.status === 'failed')) return 'FAIL'
  const executed = mandatory.filter((assertion) => assertion.status === 'passed')
  if (executed.length === mandatory.length && mandatory.length > 0) return 'PASS'
  if (executed.length > 0) return 'PARTIAL'
  return 'NOT RUN'
}

function aggregate(criteria) {
  const values = criteria.map((criterion) => criterion.verdict)
  if (values.includes('FAIL')) return 'FAIL'
  if (values.includes('PARTIAL')) return 'PARTIAL'
  if (values.includes('NOT RUN')) return 'NOT RUN'
  return 'PASS'
}

function counts(criteria) {
  return Object.fromEntries(['PASS', 'FAIL', 'PARTIAL', 'NOT RUN'].map((name) => [name, criteria.filter((criterion) => criterion.verdict === name).length]))
}

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory)
  const files = []
  for (const entry of entries.sort(compareUnicodeCodePoints)) {
    const absolute = path.join(directory, entry)
    const relative = path.join(prefix, entry).replaceAll('\\', '/')
    if ((await stat(absolute)).isDirectory()) files.push(...await listFiles(absolute, relative))
    else files.push({ path: relative, digest: sha256(await readFile(absolute)) })
  }
  return files
}

await rm(artifacts, { recursive: true, force: true })
await mkdir(path.join(artifacts, 'criteria'), { recursive: true })

const schemaPaths = {
  objectSchema: 'docs/public/spec/tmpa/s1.0/governance-object.schema.json',
  lifecycleSchema: 'docs/public/spec/tmpa/s1.0/lifecycle-profile.schema.json',
  readerSchema: 'docs/public/spec/tmpa/s1.0/reader-result.schema.json',
  conformanceSchema: 'docs/public/spec/tmpa/s1.0/conformance-result.schema.json'
}
const sourcePaths = {
  fixtures: 'research/conformance/tmpa-core-s1.0/fixtures.mjs',
  readerImplementation: 'research/conformance/tmpa-core-s1.0/reader.mjs',
  runner: 'research/conformance/tmpa-core-s1.0/runner.mjs',
  profile: 'research/conformance/tmpa-core-s1.0/profile.json',
  canonicalizationProfile: 'research/conformance/tmpa-core-s1.0/canonicalization-profile.json',
  productEvidence: 'research/conformance/tmpa-core-s1.0/product-evidence.json'
}

const [objectSchema, lifecycleSchema, readerSchema, conformanceSchema, profile, canonicalizationProfile, productEvidence] = await Promise.all([
  json(schemaPaths.objectSchema),
  json(schemaPaths.lifecycleSchema),
  json(schemaPaths.readerSchema),
  json(schemaPaths.conformanceSchema),
  json(sourcePaths.profile),
  json(sourcePaths.canonicalizationProfile),
  json(sourcePaths.productEvidence)
])

const ajv = new Ajv2020({ allErrors: true, strict: true })
addFormats(ajv)
for (const [name, schema] of Object.entries({ objectSchema, lifecycleSchema, readerSchema, conformanceSchema })) {
  try { ajv.compile(schema) } catch (error) { throw new Error(`${name} does not compile: ${error.message}`) }
}
const validateLifecycle = ajv.compile(lifecycleSchema)
if (!validateLifecycle(profile)) throw new Error(`Lifecycle profile invalid: ${JSON.stringify(validateLifecycle.errors)}`)

const sourceDigests = Object.fromEntries(await Promise.all(Object.entries({ ...schemaPaths, ...sourcePaths }).map(async ([name, relativePath]) => [name, await fileDigest(relativePath)])))
const versioned = (id, version, digest) => ({ id, version, digest })
const profileBundle = {
  conformance_profile: versioned(profile.id, profile.version, sourceDigests.profile),
  object_schema: versioned(objectSchema.$id, 'S1.0', sourceDigests.objectSchema),
  type_registry: versioned('tmpa-s1.0-case-types', '1.0.0', sourceDigests.profile),
  lifecycle_registry: versioned(profile.id, profile.version, sourceDigests.profile),
  role_registry: versioned('tmpa-s1.0-case-roles', '1.0.0', sourceDigests.profile),
  relation_registry: versioned('tmpa-s1.0-case-relations', '1.0.0', sourceDigests.profile),
  integrity_profile: versioned(`${canonicalizationProfile.id}-integrity`, canonicalizationProfile.version, sourceDigests.canonicalizationProfile),
  canonicalization_profile: versioned(canonicalizationProfile.id, canonicalizationProfile.version, sourceDigests.canonicalizationProfile)
}
const reader = createReader({ objectSchema, readerResultSchema: readerSchema, lifecycleProfile: profile, profileBundle })
const inputRecords = Object.entries({ fixtures: sourcePaths.fixtures, reader_implementation: sourcePaths.readerImplementation, profile: sourcePaths.profile, canonicalization_profile: sourcePaths.canonicalizationProfile, object_schema: schemaPaths.objectSchema, reader_schema: schemaPaths.readerSchema }).map(([sourceId, relativePath]) => ({
  source_id: sourceId,
  path: relativePath,
  media_type: relativePath.endsWith('.json') ? 'application/json' : 'text/javascript',
  byte_digest: sourceDigests[Object.keys({ ...schemaPaths, ...sourcePaths }).find((key) => ({ ...schemaPaths, ...sourcePaths })[key] === relativePath)]
}))

const referenceCriteria = []
const productCriteria = []
for (const test of tests) {
  const expected = {
    criterion: test.id,
    assertions: test.assertions.map(({ id, expected }) => ({ id, expected_status: 'passed', expected }))
  }
  const expectedDigest = sha256(canonicalBytes(expected))
  const manifest = {
    test_case_id: `S1.0-${test.id}-reference-001`,
    criterion: test.id,
    core_version: 'S1.0',
    object_schema: profileBundle.object_schema,
    output_schema: versioned(conformanceSchema.$id, 'S1.0', sourceDigests.conformanceSchema),
    profile: profileBundle.conformance_profile,
    registries: profileBundle,
    prerequisites: ['Node.js >= 20', 'AJV Draft 2020-12 format assertion'],
    inputs: inputRecords,
    assertions: test.assertions,
    expected_result_digest: expectedDigest,
    runner: { id: 'tmpa-s1.0-conformance-runner', version: '0.2.0', command: 'npm run tmpa:s1.0:conformance' },
    environment: { node: process.version, platform: process.platform, arch: process.arch },
    permutation: test.id === 'C11' ? { method: 'complete', count: 24, seed: null } : { method: 'none', count: 1, seed: null },
    evidence_paths: {
      criterion_record: `research/conformance/tmpa-core-s1.0/artifacts/criteria/${test.id}.json`,
      reference_result: 'research/conformance/tmpa-core-s1.0/artifacts/reference-result.json',
      product_result: 'research/conformance/tmpa-core-s1.0/artifacts/product-result.json'
    }
  }
  const manifestDigest = sha256(canonicalBytes(manifest))
  const executed = test.run(reader.read)
  const referenceAssertions = test.assertions.map((spec) => {
    const actual = getPointer(executed.context, spec.target)
    const passed = evaluate(spec.operator, actual, spec.expected)
    return { id: spec.id, mandatory: spec.mandatory, status: passed ? 'passed' : 'failed', actual, expected: spec.expected }
  })
  const referenceActual = {
    criterion: test.id,
    assertions: referenceAssertions,
    reader_result_digest: sha256(canonicalBytes(executed.result)),
    reader_result: executed.result
  }
  const referenceVerdict = verdict(referenceAssertions)
  const referenceResultDigest = sha256(canonicalBytes(referenceActual))
  referenceCriteria.push({ id: test.id, verdict: referenceVerdict, run_state: 'completed', manifest_digest: manifestDigest, result_digest: referenceResultDigest })

  const product = productEvidence.criteria.find((criterion) => criterion.id === test.id)
  if (!product) throw new Error(`Missing product evidence for ${test.id}`)
  const productVerdict = verdict(product.assertions)
  const productActual = { criterion: test.id, assertions: product.assertions, verdict: productVerdict }
  const productResultDigest = sha256(canonicalBytes(productActual))
  productCriteria.push({ id: test.id, verdict: productVerdict, run_state: 'completed', manifest_digest: manifestDigest, result_digest: productResultDigest })

  await output(`criteria/${test.id}.json`, {
    manifest,
    manifest_digest: manifestDigest,
    expected,
    expected_result_digest: expectedDigest,
    reference: { ...referenceActual, verdict: referenceVerdict, result_digest: referenceResultDigest },
    product: { ...productActual, result_digest: productResultDigest }
  })
}

const referenceResult = {
  core_version: 'S1.0',
  implementation: { id: 'tmpa-s1.0-reference-reader', version: '0.2.0' },
  input_bundle_digest: sha256(canonicalBytes({ profileBundle, fixture_source_digest: fixtureSourceDigest(), sourceDigests })),
  criteria: referenceCriteria,
  aggregate_verdict: aggregate(referenceCriteria),
  evidence_level: 'demonstrated'
}
const productResult = {
  core_version: 'S1.0',
  implementation: { id: 'no-s1.0-product-baseline', version: 'not-run' },
  input_bundle_digest: sha256(canonicalBytes({ productEvidence, profileBundle })),
  criteria: productCriteria,
  aggregate_verdict: aggregate(productCriteria),
  evidence_level: 'specified'
}
const validateConformance = ajv.compile(conformanceSchema)
for (const [name, result] of Object.entries({ referenceResult, productResult })) {
  if (!validateConformance(result)) throw new Error(`${name} invalid: ${JSON.stringify(validateConformance.errors)}`)
}

const referenceDigest = await output('reference-result.json', referenceResult)
const productDigest = await output('product-result.json', productResult)
const summary = {
  corpus_id: productEvidence.baseline_id,
  core_version: 'S1.0',
  executed_at: executedAt,
  reference_reader: { aggregate_verdict: referenceResult.aggregate_verdict, counts: counts(referenceCriteria), digest: referenceDigest },
  product_baseline: { aggregate_verdict: productResult.aggregate_verdict, counts: counts(productCriteria), digest: productDigest },
  prior_version_evidence: { core_version: 'S0.6', report: 'I0.8', product: 'CodeFlowMu V1.6.0', verdict: '14 PASS / 0 FAIL', relabeled_as_s1_0: false },
  claim_boundary: 'The Reference Reader demonstrates the tested S1.0 paths. No exact S1.0 product run or independent validation is claimed. I0.8 remains exact-version S0.6 author-run evidence and is not relabeled.'
}
await output('summary.json', summary)
await output('run-log.json', {
  executed_at: executedAt,
  command: 'TMPA_EXECUTED_AT=2026-08-10T23:55:00Z npm run tmpa:s1.0:conformance',
  environment: { node: process.version, platform: process.platform, arch: process.arch },
  source_digests: sourceDigests,
  reference_criteria: referenceCriteria,
  product_criteria: productCriteria
})

const files = (await listFiles(corpus)).filter((item) => item.path !== 'artifacts/file-manifest.json')
await output('file-manifest.json', {
  corpus_id: productEvidence.baseline_id,
  generated_at: executedAt,
  files
})

console.log(JSON.stringify(summary, null, 2))
if (referenceResult.aggregate_verdict !== 'PASS') process.exitCode = 1
