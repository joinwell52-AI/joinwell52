# 2026-08-20 三篇双语文章发布记录

状态：`Published`

发布范围：仅 Research Center 的 GitHub 来源与 GitHub Pages；未向 DEV、Cursor Forum、CSDN、掘金或其他第三方平台提交。

## 用户授权

- 授权原文：`好的,文章发布到Github!`
- 授权日期：2026-08-21（Asia/Shanghai）
- 发布对象：三篇最终图文独立复核为 PASS 的中英文文章。

## 公开文章

### 文章一：技能与工具权限

- 中文：[AI Agent 的技能不是工具权限：为什么“会怎么做”和“允许做什么”必须分开？](https://joinwell52-ai.github.io/joinwell52/zh/industry/2026-08-20-skill-vs-tool-authority)
- English: [An AI Agent’s Skill Is Not Its Permission: Why “Knows How” Must Stay Separate from “May Do”](https://joinwell52-ai.github.io/joinwell52/en/industry/2026-08-20-skill-vs-tool-authority)

### 文章二：执行链安全换根

- 中文：[切换项目后，Agent 为什么还在改旧目录？一条执行链怎样安全换根](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-08-20-project-root-switch)
- English: [Why Is the Agent Still Editing the Old Project? Safely Rebinding an Execution Chain](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-08-20-project-root-switch)

### 文章三：报告归属与验收

- 中文：[AI 团队同时交回三份报告，怎样保证验收没有串账？](https://joinwell52-ai.github.io/joinwell52/zh/digital-employee/2026-08-20-report-attribution)
- English: [Three Agents Returned Three Reports. How Do You Keep Acceptance from Charging the Wrong Task?](https://joinwell52-ai.github.io/joinwell52/en/digital-employee/2026-08-20-report-attribution)

## 发布门禁

- 内容独立复核：三篇均 PASS，内容 86/90，证据 24/25。
- 最终图文复核：T1 94/100、T2 94/100、T3 95/100，全部 PASS。
- 本地门禁：guided pipeline、publication layout、publication editorial、strict VitePress build 全部 PASS。

## GitHub 发布

- 发布拉取请求：[PR #151](https://github.com/joinwell52-AI/joinwell52/pull/151)
- 合并提交：[`314c140eab4d64457042a5d28699cbf29e150468`](https://github.com/joinwell52-AI/joinwell52/commit/314c140eab4d64457042a5d28699cbf29e150468)
- PR 构建校验：[Validate Research Center 3.0 #32452904806](https://github.com/joinwell52-AI/joinwell52/actions/runs/32452904806) — PASS
- 公开站部署：[Deploy Research Center Pages #32453035829](https://github.com/joinwell52-AI/joinwell52/actions/runs/32453035829) — PASS
- 线上验收时间：2026-08-21 14:12（Asia/Shanghai）

## 线上验收

- 六个中英文文章页面：全部 HTTP 200。
- 六个页面标题：与最终稿一致。
- 三张题图和三张文中图：全部 HTTP 200，`Content-Type: image/png`。
- 六个页面图片引用：PASS。
- 三组中英文互链：PASS。

最终结论：三篇双语文章已公开发布并完成线上核验。

## 2026-08-22 跨领域可读性修订

### 修订定位

- 发布场景仍是专业 IT 网站；“科普化”不是删掉技术细节或改写成零基础入门，而是帮助安全、基础设施、Agent、前端等不同 IT 领域的读者先建立共同语境。
- 三篇文章均增加“可理解入口层”，再进入代码、错误语义、测试口径与机制边界。
- 中文稿中的专业英文术语在首次出现时补充括号中文解释；后文保留行业通用英文写法，避免牺牲检索性与专业精度。
- 一致类比只用于解释职责关系，不替代正式技术模型；测试数字、实现状态、建议项和未验证范围保持不变。
- 现有题图与文中图经独立复核仍与修订后的文章语义一致，因此本轮没有为“看起来更新”而重复换图。

### 规则与复核

- 全局标准：`research/editorial/COMMUNITY-TECHNICAL-WRITING-STANDARD.md` 升级至 V1.2。
- 本轮修订记录：`05-community-readability-rewrite.md`。
- fresh-context 独立复核：`05-community-readability-review.md`，三篇中英文全部 PASS。
- publication layout、publication editorial、guided pipeline、strict VitePress build 全部 PASS。

### GitHub 修订发布

- 修订拉取请求：[PR #153](https://github.com/joinwell52-AI/joinwell52/pull/153)
- 合并提交：[`702dbe2bb1d8885d9b10a3e42fdd351fd3f30148`](https://github.com/joinwell52-AI/joinwell52/commit/702dbe2bb1d8885d9b10a3e42fdd351fd3f30148)
- PR 构建校验：[Validate Research Center 3.0 #32555119638](https://github.com/joinwell52-AI/joinwell52/actions/runs/32555119638) — PASS
- 公开站部署：[Deploy Research Center Pages #32555165054](https://github.com/joinwell52-AI/joinwell52/actions/runs/32555165054) — PASS
- 线上验收时间：2026-08-22 13:48（Asia/Shanghai）

### 修订后线上验收

- 六个中英文文章页面：全部 HTTP 200。
- 六个页面均命中新增加的跨领域解释段落。
- 三张题图与双语页面图片引用：全部存在。
- 三组中英文互链：全部存在。

修订结论：三篇文章已在不降低技术精度的前提下完成跨 IT 领域可读性升级，并更新到公开站点。
