---
title: 当前上下文研究：复现与证据
---

# 当前上下文研究：复现与证据

2026-09-11 · 六组变化、九个 PR、三条本地实验。

| 实验 | 本地结果 | 边界 |
| --- | --- | --- |
| Agents SDK | 原回归 10 通过；旧函数消融 10 失败 | 真实 Runner 与脚本模型输入，不是网络交付确认 |
| Orca | 8 条件 × 两版本，共 16 观测 | 原函数与连接替身，没有真实 Claude 推理 |
| Superset | 原 Ed25519 函数 9 项检查 | 没有真实云沙箱或手机验证 |

[完整复现包](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-11-current-authority/) · [来源审计](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-11-current-authority/01-source-audit.md) · [实验说明](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-11-current-authority/02-experiments.md) · [开发评审](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-11-current-authority/03-development-review.md) · [中英交流稿](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-11-current-authority/06-discussion-drafts.md)

开发评审为 READY_FOR_REVIEW，未确认产品缺陷，未授权实现。交流稿对应 GitHub 作者，尚未发送。

文章：[结果交付](../../engineering/2026-09-11-result-delivery) · [模型恢复](../../engineering/2026-09-11-live-model-restore)。

[English](/en/research/evidence/2026-09-11-current-authority)
