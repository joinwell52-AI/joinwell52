# BoundaryXP 7+1：公开材料复核

日期：2026-11-14。固定来源：[BoundaryXP](https://github.com/joinwell52-AI/BoundaryXP) main `6740e8764eff75c8966297f930690ad8192f854a`；朱卫论文中文 r23／英文 v1.2，[DOI 10.5281/zenodo.24072738](https://doi.org/10.5281/zenodo.24072738)。本报告核对保存的研究材料，不是新的产品模型分析或真实业务事故复现。

## 案例与问题

[RT044 报告](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-383.zh.md)与[保存结果 JSON](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/paper/materials/evidence-r18/results/R389-383.json)记录一个主任务、六个子任务和十项查询。主任务要求 A 安全复核先于 D 开机；TEST 加 D→B 包装，LAB 加 B→C 送检，SAFETY 加 C→同一次 A。KP 父图可满足，KT/KL/KF 单独加入父图分别可满足，KJ 联合图 `VIOLATED`。事件身份来自同轮唯一性的原文，不是程序猜测；报告只判断任务书计划，不声称事件已经发生。

对照：[RT042](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-381.zh.md)在左闭右开资源时段中 10—11 点与 11—12 点相接，未越界；[L23-050](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-153.zh.md)的“由他确认”无法唯一确定最终责任人，整体信息不足。这三项分别说明确定冲突、符合边界和未决身份。

## 重跑与结果

从上述固定提交克隆公开仓库，读取 `docs/paper/materials/evidence-r18/` 的项目、结果及 `STATISTICS-VERIFIED.json`，运行：

```text
python -B docs/paper/materials/analysis625/analyze.py
python -B docs/paper/materials/analysis625/witness_checks.py
python -B docs/paper/materials/case-r17/verify_math.py
```

三条命令均退出码 0。分类脚本逐例核对项目与结果哈希，返回 625 组、3,219 节点、3,469 查询，其中 3,257 项关联多个 7+1 视图、900 项绑定多个目标节点；精确来源结构组为 518。见[分析报告与脚本](https://github.com/joinwell52-AI/BoundaryXP/tree/main/docs/paper/materials/analysis625)。六项选定数学见证通过；EN20-007 的九项保存计算复核通过，其中已知费用下界 6,400 欧元超过 6,000 欧元上限至少 400 欧元。[案例材料与独立脚本](https://github.com/joinwell52-AI/BoundaryXP/tree/main/docs/paper/materials/case-r17)。

[原统计](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/paper/materials/evidence-r18/SOURCE-REPORT.md)中的 625/625 是保存的整体结论与现行标注、计算汇总结果一致；逐项有九项差异、三项未完成。现行标注含修订，精确来源结构有重复，不能把整体一致或项目数当作独立新任务准确率。复核脚本也不重新运行工作台、模型或原文语义抽取。

## MCP 核对范围

[0.4.0-rc.6 GitHub Release](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.6) 的 tgz 下载后 SHA-256 为 `D243EEAB864A99770DBF7258BC3B64DF2D674FF31CDAA97871747E606FE3C1B2`，与发行记录一致。包内 `package.json` 声明 Windows x64、Node ≥22.18 和版本 rc.6。本轮没有重新运行 MCP stdio 工具调用；18 工具／10 资源及安装回归来自[发行记录](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/RELEASE.md)，调用边界来自[工具说明](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/TOOLS.md)。

论文的形式保证有来源对应、身份、解释和查询编码等前提。[协议实现说明](https://github.com/joinwell52-AI/BoundaryXP/blob/main/protocol/IMPLEMENTATION.md)区分 draft.2 方法基线与现有工作台运行附件；边界判断不产生业务决定或执行授权。公开包没有私有 Core 原实现；本文不据此推断产品端到端准确率。
