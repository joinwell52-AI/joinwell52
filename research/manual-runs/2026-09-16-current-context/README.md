# 2026-09-16 研究：当前上下文需要自己的证据

**7 组信息 → 17 个一手来源 → 8 个有界实验议题 → 3 篇双语文章。** 三个文章结论分别涉及失败答案进入记忆、同名工作区的不同访问、恢复凭证与清理旧磁盘的分离。

- [来源、作者、版本与逐项分类](./01-source-audit.md)
- [实验方法、对照结果和未覆盖项](./02-experiments.md)
- [固定来源机器清单](./sources.json) · [原始结果](./results/) · [英文复跑指南](./README.en.md)
- [图文检查](./05-quality-review.md)

| # | 中文文章 | English |
|---|---|---|
| 1 | [检查已经报错，AI 为什么还记住了那句答案？](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-16-failed-check-memory) | [The check failed. Why did the AI remember the answer?](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-16-failed-check-memory) |
| 2 | [切走再切回来，旧结果为什么还能冒出来？](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-16-same-place-new-visit) | [Back in the same workspace, but which visit owns the result?](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-16-same-place-new-visit) |
| 3 | [会话恢复了，旧密钥也该留下吗？](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-16-session-without-old-keys) | [Resume the conversation. Keep the old credentials too?](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-16-session-without-old-keys) |

## 本轮做与不做

已形成文章和可核验实验材料。正式 CodeFlowMu 开发评审 **0 项**：上游观察不能替代本地问题/需求证据；本轮未达到转开发条件，决定不启动产品修改。具体本地对应性筛选保存在本地，不公开产品内部代码。

Codex 一组及 Agents JS 其他 4 个 PR 保留为源码观察，没有计作实验。未运行的真实移动 UI、云实例创建、ACPX 完整恢复、看板队列不标成通过。论坛分发未计为本轮完成项。研究交流稿、评论台账与回执仅在本地保存。

## 复跑

Node 24、Python 3、git、tar、pnpm。先看英文指南，下载公开固定源码并安装最小探针依赖。未使用模型服务或真实凭证。全部记录使用合成值；探针的临时目录不会接触生产状态。源码下载和 SDK 依赖安装需要网络。

实验脚本可复跑；本目录 results 是当次实际执行所得记录。不要将脚本模型的结果解释为模型能力测试。
