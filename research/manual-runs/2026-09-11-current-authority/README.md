# 2026-09-11：当前事实与历史状态

本轮完成六组变化、九个 PR 的重新审计，三条本地实验，以及两篇独立的中英文研究文章。人工研究发布，不代表自动 Runtime 班次完成。

| 研究线 | 本地证据 | 结论 |
| --- | --- | --- |
| Agents SDK 暂停恢复 | 原新增回归 10 通过；仅换旧函数 10 失败 | 最终 done 文本不能证明调用结果已交到下一次模型输入 |
| Orca 模型恢复 | 8 组条件 × 两版本，16 条观测 | 明确未列出时拒绝；目录未知保留兼容，不能冒称支持 |
| Superset 工作区凭证 | 原 Ed25519 签发/验签函数 9 项检查 | 验证工作区和时效；不能代证真实沙箱重启或执行世代授权 |

## 文章、证据与评审入口

- 结果已经有了，为什么 Agent 还会漏交？：[中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-11-result-delivery) · [English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-11-result-delivery)
- 昨天能用的模型，今天为什么不能直接恢复？：[中文](https://joinwell52-ai.github.io/joinwell52/zh/engineering/2026-09-11-live-model-restore) · [English](https://joinwell52-ai.github.io/joinwell52/en/engineering/2026-09-11-live-model-restore)
- [研究合同](00-research-brief.md) · [九个 PR 来源审计](01-source-audit.md) · [实验详细说明](02-experiments.md)
- [开发评审输入](03-development-review.md)：READY_FOR_REVIEW，六项合同；未完成产品侧评审，未授权实现。
- [文章论证地图](04-article-map.md) · [内容复核](05-quality-review.md) · [三组中英交流草稿](06-discussion-drafts.md)：GitHub 作者账号已核对，未发送。

## 复现

需要 Node 24.16.0 或兼容其 TypeScript stripping 的版本、Git、gh CLI、tar、uv、Python 3.12。先从当前固定的 sources/*.json 快照获取代码，**不要先运行 collect.mjs 改写来源版本**。

在本目录执行：

```text
node fetch-code.mjs
node probe-orca.mjs
node probe-superset.mjs
node setup-sdk.mjs
uv venv .venv --python 3.12
uv pip install --python .venv/Scripts/python.exe -e external/sdk-pinned pytest pytest-asyncio pytest-mock inline-snapshot rich
.venv/Scripts/python.exe probe-sdk.py
node verify.mjs
```

以上为 Windows 路径。其他平台将 Python 可执行路径改为 `.venv/bin/python`。setup-sdk.mjs 在专用实验目录取得固定快照，不切换用户的工作分支；Windows 解包跳过 CLAUDE.md 符号链接，AGENTS.md 和实际源码/测试保留。若需严格复制依赖版本，参照 runs/python-environment.json；不要把依赖更新造成的差异归因于受测修复。

probe-sdk.py 的旧函数子进程退出 1 是预期消融结果；父脚本只有同时观察到修复十项通过、消融十项失败才退出 0。它不修改上游源码文件。

verify.mjs 检查保存证据与文件哈希，不重新运行实验。源码下载由 code-manifest.json 校验；没有第三方完整源码或私有产品文件被打包到公开研究材料。

## English reading guide

This package separates upstream reports, source inspection, and local execution. The SDK study runs ten original regressions on pinned code and compares a predecessor-helper ablation. Orca uses original function bodies with a recording connection double. Superset runs the original Ed25519 functions with ephemeral local keys. None proves real cloud-model consumption, Claude inference, mobile behavior, or a cloud-sandbox lifecycle.

The two complete English articles above contain the experiment tables and limitations. Structured observations are in runs/sdk.json, runs/orca.json, and runs/superset.json. Development recommendations are review inputs, not confirmed CodeFlowMu defects or implemented features. Discussion drafts identify GitHub accounts and have not been sent.
