---
title: TMPA V1.0 发布就绪审查 — RA1
type: release-audit
domain: TMPA
version: RA1
status: blocked
source: github-main
outline: deep
---

# TMPA V1.0 发布就绪审查

**审查日期：** 2026-08-10  
**冻结审查基线：** `8e01c275062244d4978539f86399853f2e35b0e5`  
**审查版本：** 主论文 A0.9 · 核心规范 S0.6 · 实现案例 I0.8  
**升版裁决：** **BLOCKED（阻断）**

三文档体系已经具备进入发布修复阶段的内部一致性，当前工程证据也已通过；但目前还不能直接改标为 A1.0、S1.0 和 I1.0。阻断项属于发布治理与归档完整性，不代表 TMPA 理论主张失败，也不代表 C01–C14 产品运行失败。

在下列全部 P0 项通过 Git 历史关闭前，禁止发布 V1.0 版本号、Git Tag、DOI 或“稳定发布”声明。

## 1. 范围与裁决模型

本次审查仅检查 GitHub 唯一事实源。本地编辑目录、ChatGPT Library、未发布工作目录和历史副本均不作为正式来源。

| 门禁 | 结果 | 结论 |
|---|---|---|
| 三文档分层 | PASS | A0.9 负责理论，S0.6 负责规范，I0.8 负责有边界的工程证据。 |
| 中英文结构对齐 | PASS | 标题计数一致：主论文 17 个 H1 / 35 个 H2；Core 14 个 H1 / 54 个 H2；案例 16 个 H1 / 6 个 H2。 |
| 术语与指导链 | PASS | 当前关系统一为：TMPA 理论 → Core 要求 → FCoP 协调协议 → CodeFlowMu 实现证据。 |
| Core 准则完整性 | PASS | 中英文均包含 C01–C14；Reference Reader 14/14 PASS。 |
| 产品证据完整性 | PASS | CodeFlowMu V1.6.0 对 S0.6 的结果为 14 PASS、0 PARTIAL、0 NOT RUN、0 FAIL。 |
| 证据包完整性 | PASS | ZIP 校验和与压缩包完整性通过；公开复现器共包含 195 个条目。 |
| 参考文献身份抽查 | PASS | 对 9 条高时效 arXiv 记录进行在线核对，编号与标题均匹配。 |
| 发布档案一致性 | BLOCKED | 冻结的 S0.6 审查和 Core 说明文字仍称不存在 S0.6 产品运行。 |
| 工程来源归档 | BLOCKED | CodeFlowMu 浏览器证据和小典 AI 档案尚未固定为稳定的公开投稿证据。 |
| V1.0 出版包 | BLOCKED | TMPA 专用引用元数据、作者标识、发布清单、Release Notes 和投稿制品尚未完备。 |

因此，最终裁决是：**阻断 V1.0 升版**；当前 A0.9/S0.6/I0.8 工程基线仍然有效。

## 2. 可复现性记录

### 2.1 S0.6 Reference Reader

执行 `npm run tmpa:s0.6:conformance`，结果为 **14/14 PASS**，结果摘要为：

```text
sha256:210ae9ca94235a4886cb67e633769d0709a7ae9fe54771226eee528d067a1c51
```

其中产品轨道是有意冻结的历史 `NOT RUN` 基线。该历史记录不得改写；应把 I0.8 登记为随后完成的、外部精确版本产品运行。

### 2.2 I0.8 公开证据包

审查对象：

- [I0.8 CodeFlowMu V1.6.0 / S0.6 证据 ZIP](/evidence/tmpa/i0.8/tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip)

同目录文件 `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip.sha256` 记录下方校验和。

已验证的压缩包摘要：

```text
3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9
```

`sha256sum -c`、ZIP 完整性、7 个 canonical LF 输入检查和产品 Runner 均通过。产品 Runner 返回：

```text
aggregate: PASS
PASS: 14
PARTIAL: 0
NOT RUN: 0
FAIL: 0
product_reader_called: true
reference_reader_called: false
input_bundle_digest: sha256:251914ee55922d20c9bd23943a4ff445bccaa5835e1fcc11b8562f3f384243fa
result_digest: sha256:f16ab28e694003a25ba83cb9c94e85d757860201caca2f489f32e4d1ca3cc7f2
```

证据包内的 `tsx` 启动器在本次受限审查沙箱中无法创建临时 IPC Socket（`EPERM`）。从官方 npm registry 完成依赖安装并通过输入验证后，本次使用 Node 的 TypeScript 类型剥离模式执行同一 Runner，得到上述结果。这属于环境限制，不是 Conformance 断言失败；正式发布包仍应在不受限的干净机器上再执行一次标准命令。

## 3. P0 阻断项

### P0-01 — 登记后续完成的 S0.6 产品运行

历史 S0.6 发布审查和 Core 说明文字仍称不存在精确 S0.6 产品证据。必须保留冻结的 Reference Reader 历史，同时为 I0.8 增加带日期的外部运行登记，并从 Core 中英文版本移除已经过时的未来式表述。

**关闭证据：** Core 中英文修订、外部运行清单条目、精确证据路径、校验和、执行身份及 Git Commit。

### P0-02 — 固定被引用的实现来源

主论文参考文献 [13] 已注明 CodeFlowMu 浏览器构建与数据集身份仍需固定；参考文献 [25] 已注明小典 AI 在外部投稿前需要固定的公开或归档快照。应发布带 Commit/Tag 和归档标识的不可变快照；如果不能发布，则必须收窄或移除依赖这些材料的投稿主张。

**关闭证据：** 稳定公开链接、仓库 Commit/Tag、归档校验和和明确的主张边界。

### P0-03 — 建立 TMPA 专用引用元数据

仓库级 `CITATION.cff` 描述的是 joinwell52 Research Center 3.0，不是 TMPA 三文档发布。每份 V1.0 文档都需要规范标题、作者、机构、版本、发布日期、仓库地址、许可证、推荐引用和 DOI 字段。中英文版本应指向同一作品身份，同时保留各自语言元数据。

**关闭证据：** 通过验证的 TMPA CFF/BibTeX 元数据以及同步后的文档 Frontmatter。

### P0-04 — 构建不可变 V1.0 发布包

仓库已有 Web Markdown，但没有完整的 TMPA V1.0 发布档案。必须生成可投稿制品、带 SHA-256 的文件清单、中英文 Release Notes 和可复现构建记录。最终 Tag 只能从审查通过的 Commit 创建。

**关闭证据：** 可复现论文制品、Manifest、Checksums、Release Notes、通过的 CI 和经审查的发布 Commit。Tag 与 DOI 在发布包通过审查后创建。

## 4. P1 发布决策

以下事项必须由作者在公开发布前明确确认：

1. 规范作者姓名、机构、公开联系邮箱和 ORCID；
2. 论文、规范和证据制品的许可证——仓库当前为保留全部权利，仅允许有限的学术阅读和引用；
3. Zenodo 存档结构与 DOI 回填顺序；
4. 目标投稿平台所需的匿名稿或源文件包。

## 5. 不阻断“有边界 V1.0”的事项

独立复现、独立采用、对照基线、代表性 SME 运行成本测量以及更广泛的低资源性能仍属于后续研究。只要三文档继续把当前结果标记为作者运行，不把单个实现泛化为理论证明，并严格区分 `Specified / Implemented / Demonstrated / Independently Adopted`，这些事项就不阻断 V1.0。

## 6. 升版规则与下一门禁

出版卡片继续保持 **A0.9 / S0.6 / I0.8**。Phase 5.2 应在不改版本号的前提下关闭 P0-01 至 P0-04。关闭提交通过中英文检查、Conformance 验证、证据校验和与站点构建后，再进行最终升版审查，决定是否授权 **A1.0 / S1.0 / I1.0**、Release Tag 和归档存储。

本审查只有进入默认分支的 Git Commit 后才属于正式修订。
