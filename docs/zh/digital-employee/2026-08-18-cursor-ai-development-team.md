---
title: "在 Cursor 里带一支 AI 开发团队：从需求拆解到测试验收"
date: '2026-08-18'
column: digital-employee
category: daily
article_type: project-research
edition: research-center
research_question: "怎样把多个 Cursor Agent 从并行对话组织成一条职责分离、证据可追踪并由人最终批准的交付链？"
summary: "文章以真实的 daily-sign 手机端随手记项目为例：人先给 PM 下任务，再由 PM 澄清、拆解并组织 DEV、OPS、QA、EVAL 和人工批准，形成可验收交付。"
item_id: "MANUAL-20260818-CURSOR"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-18-cursor-ai-development-team-cover.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
sources:
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-source-register.md
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-fact-matrices.md
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-article-briefs.md
  - research/manual-runs/2026-08-18-guided-article-pipeline-round1/02-independent-editorial-review.md
---

<ArticleCover
  image="/assets/covers/daily-2026-08-18-cursor-ai-development-team-cover.webp"
  kicker="数字员工 · 项目研究"
  title="在 Cursor 里带一支 AI 开发团队：从需求拆解到测试验收"
  summary="文章以真实的 daily-sign 手机端随手记项目为例：人先给 PM 下任务，再由 PM 澄清、拆解并组织 DEV、OPS、QA、EVAL 和人工批准，形成可验收交付。"
  version="MANUAL-20260818-CURSOR"
  status="Independent Editorial PASS · 2026-08-18"
  languageHref="/en/digital-employee/2026-08-18-cursor-ai-development-team"
  languageLabel="English"
/>

# 在 Cursor 里带一支 AI 开发团队：从需求拆解到测试验收

> 同时打开四个 Agent 窗口，只得到四段并行对话。真正的 AI 开发团队需要四样东西：角色契约、共享工件、独立验收和人类批准。

**阅读依赖：**本文是系列实操篇。想先理解文件工作账本的治理价值，请读[概念篇](/zh/engineering/2026-08-18-files-first-multi-agent-governance)；想检查路径状态、transition 与原子提交，请读[协议实现篇](/zh/engineering/2026-08-18-fcop-file-state-machine)。

你想做一个每天在手机上用的随手记小工具，于是把这句话分别发给四个 Cursor Agent：一个负责实现，一个补测试，一个看部署，一个做代码审查。半小时后，四个窗口都很忙。再过半小时，它们陆续说“完成”。

这时最容易出现的不是技术难题，而是协作难题：开发者修改了接口，测试仍按旧接口编写；运维检查了不存在的启动方式；审查者只读到实现者的总结，没有看到真实 diff 和失败用例。四个 Agent 的并行，反而放大了需求漂移。

本文不讨论怎样让 Agent 更像人，也不把某个框架包装成“自治团队”。Research Center 此前已经论证过[执行者不能自行验收完成声明](/zh/digital-employee/2026-08-05-verifiable-completion)，并用 CodeFlowMu 案例说明过[角色、事实源与裁决权共同构成团队](/zh/engineering/2026-08-06-codeflowmu-multi-agent-fact-checking)。这篇不重复提出一套新理论，而是用 `D:\codeflowmu\workspace\daily-sign` 中真实存在的手机端“今日随手记”项目说明：人怎样给 PM 下任务，PM 怎样组织 DEV、OPS 和 QA，最后再把证据交还给人批准。

## 先判断：这项工作真的需要一支团队吗

小修复、单文件改动和明确问答，通常交给一个 Agent 更快。只有当任务同时具备下列两项以上特征，多角色才开始有价值：

- 需要拆分实现、测试、运行或部署责任；
- 结果必须由另一个角色独立检查；
- 任务会跨多个会话或持续较长时间；
- 失败需要形成正式返工，而不是在原对话里继续追问；
- 人需要在关键节点批准，而非让 Agent 自动合并。

[Anthropic 的工程总结](https://www.anthropic.com/engineering/building-effective-agents) 也区分了单 Agent、编排者—执行者和评估者—优化者等模式：复杂度应随任务增加，而不是把多 Agent 当默认答案。

团队的第一个指标不是 Agent 数量，而是**一项工作是否有唯一负责人、明确交付物和独立结束条件**。

## 四个角色，不是四个模型人设

[CodeFlowMu-open](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/README.md) 在公开版中使用 PM、DEV、OPS、QA 四类角色，并提供独立 EVAL、FCoP 工件、PC/PWA 观察面与人工批准链。这里的角色不是为了让提示词更有戏剧性，而是为了分配决定权。

> **多 Agent 协作里的角色不是为了让 Prompt 更有戏剧性的人设，而是为了分配不可越权的决定权与裁决权。**

| 角色 | 主要责任 | 不应代替谁 |
| --- | --- | --- |
| PM | 澄清需求、拆任务、写验收条件、处理依赖和返工 | 不替 DEV 宣称代码正确，不替 QA 放行 |
| DEV | 实现、局部验证、提交变更与 REPORT | 不自行降低验收条件，不给自己最终批准 |
| OPS | 验证安装、启动、配置、日志和运行边界 | 不把“能启动”写成“功能正确” |
| QA | 从验收条件出发测试、检查回归、提交独立 QA REPORT | 不只复述 DEV 的测试结果，不充当 EVAL |
| EVAL | 在 PM 最终 REPORT 后旁路观察质量与风险 | 不修改任务生命周期，不代替 PM/ADMIN 批准 |

![CodeFlowMu 手机端仪表盘显示 PM、DEV、QA、OPS 四个团队角色及 ADMIN 到 PM 的任务](/assets/covers/daily-2026-08-18-codeflowmu-team-dashboard.png)

*图 1：CodeFlowMu 手机端团队仪表盘。画面同时显示 PM、DEV、QA、OPS 四个角色，以及 `ADMIN → PM` 的项目任务。该图用于说明团队控制界面，不冒充 `daily-sign` 本次任务的专属运行记录。来源：`D:\codeflowmu\docs\images\pwa\V1.0.58\pwa-dashboard-V1.0.58.png`。*

在小项目中，同一个人可以监督所有角色，甚至让同一个模型在不同会话承担不同角色。但工件和权限仍应分开：执行回执不是审查结论，局部测试不是最终批准。

## 第一步：把开发项目交给 PM

人的第一步不是替 PM 写需求卡，也不是分别给 DEV、OPS 和 QA 解释需求，而是直接给 PM 下达项目任务。`daily-sign` 的原始任务可以只有一句话：

> 做一个每天在手机上用的随手记小工具。由 PM 组织团队完成，做好以后把结果交给我验收。

如果使用文件协议记录入口，这就是一张 `ADMIN → PM` 的项目 TASK。人负责说明想要的结果、已知约束、优先级和必须由人决定的事项；PM 负责把它变成团队可以执行和验收的工作。人不需要预先替 PM 完成需求分析和任务拆解。

![CodeFlowMu 手机端发布任务页面，提示任务将落盘为 ADMIN 到 PM 的 TASK 文件](/assets/covers/daily-2026-08-18-codeflowmu-publish-task.png)

*图 2：CodeFlowMu 手机端的“发布任务”入口。界面明确写着任务会落盘为 `TASK-*-ADMIN-to-PM.md`，再由 PM 拆给团队。这正是本文补回的第一步。来源：`D:\codeflowmu\docs\images\pwa\V1.0.58\pwa-publish-task-V1.0.58.png`。*

## 第二步：PM 把项目任务整理成可验收的需求卡

[Cursor Plan Mode](https://cursor.com/docs/agent/plan-mode) 会先研究代码库、提出澄清问题，再生成可由人编辑和确认的实施计划。但计划还不是团队契约。PM 接到项目任务后，应先检查现有代码和运行环境；遇到产品取舍、范围冲突或缺失的业务决定，应向人提问，不能自行编造答案。确认之后，PM 至少要形成以下需求卡：

```markdown
# 项目：手机端“今日随手记”小工具

## 用户结果
用户每天在手机上打开应用，可以记录当天的文字和图片；稍后重新打开时内容仍然存在，并能从历史中找到。

## 范围
- 编辑并保存当天的随手记
- 支持 Markdown 文本和图片附件
- 使用浏览器 IndexedDB 保存内容
- 历史页面显示以前的记录摘要
- 首次加载后可以离线使用
- 适配手机端页面

## 不在范围
- 不做登录和用户系统
- 不做多人协作
- 不做云端同步
- 不做社交分享

## 验收条件
1. 用户可以在手机端输入并保存当天的文字；
2. 用户可以添加图片，文字和图片在刷新后仍然存在；
3. 历史页面可以找到当天记录并显示摘要；
4. Markdown 正常显示，危险 HTML 不得执行；
5. 375px 宽度下没有横向滚动，主要按钮可以触控；
6. 首次在线加载后，断网刷新仍能进入应用；
7. README 中的本地启动方式可以在全新环境复现。

## 必须提交的证据
- 变更文件清单
- 自动化测试命令和结果
- 375px 手机端截图
- 保存、刷新、历史回看和离线检查记录
- 已知限制
```

上面这些细节来自真实 `daily-sign` 项目的代码、README 和测试，但它们不应该被倒推成“人必须这样给任务”。人只说“做一个手机端随手记小工具”就够了；范围、非范围、验收条件和证据要求是 PM 接单后的工作。如果 Agent 无法根据需求卡知道何时停止，PM 就还没有完成派工准备。

![daily-sign 今日一记在 375 像素手机视口下的真实 PWA 页面](/assets/covers/daily-2026-08-18-daily-sign-pwa-375.png)

*图 3：`daily-sign`（页面显示为“今日一记”）在 375px 手机视口下的真实验收截图。图中能看到四个底部入口、主题设置、本地数据说明和离线提示；它是项目结果证据，不是生成的产品示意图。来源：`D:\codeflowmu\workspace\daily-sign\scripts\verify-ui-375.png`。*

## 第三步：PM 用 TASK 固定责任和交付物

PM 不把整张需求卡复制给所有 Agent，而是创建有父子关系的 TASK：

```text
TASK-001  PM → DEV  实现随手记、图片、本地保存与自动化测试
TASK-002  PM → OPS  验证启动、Service Worker、离线访问与部署边界
TASK-003  PM → QA   按七条验收条件在手机视口独立验证
```

每张 TASK 都应引用同一需求 ID，但拥有自己的 scope、依赖和 acceptance。DEV 的任务可以依赖需求卡；QA 的任务还应依赖 DEV 的 REPORT 和可测试构建。这样，三者共享目标，却不会争抢同一责任。

FCoP 的文件名和 front matter 可以保存 sender、recipient、parent、priority 和时间；路径则显示任务位于 `inbox`、`active` 还是 `review`。人不需要打开四个对话，先看工作区就能知道哪项任务尚未被领取。

![手机端随手记项目经 PM 拆分后由 DEV、OPS 和 QA 形成证据包，再由 PM 决策并交给人类批准](/assets/covers/daily-2026-08-18-cursor-accepted-delivery.png)

*图 4：执行者的 `done` 只是完成声明；独立测试、PM 接收或返工、EVAL 旁路观察和人工批准必须保持不同责任。来源：Research Center 根据 CodeFlowMu-open 角色契约与本文工作流整理。*

## 第四步：Agent 在 Cursor 中执行，但不要把聊天当证据

[Cursor Agent tools](https://cursor.com/docs/agent/overview#tools) 提供文件搜索、编辑、终端等能力。执行者应当使用这些工具产生环境证据，而不是只在回复中描述动作。

DEV 的最小执行顺序是：

1. 复述 TASK 的范围与不在范围，发现歧义先写 ISSUE；
2. 检查相关代码和既有测试，不立即跨模块重构；
3. 实现最小变更；
4. 运行目标测试，再运行相关回归；
5. 查看 diff，移除范围外改动；
6. 写 REPORT，列出变更、命令、结果、证据路径和剩余风险；
7. 将任务提交到 review，而不是自己归档。

REPORT 可以很短，但不能只有结论：

```markdown
# REPORT：TASK-001

- 变更：随手记支持 Markdown、图片附件和 IndexedDB 保存，历史页显示摘要
- 测试：7 个测试文件，共 47 passed、0 failed
- 手机端证据：`scripts/verify-ui-375.png`
- 启动：按 README 通过 HTTP 服务访问，Service Worker 可以注册
- 警告：Node 报告缺少 `type: module`，不影响本轮测试通过，但应如实记录
- 未验证：不同手机浏览器之间的数据迁移
```

Cursor 的 checkpoint 有助于撤销 Agent 改动，但[官方文档明确说明 checkpoint 与 Git 分离，只适合撤销 Agent 变更](https://cursor.com/docs/agent/overview#checkpoints)。正式证据仍应落在 Git diff、测试输出和项目工件中。

## 第五步：让 OPS 和 QA 验证不同的事实

OPS 不重复 DEV 的单元测试。对这个静态 PWA，它验证的是另一组事实：README 的 HTTP 启动方式能否复现、Service Worker 能否注册、首次加载后能否离线进入、子路径资源是否正确、版本与缓存是否对齐，以及部署和回滚是否有明确边界。

QA 则从需求卡重新出发，不先接受 REPORT 的结论。它至少执行：

- happy path：写下文字、添加图片、保存并从历史重新打开；
- edge cases：空内容、长文本、图片删除和 Markdown 特殊字符；
- persistence：刷新和重新打开页面后文字与图片仍然存在；
- mobile：375px 视口无横向滚动，按钮可以触控和键盘聚焦；
- offline：首次加载后切断网络，刷新仍能进入应用；
- security：`<script>`、危险协议和事件属性不会执行；
- scope check：diff 是否夹带登录、云同步或无关重构。

[Cursor 的 reviewing and testing 指南](https://cursor.com/learn/reviewing-testing) 建议在 diff view 中持续观察 Agent 变更，并强调看似正确、甚至通过现有测试的 AI 代码仍可能遗漏边界或安全问题。这提供了审查界面，但不替代审查标准。QA 应提交逐条验收结果和证据，形成 QA REPORT。PM 或治理角色再据此决定接收、返工或升级；若写入 FCoP REVIEW，磁盘枚举应使用 `approved`、`rejected`、`needs_changes`、`abstained` 或 `needs_human`，而不是编辑流程里的 PASS/NEEDS REVISION/REJECT。

EVAL 是另一条旁路。[CodeFlowMu-open 当前发行与初始化边界](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/docs/open/release-and-initialization.md)规定：PM 向 ADMIN 提交最终 `status=done` REPORT 后，系统生成独立 EVAL 观察；EVAL 不修改 lifecycle，也不代替 PM/ADMIN 的接受决定。

## 第六步：把驳回变成更清楚的下一张任务

继续 `daily-sign` 的随手记项目：如果 QA 发现断网刷新后页面无法进入，不要回到 DEV 对话里说“再改一下”。把它作为一次可追踪返工：

1. QA REPORT 明确哪条验收条件失败并保存复现证据；
2. PM 用 REVIEW 或接收记录决定 `needs_changes`，必要时另写 ISSUE；
3. PM 判断是实现错误还是任务规格缺失；
4. 创建带 parent 的返工 TASK；
5. 新 TASK 收窄范围、补充失败样例和结束条件；
6. 修复后重新经过独立验证。

这样，下一次复盘能区分“模型能力不足”和“负责人没有把决策写进任务”。

## 第七步：人只在有证据时批准

最终批准者不需要重做所有工作，但必须看到一份紧凑的验收包：

- 原始需求和当前范围；
- 三张 TASK 的状态；
- DEV/OPS REPORT；
- QA REPORT；
- PM 的接收/返工判断；
- PM 最终 REPORT 后生成的独立 EVAL 观察（若已生成）；
- 实际 diff；
- 测试命令与结果；
- 未验证事项和回滚方式。

一个简单批准问题足以过滤大量“看起来完成”：**如果现在合并，我依据的环境事实是什么；如果失败，我从哪里恢复？**

> **执行者自己宣告的“已完成”不叫完成；带独立环境证据与审查裁决的通过，才叫交付。**

CodeFlowMu-open 的 PC/PWA 面板可以作为观察入口，但面板不是事实来源。事实应继续存在于磁盘工件、Git 和测试环境里；界面只是索引它们。公开版与私有生产版的能力边界也应以 [edition boundary](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/docs/open/edition-boundary.md) 为准，不能把路线图写成已实现功能。

## 一次可照做的最小运行

如果你今天就想试一次，不必先部署完整平台：

| 时间点 | 动作 | 产物 |
| --- | --- | --- |
| 09:00 | 人说：“做一个每天在手机上用的随手记小工具” | `ADMIN → PM` 项目 TASK |
| 09:10 | PM 检查 `daily-sign`、澄清范围并写验收条件 | 需求卡 |
| 09:20 | PM 分别派给 DEV、OPS、QA | 3 张子 TASK |
| 09:30 | DEV 实现文字、图片、本地保存和历史回看 | diff + DEV REPORT |
| 11:00 | OPS 验证 HTTP 启动、Service Worker、离线和部署边界 | OPS REPORT |
| 11:30 | QA 在手机视口独立检查保存、刷新、历史和安全 | QA REPORT |
| 12:00 | PM 根据证据决定返工或提交最终结果 | 返工 TASK 或 PM REPORT |
| 12:10 | EVAL 旁路观察 PM 最终结果 | EVAL observation |
| 12:20 | 人查看手机端结果、证据和风险 | 批准或拒绝 |

第一次运行只观察四个指标：

1. 有多少问题来自需求不清，而不是代码不会写；
2. REPORT 中有多少结论能直接定位到环境证据；
3. QA 是否发现了 DEV 自测没有覆盖的问题；
4. 驳回是否变成了更清楚、可追踪的下一步。

这些结果比“同时运行了多少 Agent”更接近团队效率。

## 边界：不要把流程本身变成新负担

多角色协作也会失败。任务太小时，工件成本超过收益；角色使用同一上下文时，所谓独立审查可能只是自我确认；验收条件写得过细时，Agent 会优化清单而忽略用户结果；所有步骤都自动通过时，人类批准会退化为按钮仪式。

所以治理强度应与风险匹配：小修复用单 Agent + diff review；跨模块功能增加 PM 和 QA；涉及部署、安全或数据变更时再加入 OPS、独立 EVAL 和明确人工门禁。

## 结论：从“多个窗口”升级为“可验收交付”

在 Cursor 里带一支 AI 开发团队，关键不是让四个 Agent 同时说话，而是把 Research Center 已有的治理结论落实到操作层。`daily-sign` 案例把入口说得很清楚：人的第一步是说“做一个每天在手机上用的随手记小工具”并把项目交给 PM，而不是先替 PM 写好需求卡。PM 对任务清晰度负责，DEV 对实现和自测负责，OPS 对运行链负责，QA 对独立测试负责，EVAL 对旁路质量与风险观察负责，人对最终风险负责。

Cursor 提供计划、工具、diff review 和 checkpoint；CodeFlowMu-open 与 FCoP 提供一种角色和工件组织方式。把两层组合起来，得到的不是无人监督的自治公司，而是一条更朴素也更实用的能力：**一句需求能够被拆成可追踪任务，执行结果能够被独立验证，失败能够变成下一张更清楚的任务。**

这才是一人团队最先应该追求的效果。

如果你从本篇开始阅读，可以回到[治理价值篇](/zh/engineering/2026-08-18-files-first-multi-agent-governance)理解为什么需要共同工作账本，再用[状态机实现篇](/zh/engineering/2026-08-18-fcop-file-state-machine)核对路径状态、原子提交和测试不变量。三篇合起来才是一条完整链路：为什么这样治理、协议怎样保证、团队如何交付。

## 参考资料

- [Cursor Plan Mode](https://cursor.com/docs/agent/plan-mode)
- [Cursor Agent tools](https://cursor.com/docs/agent/overview#tools)
- [Cursor reviewing and testing](https://cursor.com/learn/reviewing-testing)
- [Cursor Checkpoints](https://cursor.com/docs/agent/overview#checkpoints)
- [Anthropic, Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [CodeFlowMu-open README](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/README.md)
- [CodeFlowMu-open edition boundary](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/docs/open/edition-boundary.md)
- [CodeFlowMu-open release and initialization boundary](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/docs/open/release-and-initialization.md)
- [FCoP v3 specification](https://github.com/joinwell52-AI/FCoP/blob/a859e6747fe6e5e2d686e0114c77774726d7f748/spec/fcop-v3-spec.md)
