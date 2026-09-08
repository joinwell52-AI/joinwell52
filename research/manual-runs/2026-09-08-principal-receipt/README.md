# 2026-09-08 · 共享身份与损坏回执文章发布登记

本次为用户明确要求的 GitHub 文章发布，不是产品实现或发版，也不接管另行运行的 Daily Runtime Production 工作。主站未提交内容和 CodeFlowMu 产品目录不在改动范围内。

## 内容与证据 / Content and evidence

| 文章 / Article | 中文 | English |
| --- | --- | --- |
| 同一个 Agent，换个人指挥，权限也会跟着换吗？ | [正文](../../../docs/zh/engineering/2026-09-08-shared-agent-instruction-identity.md) | [Full text](../../../docs/en/engineering/2026-09-08-shared-agent-instruction-identity.md) |
| 回执坏了，为什么任务没有再跑一遍？一次真实调度链的反例实验 | [正文](../../../docs/zh/engineering/2026-09-08-corrupt-receipt-dispatch-counterexample.md) | [Full text](../../../docs/en/engineering/2026-09-08-corrupt-receipt-dispatch-counterexample.md) |
| 证据说明 / Evidence guide | [中文](../../../docs/zh/research/evidence/2026-09-08-principal-receipt.md) | [English](../../../docs/en/research/evidence/2026-09-08-principal-receipt.md) |

配图包括两张原字节题图、两张原字节中文文中图、两张英文矢量解释图。证据含 60 条已保存观测、历史聚合、来源/主张映射、记录校验脚本及中英文说明。不公开原始运行数据；没有新增产品实验，记录检查不是独立 QA。

The publication preserves both complete arguments and their controls. The public package checks saved observations, not fresh product execution. Covers are editorial metaphors, and inline figures only explain the bounded recorded findings.

## 发布前审读 / Editorial review

- Research value / 研究价值：PASS。分别回答指令归属与操作身份分层、回执异常与真实启动分层，不重复同一命题。
- Independence / 独立性：PASS。CodeFlowMu 是有界案例证据；去掉产品名称后，两项分层判断仍成立。
- Evidence / 证据：PASS。A/J 与 R/I/S/O 对照明确；合并、Draft、作者报告、合成实验和独立 QA 不互相代证。
- Structure / 结构：PASS。中文原稿的全部量化表与反例保留；只适配站点元数据、插图来源和公开证据链接。
- Language / 语言：PASS。中文解释必要英文标识；英文正文保留同一集合、结论与局限。
- Bilingual consistency / 双语一致性：PASS。两套全文与证据说明；J1/J2、I0–I7、R0–R8 及历史粒度一致。

## 已执行检查 / Checks performed

- Public evidence checker: PASS, 60 saved observations and paired stable results. Not independent QA.
- Strict VitePress build and Runtime projection verification: PASS.
- Publication layout and editorial validators: PASS after adding explicit English figure source captions.
- Browser preview: four article routes, one visible H1 per page, two loaded images per page, no document horizontal overflow at inspected viewport. Chinese classifications display in Chinese. Selected raster originals are 1672 × 941.
- Full local Runtime validation initially stopped at `runtime-shift-terminal-test`: `prompt hash drift`. The checkout had `core.autocrlf=true`; CRLF-to-LF restoration of the nine generated prompts reproduced their already-registered SHA-256 values exactly. Full `npm run runtime:validate` then PASS. No test logic, control hash or product file was changed. Those checkout-only byte changes are excluded from the content commit.
- Existing dependency audit reports 6 advisories (3 moderate, 3 high); no dependency upgrade is included in this content-only publication.

## 发布回执 / Publication receipt

- Status / 状态：PUBLISHED AND LIVE VERIFIED。
- Content commit: `c40c2b8941abf592d8c4b3c022b5741a708ce604`。
- [Remote validation](https://github.com/joinwell52-AI/joinwell52/actions/runs/34193121303): SUCCESS。
- [Pages deployment](https://github.com/joinwell52-AI/joinwell52/actions/runs/34193121279): SUCCESS；gh-pages 部署记录指向上述内容提交。
- GitHub 固定提交逐文件回读：27/27 SHA-256 MATCH。
- 线上回读：4 个双语正文页、2 个证据说明页全部 HTTP 200；20 个公开资产逐字节摘要 MATCH；中英文研究目录都包含两篇文章。
- Temporary preview tab closed; local preview server stopped. No user tabs were closed.

线上正文 / Live articles:

- [同一个 Agent，换个人指挥，权限也会跟着换吗？](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-08-shared-agent-instruction-identity) · [English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-08-shared-agent-instruction-identity)
- [回执坏了，为什么任务没有再跑一遍？一次真实调度链的反例实验](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-08-corrupt-receipt-dispatch-counterexample) · [English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-08-corrupt-receipt-dispatch-counterexample)

本回执仅追加到发布登记，不改变已核验的正文、配图或证据包。GitHub 发布不授权论坛分发、产品开发或产品版本发布。

## 可读性修订计划 / Readability revision brief

用户在发布后明确授权可读性精修及线上更新。第一篇保留甲乙情境、四层身份表与历史/源码/探针对照，补上权限问题到指令来源的推理桥梁，并先解释字段保存现象。第二篇保留两轮反例结构及全部表格，先交代两次调用与一次模拟启动，再解释回调、SDK 和调度组件；表前增加阅读提示。两篇压缩重复结论，同步英文，不改变来源状态、实验观测、限定条件、配图或证据包。更新使用原网址，不另建文章。

修订已按上述范围完成。逐行比较四份正文的全部 Markdown 表格及固定源码提交，与修订前完全一致；公开证据包 60 条观测校验 PASS，布局/编辑验证和严格站点构建 PASS。本次只修改四份正文及本登记，证据和配图均未改动。

Readability revision: completed in both languages. All table rows and fixed source identities match the preceding edition exactly. Public evidence checking, layout/editorial validation and the strict site build passed. This is an editorial update, not a new experiment; the article URLs, figures and evidence bundle remain unchanged.
