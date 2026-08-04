---
title: 研究报告生产机 V1.3 快速开始
outline: deep
---

# 研究报告生产机 V1.3 快速开始

## 1. 下载

### 下载 ZIP

[下载当前源码 ZIP](https://github.com/joinwell52-AI/joinwell52/archive/refs/heads/main.zip)

解压后进入 `joinwell52` 目录。

### 使用 Git

```bash
git clone https://github.com/joinwell52-AI/joinwell52.git
cd joinwell52
```

## 2. 你下载到了什么

```text
research/skills/
  Research Skills V2.0 与三个情报 Profile

research/intelligence/
  AI 平台、GitHub 工程、论文与研究成果来源 Registry

research/runtime/
  Scheduler、Worker Contract、Runtime Record、三栏计划与出版候选规范

scripts/
  Runtime、Research Intelligence 与网站数据校验脚本

.github/workflows/
  GitHub 调度、验证与 Pages 部署流程

docs/
  中英文 VitePress 网站
```

## 3. 环境准备

本仓库网站和校验脚本需要：

- Git；
- Node.js 22；
- npm；
- 一个可写入的 GitHub 仓库；
- 用于实际研究工作的 ChatGPT 环境。

## 4. 安装依赖并验证

```bash
npm install
npm run intelligence:validate
npm run runtime:validate
npm run docs:build
```

全部通过后，说明来源 Registry、Runtime 记录、三栏计划、出版候选和网站能够按当前仓库规则完成构建。

## 5. 本地预览网站

```bash
npm run docs:dev
```

或者：

```bash
npm run docs:build
npm run docs:preview
```

## 6. 配置自己的三个研究栏目

默认栏目定义在：

```text
research/runtime/SCHEDULER.json
research/intelligence/REGISTRY.json
```

默认三个栏目是：

- 数字员工；
- 行业架构；
- 开源工程。

使用者可以替换栏目名称、研究问题和来源，但必须保持：

- 每个入选对象只有一个主栏目；
- 每个栏目每天有 `Selected` 或 `No Selection`；
- 未选题必须说明覆盖情况和原因。

## 7. 配置来源情报

编辑：

```text
research/intelligence/REGISTRY.json
```

其中包含：

- OpenAI、Claude、Gemini、Cursor、GitHub Copilot、Microsoft Copilot Platform；
- 受控 GitHub 组织、仓库与查询主题；
- arXiv、OpenReview、AI 研究机构、会议和论文来源；
- 证据等级、扫描频率和跨管线去重规则。

## 8. 在 ChatGPT 中建立 Worker

GitHub Workflow 只负责打开执行槽，并不会自行完成研究写作。

按照以下文件建立对应 ChatGPT Worker：

```text
research/runtime/WORKER-PROMPTS-V2.md
```

正式班次：

```text
09:00 Engine
10:00 Queue + Research Intelligence
11:00 Knowledge
周一 12:00 Architecture
15:00 Production
20:00 Publication
周日 20:30 Weekly
周三 10:00 Academic
```

每个 Worker 必须：

1. 读取上游权威文件；
2. 只执行本班次职责；
3. 写入结构化工作成果；
4. 更新 Runtime Log；
5. 提交持久产物；
6. 重新读取 Git Commit 并完成验证。

## 9. 运行 10:00 情报与三栏选题

Queue Worker 必须依次运行：

```text
Skill 01-P AI Platform Change Intelligence
Skill 01-G GitHub Engineering Intelligence
Skill 01-R Published Research Intelligence
↓
跨来源去重
↓
Skill 02 Three-Column Research Triage
```

输出：

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
research/runtime/plans/YYYY/MM/YYYY-MM-DD-plan.json
```

## 10. 运行 15:00 完整报告生产

Production Worker 读取合格研究对象并执行：

```text
Skill 05 Research Writing
→ Skill 06 Visualization
→ Skill 07 Evidence & Citation
→ Skill 08 Publication Editing
```

输出完整中英文 `Publication Candidate`：

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

Production 不得直接放入公共文章目录。

## 11. 运行 20:00 发版

Publication Worker 只能消费完整候选：

```text
Publication Candidate
→ 公共中英文 Markdown
→ Metadata / Index / Website
→ GitHub Commit
→ Commit Verify
→ Release
```

不得在 20:00 临时搜索、重新分析或从头写文章。

## 12. 查看运营结果

运营中心页面：

```text
/zh/runtime/
```

它展示：

- 三条情报管线覆盖率；
- 三个栏目的选题结果；
- 每个定时班次的实际工作成果；
- 15:00 出版候选；
- 20:00 发版结果；
- Runtime Record 和 GitHub 验证。

## 13. 重要边界

- ChatGPT 是实际 Worker；
- GitHub Actions 触发不等于工作完成；
- 没有完整情报运行，Queue 不能正式完成；
- 没有完整出版候选，Publication 不得发布；
- 没有 Runtime Record 和 Commit Verify，不属于正式运行结果；
- 仓库公开可下载，复制、改编、再发布和商业使用以当前 `LICENSE.md` 为准。

## 返回产品页

[研究报告生产机 V1.3](./research-report-production-engine-v1.3)
