# TMPA V1.0 正式发布

发布日期：2026-08-11

## 收录出版物

- TMPA Architecture Paper A1.0，中英文。
- TMPA Core Specification S1.0，中英文。
- TMPA Implementation Case I1.0，中英文。
- CFF 与 BibTeX 引用元数据。
- 带 SHA-256 校验和的 PDF 与 Markdown 出版工件。
- 已登记的 CodeFlowMu V1.8.0 精确版本外部运行与公开证据归档。

## 证据结果

CodeFlowMu V1.8.0 通过产品 `GovernanceReader.readSync` 针对精确 S1.0 Bundle 执行，在 71 项强制断言上记录 14 PASS、0 PARTIAL、0 NOT RUN、0 FAIL。证据包外部 SHA-256 为 `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04`。

冻结 S1.0 候选中的历史产品 `NOT RUN` 记录保持不变，后续外部产品运行单独登记。早期 A0.x、S0.x 与 I0.x 版本继续作为 Git 历史保留。

## 声明边界

证据由作者运行并绑定固定 Bundle。CodeFlowMu 证据 Commit 在捕获时仅存在于本地，其源码快照与 Patch 已包含在证据归档中。本次发布不主张独立验证、认证、普遍一致性、TMPA 理论证明、语义真实性、幻觉消除或独立采用。DOI 仍需通过单独存档提交生成。
