# 2026-11-18 研究报告：MCP 参数名与会话数据边界

## 来源与分类

今日[情报页](../../../../docs/zh/runtime/daily-intelligence/2026-11-18.md)记录 35 条观察。选 O1 [Google ADK Python 修复提交](https://github.com/google/adk-python/commit/889ddd3134df1dd1a626205ee78811950dec2a5c)做实验：它把 MCP 服务声明的 prompt 参数名与会话状态值之间的自动匹配取消。O2—O9 的恢复、O10/O33 的协作终态以及其他治理线索继续留在资料与后续候选，不能因阅读就算作实验。上游修复不是生产泄漏证明，也不自动说明 CodeFlowMu 有同类问题。

## 固定版本与实验

上游对照：修复父提交 `13b6ae89cc2d8a55388bc638b97c8ec03bd80401`、修复提交 `889ddd3134df1dd1a626205ee78811950dec2a5c`。从两版 Git blob 原样抽取 `McpInstructionProvider` 类，接入替身 session manager 与 MCP session；替身会话只有合成邮箱和合成凭证。旧版默认调用一次 `list_prompts`，并把服务声明同名的两项会话值送入 `get_prompt`。新版默认不调用 `list_prompts`，`get_prompt` 收到 `None`；显式静态或回调参数才发送指定值。六项断言通过。此法未运行完整 ADK 或真实网络 MCP。

本地对照：CodeFlowMu V3.0.152、提交 `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`。实际 `CodexMcpToolBridge.ts` 加替身 app-server，服务 schema 故意声明敏感字段。发现阶段零工具调用；空显式参数只转发空对象；只给 `locale` 就只转发 `locale`；显式给合成凭证仍会转发。额外 `session_state` 字段与把外部调用指向 `fcop` 均被拒绝。七项断言通过。`SourceCapabilityEnvironment.ts` 的三个断言表明配置的合成 `API_TOKEN` 会进入插件环境，未配置时不会凭空出现。Source 真实传输与模型行为未测。现有桥接单测因本地缺 `@cursor/sdk` 在导入时中止，未运行断言。

## 结论与开发评审

测试过的 CodeFlowMu Codex 外部 MCP 桥接没有“服务只声明字段名，就从会话状态自动取值”的同类机制；它允许调用者显式提供参数，Source 插件环境也允许明确配置。这两条是另外的授权和数据最小化问题，不由本实验判定为产品缺陷。**本轮 1 个实验议题、1 组双语文章、0 个正式开发评审项目、0 个开发任务。** 若以后验证模型会把不应提供的上下文主动填入参数，再以真实调用链和本地需求进入评审。英文可读证据见 [English report](./00-report.en.md)。
