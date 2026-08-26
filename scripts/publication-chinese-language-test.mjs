#!/usr/bin/env node

import { validateChineseTechnicalProse } from './publication-chinese-language-validate.mjs'

const good = `---
title: "前台完成，不等于工作流完成"
summary: "Google ADK（Google 的智能体开发工具包）把仍在运行的后台任务纳入父流程的最终完成判断。"
research_question: "父流程什么时候才能宣布真正完成？"
---

# 前台完成，不等于工作流完成

Google ADK（Google 的智能体开发工具包）会继续跟踪仍在运行的后台任务。Runtime（运行时系统）不能因为前台函数已经返回，就直接宣布整个流程成功。

在需要引用具体接口时，\`wait_for_completion\`（等待完成接口）可以保留英文标识；随后正文继续使用中文说明它的职责。ADK 后续出现时可以继续使用已经定义过的缩写。
`

const bad = `---
title: "前台完成，不等于工作流完成"
summary: "Agent Workflow 的可见路径可能已经走到终点，但 Detached Work 仍然运行。"
research_question: "什么时候完成？"
---

Agent Workflow 的可见路径可能已经走到终点，但它启动的工作仍在运行。如果 Runtime 此时宣布成功，系统就把 Foreground Completion 错当成了全部工作的 Terminal Truth。

Static Graph Work 结束后，Workflow 查找 In-flight Dynamic Task，并检查 Raised Exception、Child Context Error、Detached Outcome 和 Clean Finish。
`

const asciiParen = `---
title: "测试"
summary: "MCP (模型上下文协议) 是协议。"
---

MCP (模型上下文协议) 用于连接上下文。
`

const goodErrors = validateChineseTechnicalProse(good, 'good')
if (goodErrors.length) throw new Error(`good fixture unexpectedly failed:\n${goodErrors.join('\n')}`)

const badErrors = validateChineseTechnicalProse(bad, 'bad')
if (!badErrors.some((item) => item.includes('Agent Workflow'))) throw new Error('bad fixture did not reject unexplained Agent Workflow')
if (!badErrors.some((item) => item.includes('Runtime'))) throw new Error('bad fixture did not reject unexplained Runtime')
if (!badErrors.some((item) => item.includes('English-heavy'))) throw new Error('bad fixture did not reject English-heavy Chinese prose')

const asciiErrors = validateChineseTechnicalProse(asciiParen, 'ascii')
if (!asciiErrors.some((item) => item.includes('full-width Chinese explanation'))) throw new Error('ASCII parentheses must not satisfy the Chinese explanation rule')

console.log('Chinese technical prose gate tests passed: Chinese-first, first-use explanation, full-width parentheses and density rejection.')
