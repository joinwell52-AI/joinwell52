---
title: TMPA V1.0 正式发布记录
outline: deep
---

# TMPA V1.0 正式发布记录

发布日期：2026-08-11

## 升版裁决

TMPA Publication System 正式升版为 V1.0，官方版本如下：

| 层级 | 官方版本 | 定位 |
|---|---:|---|
| Architecture Paper | A1.0 | 研究理论与架构 |
| Core Specification | S1.0 | 规范对象、Reader 行为与 C01–C14 |
| Implementation Case | I1.0 | 作者运行的工程证据 |

GitHub 仓库 `joinwell52-AI/joinwell52` 是唯一事实源，正式修订由 Git History 表示。最终校验发行档案见 [TMPA V1.0 publication dossier](/releases/tmpa/tmpa-v1.0-publication-dossier.zip)。

## 升版采用的证据

CodeFlowMu V1.8.0 产品 Reader 针对精确 S1.0 冻结候选字节执行，在 71 项强制断言上记录 14 PASS、0 PARTIAL、0 NOT RUN、0 FAIL。正式证据归档 SHA-256 为 `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04`。

证据由作者运行并绑定固定 Bundle。CodeFlowMu 证据 Commit 在捕获时仅存在于本地，证据包包含其源码快照与 Patch。本次升版不主张独立验证、认证、普遍一致性、理论证明、语义真实性、幻觉消除或独立采用。

## 存档状态

仓库 Release 与 Git Tag 确立出版版本。DOI 生成属于单独的存档提交动作，目前仍为 pending。早期 RA1、RC1、A0.x、S0.x 与 I0.x 记录继续作为不可变出版历史保留。
