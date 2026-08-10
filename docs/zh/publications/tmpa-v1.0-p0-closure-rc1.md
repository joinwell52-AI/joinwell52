---
title: TMPA V1.0 P0 关闭记录 - RC1
outline: deep
---

# TMPA V1.0 P0 关闭记录

**记录：** RC1  
**日期：** 2026-08-10  
**审查基线：** A0.9 / S0.6 / I0.8  
**裁决：** **P0-01 至 P0-04 已关闭；可以进入最终升版审查。**

本记录关闭 [发布就绪审查 RA1](./tmpa-v1.0-release-readiness-audit) 识别的四项阻断问题。它本身不把文档升至 V1.0，不创建 Git Tag，不生成 DOI，也不声明独立验证。

## 关闭矩阵

| 阻断项 | 关闭方式 | 证据 |
|---|---|---|
| P0-01 精确 S0.6 产品登记 | 已关闭 | 带日期的 I0.8 外部运行登记固定 Core 与实现 Commit、证据包 SHA-256、输入 Bundle Digest、结果 Digest 及 14/14 裁决；2026-08-09 冻结的 `NOT RUN` 记录继续保留为历史。 |
| P0-02 工程来源固定 | 通过声明边界关闭 | 在线 CodeFlowMu Browser 只作界面说明；可复现声明使用锁定 I0.8。小典仅是作者报告的谱系，不纳入评估语料、研究问题结果或一致性声明。 |
| P0-03 TMPA 引用元数据 | RC1 已关闭 | 六份分语言 CFF、一份 BibTeX 与发布身份记录统一三份作品及中英文版本；DOI、ORCID 和最终许可证确认继续作为显式升版决策。 |
| P0-04 不可变出版档案 | RC1 已关闭 | 已生成并验证六份 PDF、六份 Markdown、中英文 Release Notes、构建记录、Manifest、校验和及可下载 ZIP。 |

## 下载

- [TMPA V1.0 RC1 出版档案 ZIP](/releases/tmpa/tmpa-v1.0-rc1-publication-dossier.zip)
- [ZIP SHA-256](https://joinwell52-ai.github.io/joinwell52/releases/tmpa/tmpa-v1.0-rc1-publication-dossier.zip.sha256)
- [RC1 Manifest](/releases/tmpa/v1.0-rc1/MANIFEST.json)
- [RC1 校验和](https://joinwell52-ai.github.io/joinwell52/releases/tmpa/v1.0-rc1/SHA256SUMS)
- [英文 Release Notes](https://joinwell52-ai.github.io/joinwell52/releases/tmpa/v1.0-rc1/RELEASE-NOTES.en.md)
- [中文 Release Notes](https://joinwell52-ai.github.io/joinwell52/releases/tmpa/v1.0-rc1/RELEASE-NOTES.zh.md)

外层 ZIP SHA-256：

```text
6575875a1af827cbfcdaa6f0ace0d8b6ad8e7f9fdf6cfc98022f80b6e74481ed
```

## 验证结果

- 六份 PDF 均成功渲染，并完成中文字体检查；
- `SHA256SUMS` 的 24 项全部通过；
- 外层 ZIP 校验和及 ZIP 完整性通过；
- 六份 CFF 均可解析且保留必需身份字段；
- `run.json`、`release.json`、`BUILD.json` 与 `MANIFEST.json` 均通过严格 JSON 解析；
- 精确 I0.8 证据包继续在 Implementation Case 路径独立发布。

## 剩余升版决策

在创建 A1.0/S1.0/I1.0、Tag 与 DOI 前，作者仍需显式确认公开身份/ORCID、最终许可证、Zenodo 存储结构和投稿包装。确认前，A0.9/S0.6/I0.8 仍是正式版本。
