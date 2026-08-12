# Joinwell52 Research Center 本地运行说明

本文说明如何在 Windows 本地启动、检查和构建 Joinwell52 Research Center，并明确本地网站与自动文章生产 Runtime 的边界。

## 1. 本地运行包含什么

本仓库的本地运行环境主要用于：

- 预览 Research Center 中英文网站；
- 检查 Markdown、页面、导航和静态资源；
- 生成 Runtime 与 Research Intelligence 页面投影；
- 执行 Publication System、编辑 Gate、历史兼容和站点构建校验；
- 拉取并检查 15:00 Production 生成的实际文章候选。

本地启动网站**不会**：

- 自动调用 ChatGPT 写文章；
- 自动触发 15:00 Production；
- 自动执行 20:00 Publication；
- 自动提交或推送 GitHub；
- 自动更新线上 GitHub Pages。

15:00 的实际文章生产由 GitHub 调度槽与 ChatGPT Worker 完成。20:00 Publication 通过发布 Gate 后，才把合格候选发布到公开网站。

## 2. 环境要求

推荐环境：

- Windows 10 或 Windows 11；
- Git；
- Node.js 20 LTS 或更高版本；
- npm；
- PowerShell 或 Windows Terminal。

检查环境：

```powershell
git --version
node --version
npm --version
```

本任务验证时使用过：

```text
Git 2.53
Node.js 24.16
npm 11.13
```

具体版本不要求完全相同，优先使用仍受支持的 Node.js LTS 版本。

## 3. 第一次准备本地仓库

如果本机尚未有源码：

```powershell
Set-Location 'D:\TMPA'
git clone https://github.com/joinwell52-AI/joinwell52.git
Set-Location 'D:\TMPA\joinwell52'
npm ci
```

如果已经存在本任务同步的工作副本：

```powershell
Set-Location 'D:\TMPA\joinwell52'
git status
git pull --ff-only origin main
npm ci
```

在执行 `git pull --ff-only` 前，先确认 `git status` 没有需要保留的本地修改。不要用拉取操作覆盖尚未提交的工作。

`npm ci` 严格按照 `package-lock.json` 安装依赖，适合第一次安装、依赖更新后安装和 CI 一致性检查。依赖没有变化时通常不需要每次重复执行。

## 4. 启动本地网站

```powershell
Set-Location 'D:\TMPA\joinwell52'
npm run docs:dev
```

该命令会先生成页面需要的 Runtime 和 Research Intelligence 投影，然后启动 VitePress 开发服务器。

默认访问地址：

<http://localhost:5173/joinwell52/>

如果终端显示了不同端口，以终端输出为准。停止服务器时，在启动它的终端按 `Ctrl+C`。

开发服务器支持热更新。修改站点 Markdown、Vue 组件或配置后，浏览器通常会自动刷新。

### 端口被占用

可以指定其他端口：

```powershell
npm run docs:dev -- --port 5174
```

然后访问：

<http://localhost:5174/joinwell52/>

## 5. 常用校验命令

### 完整 Runtime 与 Publication 校验

```powershell
npm run runtime:validate
```

当前命令依次检查：

1. Runtime V5 记录和任务合同；
2. Research Intelligence；
3. 历史文章与候选版式；
4. Editorial Architecture V2。

Editorial Architecture V2 会检查：

- 研究问题；
- 文章类型；
- 动态正文模块；
- 证据身份与主张强度；
- 研究独立性；
- 内部证据与独立证据；
- Publication ≠ Validation；
- 中英文一致性；
- Research Center 与 Community Edition 分层。

### 只检查新编辑架构

```powershell
npm run publication:editorial:validate
```

### 只检查文章版式

```powershell
npm run publication:layout:validate
```

### 执行正式站点构建

```powershell
npm run docs:build
```

该命令模拟线上 Pages 构建链路，包括 Runtime 投影、VitePress 严格构建和构建产物验证。

### 预览正式构建产物

```powershell
npm run docs:preview
```

预览端口通常为 `4173`，但仍以终端显示的地址为准。

## 6. 检查 15:00 实际生成的文章

15:00 Production 完成后，先同步 GitHub 最新内容：

```powershell
Set-Location 'D:\TMPA\joinwell52'
git status
git pull --ff-only origin main
```

当天候选批次通常位于：

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

中英文候选文章通常位于：

```text
staging/publication-candidates/
```

可选 Community Edition 位于：

```text
staging/community-editions/
```

检查当天候选文件：

```powershell
Get-ChildItem -LiteralPath 'research\runtime\candidates\2026\08'
Get-ChildItem -LiteralPath 'staging\publication-candidates' | Sort-Object LastWriteTime -Descending | Select-Object -First 20
```

然后执行：

```powershell
npm run publication:editorial:validate
npm run runtime:validate
npm run docs:dev
```

15:00 实际验收重点：

1. 是否先声明了明确研究问题；
2. 是否识别了合适的文章类型；
3. 不同文章是否采用不同且自然的正文结构；
4. 是否存在空洞的固定栏目；
5. 外部研究是否仍强制提到 TMPA、FCoP 或 CodeFlowMu；
6. 工程影响是否首先面向相关系统类别，而不是默认面向自有项目；
7. DOI、Zenodo、正式发布或同行评审是否被错误写成理论验证；
8. 内部实验与独立证据是否明确区分；
9. 中英文主张强度和结论边界是否一致；
10. Community Edition 是否真正采用不同标题、角度、结构和讨论问题。

15:00 产生的是候选文章，不一定已经出现在公开站点。候选通过 20:00 Publication 后，才进入公开 Research Center 页面。

## 7. V2 回归样例

三篇不会公开发布的编辑架构回归样例位于：

```text
research/production-tests/editorial-architecture-v2/
```

它们用于验证：

- 三种不同文章类型与三套不同目录；
- 外部研究无需出现自有项目；
- 允许以开放问题、尚不明确或局限结束；
- Community Edition 与 Research Center Edition 不同；
- 中英文 DOI、发表状态和证据强度的正确与错误表达。

运行：

```powershell
npm run publication:editorial:validate
```

## 8. 本地文件发生变化时

`npm run docs:dev` 和 `npm run docs:build` 会重新生成部分页面投影。运行后先检查：

```powershell
git status
git diff --stat
```

不要把所有生成差异直接提交。先确认变化是否来自本次任务、最新 Runtime 数据，还是单纯的本地重建结果。

不要为了消除 npm 安全提示直接执行：

```text
npm audit fix --force
```

强制升级可能破坏锁定依赖和站点兼容性，应另建依赖升级任务评估。

## 9. 本地与线上之间的关系

```text
GitHub main
→ 拉取到本地工作副本
→ 本地校验与预览
→ 合格改动提交并推送 main
→ Deploy Research Center Pages
→ gh-pages
→ 线上 Research Center
```

线上地址：

<https://joinwell52-ai.github.io/joinwell52/>

本地预览不等于线上发布。只有 GitHub Pages 部署工作流完成，并且线上路径能够访问，才算完成公开上线。

## 10. 快速命令清单

```powershell
Set-Location 'D:\TMPA\joinwell52'

# 同步最新代码
git status
git pull --ff-only origin main

# 安装锁定依赖
npm ci

# 启动本地网站
npm run docs:dev

# 完整校验
npm run runtime:validate

# 正式构建
npm run docs:build

# 只检查编辑架构
npm run publication:editorial:validate
```
