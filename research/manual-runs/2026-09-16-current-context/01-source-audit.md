# 来源核查与分类 · 2026-09-16

收集 7 组信号，核对 17 个一手 PR/提交。来源快照和完整 SHA 见 [sources.json](./sources.json)。PR 状态是采集时观察，并非永久状态。研究者自行试验的结果与上游作者自报测试分开记录。

| # | 一手来源 | 提交作者 | 采集时状态 | 固定候选 |
|---|---|---|---|---|
| 1 | [yzhao062/anywhere-agents 91c64c1](https://github.com/yzhao062/anywhere-agents/commit/91c64c153f2034bf4aa88121cbe546cbf6a22aeb) | yzhao062 | commit | `91c64c153f2034bf4aa88121cbe546cbf6a22aeb` |
| 2 | [yzhao062/anywhere-agents a566f92](https://github.com/yzhao062/anywhere-agents/commit/a566f9219de9bba959d87715f7fd4a13415f6ee4) | yzhao062 | commit | `a566f9219de9bba959d87715f7fd4a13415f6ee4` |
| 3 | [openai/codex 45813](https://github.com/openai/codex/pull/45813) | copyberry[bot] | MERGED 2026-09-16T00:22:02Z | `7f501cd334af76dea303980a500c3df2003b1dd7` |
| 4 | [openai/codex 45807](https://github.com/openai/codex/pull/45807) | copyberry[bot] | MERGED 2026-09-15T23:31:57Z | `4d2807023aae3ee317d39a9868fb187618699df2` |
| 5 | [openai/codex 45806](https://github.com/openai/codex/pull/45806) | copyberry[bot] | MERGED 2026-09-15T23:01:00Z | `7f83d4922d7e92a36c1c1e4f61159a5815d45360` |
| 6 | [openai/codex 45782](https://github.com/openai/codex/pull/45782) | copyberry[bot] | MERGED 2026-09-15T20:08:49Z | `0c3a14bbc20e1b55286d3fb89a3235c1e11d9cc1` |
| 7 | [openai/codex 45789](https://github.com/openai/codex/pull/45789) | copyberry[bot] | MERGED 2026-09-15T20:41:54Z | `c51cb968e43fd52255aacf568220aed4654c3f97` |
| 8 | [openai/openai-agents-js 1938](https://github.com/openai/openai-agents-js/pull/1938) | jbeckwith-oai | MERGED 2026-09-15T22:47:47Z | `457dfff8ce30d19ccbd4a3796ec482356dc19dfa` |
| 9 | [openai/openai-agents-js 1931](https://github.com/openai/openai-agents-js/pull/1931) | jbeckwith-oai | MERGED 2026-09-15T20:10:10Z | `74ea48557a3120f19464e7fc9ab767b4af560a05` |
| 10 | [openai/openai-agents-js 1932](https://github.com/openai/openai-agents-js/pull/1932) | jbeckwith-oai | MERGED 2026-09-15T05:49:57Z | `fc5c2041c4909bad4c24cecd4cae41b103f56a45` |
| 11 | [openai/openai-agents-js 1933](https://github.com/openai/openai-agents-js/pull/1933) | jbeckwith-oai | MERGED 2026-09-15T20:09:01Z | `b19ce4db88254463aa4ed86d094585857f9616bc` |
| 12 | [openai/openai-agents-js 1937](https://github.com/openai/openai-agents-js/pull/1937) | jbeckwith-oai | MERGED 2026-09-15T20:28:09Z | `8efae35827fad1b43a3ce31764dc33dfb2d0cbf1` |
| 13 | [paperclipai/paperclip 13493](https://github.com/paperclipai/paperclip/pull/13493) | cryppadotta | MERGED 2026-09-15T20:46:58Z | `b66ac276dd3d5fc738a22ecea783400106a494d4` |
| 14 | [paperclipai/paperclip 13498](https://github.com/paperclipai/paperclip/pull/13498) | electrumnz | open | `bfe7f568976a2c671184722a6e6294927d6e6fae` |
| 15 | [paperclipai/paperclip 13494](https://github.com/paperclipai/paperclip/pull/13494) | electrumnz | open | `5dfab391bf19b59e82f03ef42bb17105a6eedc05` |
| 16 | [superset-sh/superset 7564](https://github.com/superset-sh/superset/pull/7564) | saddlepaddle | MERGED 2026-09-15T07:14:41Z | `73379a1c101cf6328849f332ebabe38025667e90` |
| 17 | [stablyai/orca 20914](https://github.com/stablyai/orca/pull/20914) | Jinwoo-H | MERGED 2026-09-16T01:31:05Z | `89711d6f55670781d23fc1a2d4e2aecf4d725758` |

## 逐组处置

| 信号组 | 价值与处置 | 实际验证范围 | 产出 |
|---|---|---|---|
| Anywhere Agents（1–2） | 额度路由值得验证，审查恢复需确认文本资格 | 额度 8 场景 × 两版本；审查结构 8 输入 | 报告；不独立成文，未跑恢复派发全链 |
| Codex（3–7） | 当前 Host、sandbox、turn 与 Guardian 的身份边界重要 | 阅读补丁与上游测试描述；未运行 Rust/TUI/Guardian | 持续观察；不计实验和开发评审 |
| Agents JS（8–12） | 优先验证 #1938 的异常检查是否污染下一轮；其余保留资料 | 公共 run 入口 32 条对照，另实跑上游对应文件 71 测试 | 双语文章一 |
| Paperclip 制品/凭证（13–14） | 二进制保真与会话环境应分别验证 | 7 编解码场景、5 真实临时文件场景 | 双语文章三；制品结果归报告 |
| Paperclip 解除阻塞（15） | 阻塞需有具体解阻责任，不能只换状态名 | 三处原函数前缀 10 次写入观察、2 次通知对照 | 报告；未验看板完整流转 |
| Superset（16） | 默认云选择受缓存与显式选择影响 | 完整选择函数/参数函数，8 缓存与离线场景，外部依赖替身 | 报告；未验真实云创建、唤醒或费用 |
| Orca（17） | 相同范围名称不等于同次访问 | 原完整模块与代际比较消融，8 场景 × 2 | 双语文章二 |

## 通知中需要修正的理解

- 额度提交 91c64c1 的父提交是 a566f92：额度路由在审查恢复之后。
- Orca #20914 采集时已经合入；不是继续按 OPEN 描述。实际作者为 Jinwoo-H。
- Codex 未明确归属的执行 Host 应保持 Unknown；不能从没有远端信息推定为本地。
- Superset 离线不是无条件选本地：仍在有效期内的正向能力缓存可直接选择云路径。
- 审查文本结构命中不等于审查实际完成，更不是独立验证成功。
