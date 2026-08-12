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
  for (const output of outputs) {
    const target = resolve(root, output.path)
    if (!existsSync(target)) fail(`${output.path}: missing; run npm run worker-prompts:build`)
    const actual = readText(output.path)
    if (actual !== output.content) fail(`${output.path}: drift detected; run npm run worker-prompts:build`)
  }
  console.log(`worker-prompts: validated ${config.tasks.length} generated prompt(s)`)
}

const command = process.argv[2] || 'validate'
if (command === 'build') build()
else if (command === 'validate') validate()
else fail(`unknown command ${command}`)
