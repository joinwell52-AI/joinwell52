import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')
const schedulerPath = 'research/runtime/SCHEDULER.json'
const configPath = 'research/runtime/worker-prompts/CONFIG.json'

function fail(message) {
  console.error(`worker-prompts: ${message}`)
  process.exit(1)
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'))
}

function readText(path) {
  return readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n')
}

function list(items) {
  return items.map((item) => `- \`${item}\``).join('\n')
}

function renderTemplate(template, values, templatePath) {
  const rendered = template.replace(/\{\{([A-Za-z0-9]+)\}\}/g, (_, key) => {
    if (!(key in values)) fail(`${templatePath}: unknown placeholder {{${key}}}`)
    return String(values[key])
  })
  const unresolved = rendered.match(/\{\{[^}]+\}\}/g)
  if (unresolved) fail(`${templatePath}: unresolved placeholders ${unresolved.join(', ')}`)
  return rendered.endsWith('\n') ? rendered : `${rendered}\n`
}

function compile() {
  const scheduler = readJson(schedulerPath)
  const config = readJson(configPath)

  if (config.schema !== 'research-runtime-worker-prompt-config/v1') fail(`${configPath}: invalid schema`)
  if (config.promptSchema !== 'research-runtime-worker-prompt/v1') fail(`${configPath}: invalid promptSchema`)
  if (config.control?.schema !== 'research-runtime-worker-control/v1') fail(`${configPath}: invalid control schema`)
  if (!['active', 'paused', 'disabled'].includes(config.control?.state)) fail(`${configPath}: invalid global control state`)
  for (const field of ['allowedBranches', 'allowedWakeSources', 'requiredCapabilities']) {
    if (!Array.isArray(config.control[field]) || config.control[field].length === 0) fail(`${configPath}: ${field} must not be empty`)
  }
  if (!Array.isArray(config.tasks) || config.tasks.length === 0) fail(`${configPath}: tasks must not be empty`)

  const outputs = []
  const manifestTasks = {}

  for (const entry of config.tasks) {
    const task = scheduler.tasks.find((candidate) => candidate.id === entry.task)
    if (!task) fail(`${configPath}: unknown Scheduler task ${entry.task}`)
    if (!entry.template || !entry.output || !entry.version || !entry.effectiveDate) {
      fail(`${configPath}: incomplete config for ${entry.task}`)
    }
    if (!Array.isArray(entry.requiredSources) || entry.requiredSources.length === 0) {
      fail(`${configPath}: requiredSources missing for ${entry.task}`)
    }
    if (!['active', 'paused', 'disabled'].includes(entry.control?.state)) fail(`${configPath}: invalid control state for ${entry.task}`)
    if (entry.control.notBefore !== task.schedule.time) fail(`${configPath}: ${entry.task} notBefore must match Scheduler time`)
    for (const field of ['maxRunMinutes', 'maxRecoveryAttempts', 'maxRevisionRounds', 'maxCandidates']) {
      if (!Number.isInteger(entry.control[field]) || entry.control[field] < 0) fail(`${configPath}: invalid ${field} for ${entry.task}`)
    }
    for (const source of entry.requiredSources) {
      if (!existsSync(resolve(root, source))) fail(`${configPath}: required source does not exist: ${source}`)
    }

    const values = {
      repository: scheduler.repository,
      timezone: scheduler.timezone,
      schedulerSchema: scheduler.schema,
      schedulerVersion: scheduler.version,
      publicationCandidateContract: scheduler.publicationCandidateContract,
      taskId: task.id,
      taskName: task.name,
      taskFamily: task.family,
      scheduleTime: task.schedule.time,
      scheduleCron: task.schedule.cron,
      taskWork: task.work,
      taskOutput: task.output,
      taskSkills: list(task.skills),
      taskProhibitions: list(task.prohibitions),
      requiredSources: list(entry.requiredSources),
      requiredCommands: list(entry.requiredCommands || [])
    }

    const body = renderTemplate(readText(entry.template), values, entry.template)
    const header = [
      '<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->',
      `<!-- schema: ${config.promptSchema} -->`,
      `<!-- task: ${task.id} -->`,
      `<!-- prompt-version: ${entry.version} -->`,
      `<!-- scheduler-version: ${scheduler.version} -->`,
      `<!-- template: ${entry.template} -->`,
      ''
    ].join('\n')
    const content = `${header}${body}`
    const sha256 = createHash('sha256').update(content, 'utf8').digest('hex')

    outputs.push({ path: entry.output, content })
    manifestTasks[task.id] = {
      schema: config.promptSchema,
      version: entry.version,
      effectiveDate: entry.effectiveDate,
      family: task.family,
      schedule: task.schedule,
      path: entry.output,
      sha256,
      template: entry.template,
      requiredSources: entry.requiredSources
    }
  }

  const manifest = {
    schema: 'research-runtime-worker-prompt-manifest/v1',
    repository: scheduler.repository,
    sourceBranch: config.sourceBranch,
    scheduler: schedulerPath,
    schedulerSchema: scheduler.schema,
    schedulerVersion: scheduler.version,
    timezone: scheduler.timezone,
    promptSchema: config.promptSchema,
    tasks: manifestTasks
  }
  outputs.push({ path: config.manifestPath, content: `${JSON.stringify(manifest, null, 2)}\n` })

  const control = {
    schema: config.control.schema,
    version: config.control.version,
    repository: scheduler.repository,
    sourceBranch: config.sourceBranch,
    scheduler: schedulerPath,
    promptManifest: config.manifestPath,
    state: config.control.state,
    failClosed: config.control.failClosed,
    allowedBranches: config.control.allowedBranches,
    allowedWakeSources: config.control.allowedWakeSources,
    globalSerialExecution: config.control.globalSerialExecution,
    runtimeAuthorityRequired: config.control.runtimeAuthorityRequired,
    requiredCapabilities: config.control.requiredCapabilities,
    tasks: Object.fromEntries(config.tasks.map((entry) => {
      const prompt = manifestTasks[entry.task]
      return [entry.task, {
        state: entry.control.state,
        effectiveDate: entry.effectiveDate,
        family: prompt.family,
        schedule: prompt.schedule,
        notBefore: entry.control.notBefore,
        lateWakePolicy: entry.control.lateWakePolicy,
        maxRunMinutes: entry.control.maxRunMinutes,
        maxRecoveryAttempts: entry.control.maxRecoveryAttempts,
        maxRevisionRounds: entry.control.maxRevisionRounds,
        maxCandidates: entry.control.maxCandidates,
        zeroOutputAllowed: entry.control.zeroOutputAllowed,
        directPublicationAllowed: entry.control.directPublicationAllowed,
        requireSameRunDateInputs: entry.control.requireSameRunDateInputs,
        requirePromptHashVerification: entry.control.requirePromptHashVerification,
        requireRemoteCommitVerification: entry.control.requireRemoteCommitVerification,
        prompt: {
          schema: prompt.schema,
          version: prompt.version,
          path: prompt.path,
          sha256: prompt.sha256,
          requiredSources: prompt.requiredSources
        }
      }]
    }))
  }
  outputs.push({ path: config.controlPath, content: `${JSON.stringify(control, null, 2)}\n` })

  return { scheduler, config, outputs }
}

function build() {
  const { outputs } = compile()
  for (const output of outputs) {
    const target = resolve(root, output.path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, output.content, 'utf8')
    console.log(`generated ${output.path}`)
  }
}

function validate() {
  const { scheduler, config, outputs } = compile()
  if (scheduler.workerPromptManifest !== config.manifestPath) {
    fail(`${schedulerPath}: workerPromptManifest must equal ${config.manifestPath}`)
  }
  if (scheduler.workerControlManifest !== config.controlPath) {
    fail(`${schedulerPath}: workerControlManifest must equal ${config.controlPath}`)
  }
  for (const output of outputs) {
    const target = resolve(root, output.path)
    if (!existsSync(target)) fail(`${output.path}: missing; run npm run worker-prompts:build`)
    const actual = readText(output.path)
    if (actual !== output.content) fail(`${output.path}: drift detected; run npm run worker-prompts:build`)
  }
  console.log(`worker-prompts: validated ${config.tasks.length} generated prompt(s)`)
}

function parseOptions(argv) {
  const options = {}
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) continue
    options[token.slice(2)] = argv[index + 1]
    index += 1
  }
  return options
}

function localClock(timezone, now) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(now).map((part) => [part.type, part.value]))
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` }
}

function resolveAdmission() {
  validate()
  const options = parseOptions(process.argv.slice(3))
  const config = readJson(configPath)
  const control = readJson(config.controlPath)
  const scheduler = readJson(schedulerPath)
  const taskId = options.task
  const task = control.tasks[taskId]
  const branch = options.branch || ''
  const wakeSource = options['wake-source'] || ''
  const capabilities = new Set((options.capabilities || '').split(',').filter(Boolean))
  const now = options.now ? new Date(options.now) : new Date()
  if (Number.isNaN(now.valueOf())) fail('resolve: --now must be an ISO-8601 timestamp')
  const clock = localClock(scheduler.timezone, now)
  const reasons = []

  if (!task) reasons.push(`unknown task ${taskId || '(missing)'}`)
  if (control.state !== 'active') reasons.push(`global control is ${control.state}`)
  if (task && task.state !== 'active') reasons.push(`${taskId} control is ${task.state}`)
  if (!control.allowedBranches.includes(branch)) reasons.push(`branch ${branch || '(missing)'} is not allowed`)
  if (!control.allowedWakeSources.includes(wakeSource)) reasons.push(`wake source ${wakeSource || '(missing)'} is not allowed`)
  for (const capability of control.requiredCapabilities) {
    if (!capabilities.has(capability)) reasons.push(`missing capability ${capability}`)
  }
  if (task && clock.date < task.effectiveDate) reasons.push(`${taskId} is not effective until ${task.effectiveDate}`)
  if (task && clock.time < task.notBefore) reasons.push(`${taskId} is not eligible before ${task.notBefore}`)

  const result = {
    schema: 'research-runtime-worker-admission/v1',
    decision: reasons.length === 0 ? 'Admitted' : 'Denied',
    task: taskId || null,
    runDate: clock.date,
    localTime: clock.time,
    branch: branch || null,
    wakeSource: wakeSource || null,
    reasons,
    runtimeAuthorityRequired: control.runtimeAuthorityRequired,
    prompt: task?.prompt || null,
    limits: task ? {
      maxRunMinutes: task.maxRunMinutes,
      maxRecoveryAttempts: task.maxRecoveryAttempts,
      maxRevisionRounds: task.maxRevisionRounds,
      maxCandidates: task.maxCandidates,
      zeroOutputAllowed: task.zeroOutputAllowed,
      directPublicationAllowed: task.directPublicationAllowed
    } : null
  }
  console.log(JSON.stringify(result, null, 2))
  if (reasons.length > 0) process.exitCode = 2
}

const command = process.argv[2] || 'validate'
if (command === 'build') build()
else if (command === 'validate') validate()
else if (command === 'resolve') resolveAdmission()
else fail(`unknown command ${command}`)
