---
title: "信任执行，不等于授权继承秘密"
date: '2026-08-21'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When repository- or plugin-supplied configuration can execute a helper, how should an engineering runtime separate authority to execute code from authority to inherit ambient credentials and other host capabilities?"
summary: "Workspace Trust 可以授权 Repository-controlled Helper 执行，却不必同时授予 Parent Process 继承来的所有 Credential。Claude Code v2.1.238 材料揭示了这种双门禁设计的价值与边界。"
sources:
  - research/analysis/Q-20260821-03-execution-trust-secret-authority-separation.md
item_id: "Q-20260821-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-21-trust-run-not-inherit-secrets-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-21-trust-run-not-inherit-secrets-cover-v2.png"
  kicker="开源工程 · 每日研究"
  title="信任执行，不等于授权继承秘密"
  summary="Workspace Trust 可以授权 Repository-controlled Helper 执行，却不必同时授予 Parent Process 继承来的所有 Credential。Claude Code v2.1.238 材料揭示了这种双门禁设计的价值与边界。"
  version="Q-20260821-03"
  status="Daily Runtime V5 · 2026-08-21"
  languageHref="/en/engineering/2026-08-21-trust-run-not-inherit-secrets"
  languageLabel="English"
/>

# 信任执行，不等于授权继承秘密

MCP `headersHelper` 看起来像一个配置字段，实际值却是 Shell Command。命令会在连接时运行，输出 JSON，并可生成 Authentication Header。当 Repository、Plugin 或 Agent File 提供这个 Helper 时，加载配置已经跨越 Code-execution Boundary。代码获准执行后，Child Process 还可能继承启动 Runtime 的 Credential。这是两种不同授权。

Claude Code v2.1.238 的发布材料分别记录了两个控制。Project `.mcp.json` Helper，以及 Project 或 `--add-dir` Agent File 中的 Inline MCP Server，必须先接受相关 Folder Trust，包括 `claude -p` 场景。同一 Release Note 还声明，Project、Plugin 与 Agent-file `headersHelper` 不继承 Credential Environment Variables。官方 MCP 文档则独立确认：Helper 是 Shell Execution，输出会成为 Connection Header，并可获得 Server Name、URL 等 Purpose-specific Variable。

工程规则简单却重要：**允许 Repository-controlled Code 执行的 Trust，并不等于允许它继承 Ambient Secret 的 Authority。**

## Executable Configuration 就是 Code

Project `.mcp.json` 设计上可以通过 Version Control 共享。这有助于复现配置，也意味着 Clone 下来的 Repository 可以提出 Executable Behavior。Trust Gate 询问的是：来自这个 Folder 的 Code 是否可以运行。当前文档明确说明，Project 或 Local `headersHelper` 要等到 Workspace Trust 被接受后才能执行；Folder 未受信时，Clone 的 Repository 也不能通过自己的 Checked-in Setting 预先批准 Project Server。

这是 Code Admission，不是 Benign-code Certificate。用户可能信任后来发生变化的 Repository，Trusted Helper 也仍可能包含恶意或过宽 Shell Logic。Trust State 因而只为一个决定提供证据：Runtime 可以从解析配置跨越到执行所声明 Helper。

Origin 同样重要。Project File、Plugin、User Configuration 与 Managed Setting 有不同 Ownership 与 Review Path。记录 Source、Canonical Path、Trust State 与 Content Identity，可以让 Admission Decision 可归责，而不是把所有解析出的配置值视为等价。

## Admission 与 Capability Grant 需要分开门禁

通过 Admission 后，Runtime 还必须决定 Child 获得什么 Authority。完整继承 Parent Environment 很方便，因为 Credential、Proxy 与 Provider Setting 会自动出现；但它也是 Accidental Delegation：Helper 获得 Secret，是因为 Launcher 恰好拥有，而不是因为任务明确需要。

v2.1.238 Note 描述了对选定 Helper Origin 移除 Inherited Credential Environment Variable。这是一项 Least-authority Control。Folder Trust 允许代码运行，Environment Policy 则扣留另一类 Capability。任何一项单独存在都不完整：Trust 而不 Sanitization，可能过度授权已接受 Helper；Sanitization 而不 Trust，仍可能执行未受信 Repository Code。

两类决定应独立评审，因为 Blast Radius 不同。Repository Identity 或 Helper Content 改变，可能让 Execution Trust 失效；Provider Secret 或 Helper 预期访问目标改变，则可能要求新的 Secret-access Decision，即使 Code Admission 仍然有效。

## 用显式 Context 取代 Ambient Inheritance

官方文档公开 `CLAUDE_CODE_MCP_SERVER_NAME`、`CLAUDE_CODE_MCP_SERVER_URL` 等 Purpose-specific Input，并在适用时提供额外 Plugin Context。这指向更强的 Child-process Contract：传入声明任务需要的 Context，再有意授予其他 Capability。

这样的契约可以描述：

- Executable Configuration 的 Origin 与 Content Identity；
- 允许执行的 Trusted Folder 或 Plugin Boundary；
- 提供给 Helper 的 Allowlisted Task Input；
- 分别授予的 Secret、Filesystem Location、Network Destination 与 External Effect。

拒绝也必须 Fail-visible。如果 Sanitization 移除了 Helper 期待的 Credential，Runtime 应区分 `capability-denied`、Remote Authentication Failure、Network Failure 与 Malformed Helper Output。否则 Operator 可能在错误 Layer 上修复问题，反而扩大 Ambient Access。

并非每个 Helper 都需要重量级 Sandbox。用户控制仓库里的低风险本地命令，可能适合较粗的 Trust Boundary。原则不是不计成本地追求最大隔离，而是每项 Capability 都因任务需要而授予，而不是因为 Parent 恰好拥有。

## Environment Filtering 不是 Sandbox

公开证据支持 Credential-environment Filtering 的存在，却不支持其准确实现。所选公开 Commit 发布的是 Release Note，不是 Product Source；已读材料与文档都没有枚举被剥离 Variable List 或 Public Regression Matrix。Helper 仍可能收到 Non-credential Environment Value 与显式 Context。

更重要的是，Environment Filtering 只关闭一条 Authority Channel。Trusted Shell Helper 仍可能读取文件、访问网络、检查 Process-visible Resource，或使用 Host 允许的 Credential Store。这里没有公开证据建立 Filesystem、Network、Keychain、Process 或 External-effect Isolation。

这条边界定义了下一组设计问题：Helper 是否应在执行前声明 Required Capability？Provider 变化时 Credential Classification 如何维护？Repository Identity、Path Ownership 或 Helper Content 改变后，哪些 Trust Decision 必须失效？什么 Machine-readable Error 能告诉自动化系统 Authority 是被有意扣留，而不是偶然失败？

Workspace Trust 与 Credential Filtering 的价值，恰恰来自它们回答不同问题。前者决定 Executable Configuration 能否运行，后者限制 Admission 之后的一类 Authority。更强 Isolation 从保持这两类事实分离开始，也从没有额外 Evidence 时拒绝把任何一项称为 Sandbox 开始。

**一手证据：** [Claude Code Release 提交 8a8e81d](https://github.com/anthropics/claude-code/commit/8a8e81d098cbd0fae4ee5b9c853542945fe87016) 与[官方 MCP 文档](https://code.claude.com/docs/en/mcp)。Release Note 是权威 Product Documentation，但没有公开私有 Filtering Implementation 或独立验证。
