# 2026-08-17 高质量文章候选包：最终质量与 QA

完成日期：2026-08-18  
当前状态：**用户已批准；两篇候选已完成并公开发布**  
发布状态：**Research Center 已发布并完成部署分支验收**

## 最终入选

### 1. Token 不是账单（偏生活化）

- 中文：`staging/publication-candidates/2026-08-17-token-is-not-a-bill.zh.md`
- 英文：`staging/publication-candidates/2026-08-17-token-is-not-a-bill.en.md`
- 题图：`staging/publication-candidates/2026-08-17-token-is-not-a-bill-cover.png`
- 内容独立复核：Round 1 NEEDS REVISION（80/90）→ 返工 → fresh-context Round 2 PASS（87/90）
- 主要返工：修正 Router cost/usage 误引；拆开 estimated、billed、invoiced、adjusted；更新 Admin API；区分 `totalCents` 与 `chargedCents`；明确 `discountAmount` 是金额；重构英文稿避免机械镜像。

| 维度 | 分数 |
| --- | ---: |
| 选题 | 19/20 |
| 证据 | 24/25 |
| 原创洞察 | 19/20 |
| 结构与可读性 | 15/15 |
| 可行动性 | 10/10 |
| 视觉 | 9/10 |
| **总分** | **96/100** |

### 2. 别让 Agent 立刻写代码——也别盲信它的计划（偏技术流）

- 中文：`staging/publication-candidates/2026-08-17-reviewable-agent-plan.zh.md`
- 英文：`staging/publication-candidates/2026-08-17-reviewable-agent-plan.en.md`
- 题图：`staging/publication-candidates/2026-08-17-reviewable-agent-plan-cover.png`
- 内容独立复核：fresh-context Round 1 PASS（85/90）
- 主要边界：53.50% 是 DT+Pro 单一配置；49.48% / 45.72% / 27.71% 是工作流均值；55.8% 的分母是特定 1000 条未实现需求；authority inversion 是作者根据轨迹提出的解释，不是独立因果实验。

| 维度 | 分数 |
| --- | ---: |
| 选题 | 19/20 |
| 证据 | 23/25 |
| 原创洞察 | 19/20 |
| 结构与可读性 | 14/15 |
| 可行动性 | 10/10 |
| 视觉 | 9/10 |
| **总分** | **94/100** |

## 未入选与 No Selection

- 第三个名额：**No Selection**。三篇是上限，不是配额。
- 模型发布/请求帖：时效短，容易退化为产品新闻，并与过去 30 天模型路由文章重叠。
- Agent diff / 活动记录回归：与 2026-08-17 已有执行证据文章的问题、结论和读者行动过近。
- 直接整理 RIPER-5 或类似 prompt 协议：主要依赖单一论坛经验帖，缺少第二个独立可靠来源与可复现实验。
- “计划 / 上下文 / 大仓库”没有硬拆成多篇，统一收敛为一篇可审查计划文章。
- 此前的旧候选没有因为产量目标进入本次最终包；本次只保留经过论坛需求重发现和新一轮门禁的两篇。

## 八阶段验收

1. **多源发现 — PASS**：source pool 覆盖 Cursor 官方产品/文档、GitHub 官方计费资料、FOCUS 开放规范、OpenAI 官方 API、论坛需求帖、E2EDevBench 与 79 页观察研究。
2. **选题硬门槛 — PASS**：2 个 Selected，1 个 No Selection；两题均完成 30 天问题/证据/结论/行动去重。
3. **深读与事实矩阵 — PASS**：两份论文完整读取方法、结果、局限与相关附录；事实—引用矩阵已持久化。
4. **Article Brief — PASS**：两题 Brief 均在写作前通过。
5. **写作 — PASS**：两篇中文与两篇英文完整稿；公开正文直接链接一手来源；英文成本稿已重构为独立自然结构。
6. **独立编辑复核 — PASS**：技术稿首轮 PASS；成本文首轮返工、第二轮由 fresh-context 编辑 PASS。
7. **解释性配图 — PASS**：每题独立 1600 × 900 PNG；完成语义、构图、文字、裁切、对比度、缩略图、文件和引用路径检查；均无需额外解释图。
8. **发布 — PASS**：用户明确批准“你发布吧”后，四份正式中英文文章和两张发布题图以快进提交进入 `main`。`gh-pages` 生成提交 `e16ed992b2aac12415589361e9ac198a52f6b5d2`，提交信息明确绑定源提交 `945c79fdb9f02f4f4c225164701b0ed88591b0e8`。

## 机械与站点 QA

- `node scripts/research-publication-layout-validate.mjs`：PASS；104 article files、24 inline figures、8 candidate batches。
- `npm run publication:editorial:validate`：PASS；V2 与 V2.1 editorial validation 均通过。
- `node scripts/vitepress-build-strict.mjs`：PASS；client/server bundle 与页面渲染完成；只有既有的大 chunk 警告，没有 SSR JavaScript 错误。
- 四份稿件 schema、日期、标题与 H1 一致；两组 frontmatter 与正文题图路径一致。
- 两张 staging 题图均为 1600 × 900 PNG：成本图 2,040,712 bytes；计划图 1,942,683 bytes。发布副本为重新目视检查通过的 1600 × 900 WebP：成本图 188,110 bytes；计划图 134,860 bytes。
- 外链检查：12 个唯一主链接 HTTP 200；SSRN landing page 对命令行自动访问返回 403，因此同时增加可直接访问的作者 79 页 PDF（HTTP 200）。
- 部署 HTML 验收：四个 `gh-pages` HTML 对象均存在，包含正确标题、语言、双语跳转、对应 WebP 题图和一手来源域名。成本稿每个语言版本包含 9 个唯一外部链接；计划稿每个语言版本包含 6 个唯一外部链接。
- 部署图片验收：`gh-pages` 中两张 WebP 的 Git blob SHA 与源提交完全一致（`5805ccf...`、`878f7bd...`）。

## 仍存风险

1. SSRN 对自动化访问有限制，但作者 PDF 与本地完整阅读版本一致；正文同时保留 SSRN 记录与作者 PDF。
2. E2EDevBench 是预印本、特定 Python 项目与 Gemini/SWE-Agent 工具链，不能泛化成所有 coding agent 的失败比例；正文已明确边界。
3. Higher-Order Work 是观察研究，经验、计划行为与接受率的关系不能解释为计划导致更高质量；正文已明确边界与作者访问 Anysphere 的披露。
4. Cursor 套餐、Router 与 Admin API 仍可能继续变化；当前事实均按 2026-08-18 访问状态核验。
5. 应用内浏览器对 `joinwell52-ai.github.io` 的导航被用户侧权限策略拒绝，因此未声称完成浏览器目视逐页验收；改以 `gh-pages` 部署提交、最终 HTML 对象和图片 blob 做部署级验收。公开 URL 已生成，但首次访问体验仍建议用户自行打开确认。

## 发布记录

- 源提交：`945c79fdb9f02f4f4c225164701b0ed88591b0e8`
- 部署提交：`e16ed992b2aac12415589361e9ac198a52f6b5d2`
- 中文成本稿：https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-17-token-is-not-a-bill
- English cost article：https://joinwell52-ai.github.io/joinwell52/en/industry/2026-08-17-token-is-not-a-bill
- 中文计划稿：https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-17-reviewable-agent-plan
- English planning article：https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-17-reviewable-agent-plan

当前准确状态：**两篇候选完成并已发布到 Research Center；未向 DEV、Cursor Forum、CSDN 或掘金提交。**

