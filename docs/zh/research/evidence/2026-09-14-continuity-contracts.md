---
title: 连续性研究：两天的实验与证据
---

# 连续性研究：两天的实验与证据

2026-09-13—14 · 十四组雷达，十五个工程议题，十三个 PR 与三个固定提交。

| 本地实验 | 结果 | 范围 |
| --- | --- | --- |
| 原 dispatcher 五场景 | 旧版三失败、两通过；修复五通过 | 真实子进程，CLI 替身 |
| SDK 五场景 | 旧 clear 四失败、一通过；候选五通过 | 真实 SQLite；远端 AsyncMock |
| Paperclip 七组输入 | 两组普通恢复改用当前完整说明 | 原选择器；规范化输入替身，未运行目标数据库 |
| 额度及辅助策略 | 十一通过，其中七项额度策略 | 本地单测，无真实额度或节省测量 |

[完整复现包](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-14-continuity-contracts) · [来源审计](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-14-continuity-contracts/01-source-audit.md) · [实验说明](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-14-continuity-contracts/02-experiments.md) · [待验证线索](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-14-continuity-contracts/03-development-review.md)

另列十一项待验证线索，尚未完成对应的产品问题验证；不将其计为开发评审或开发任务。

[开场白为什么成了交付结果？](../../engineering/2026-09-14-terminal-result) · [清空了记录，为什么还会引用旧会话？](../../engineering/2026-09-14-clear-continuation)

[English](/en/research/evidence/2026-09-14-continuity-contracts)
