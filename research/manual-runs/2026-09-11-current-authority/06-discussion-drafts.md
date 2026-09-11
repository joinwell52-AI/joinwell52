# 交流稿：GitHub，含发送状态

以下 @ 均为对应 PR 返回的作者 GitHub login，已在本轮读取核对。不是 X 账号。2026-09-11 用户授权基于真实工程实验分享启发与问题；SDK、Orca、Superset 三条英文评论均已发送并回读。下文 SDK、Orca 为实际发送英文及中文对照；Superset 保留原准备稿，实际发送版本见 [Superset 英文评论](engagement/superset-comment.en.md)。完整回执见 [engagement](engagement/README.md)，以该目录为准。

## Agents SDK：给 @hyeonsang010716

位置：[openai/openai-agents-python #4947](https://github.com/openai/openai-agents-python/pull/4947)。依据：固定修复代码的十个上游新增回归，及只替换旧 helper 的十个失败对照。

**中文交流稿**

@hyeonsang010716 读到这次修复后，我们受到了启发，围绕“恢复执行完成，是否就意味着工具结果已经进入下一次模型输入”做了一组小型工程实验。我们在固定提交 3f9397f 上重跑了新增的十个回归，全部通过；保持其他代码和测试不变，只把未发送调用 ID 的 helper 换回 83c737f 的实现，十个均因缺失结果或错误归属而失败。八组 Runner 用例中，最终 done 断言先通过，调用 ID 检查随后才发现遗漏。这个对照让我们更清楚地理解了为什么要直接检查恢复请求中的工具输出。

这些是本地 ScriptedModel 实验，观察只到请求构造。分阶段批准用例证明了该输入中每份输出只出现一次，但还不能说明服务端接受请求、确认却丢失时会发生什么。想进一步做故障注入实验：SDK 是否已有适合测试这种不确定确认的入口，还是更适合在传输层或服务端边界单独验证？

**English · 已发送**

@hyeonsang010716 This fix inspired a small engineering experiment on what to check when a resumed run appears to finish normally. We reran the ten added regressions at `3f9397f`: all passed. With the rest of the runtime and tests unchanged, substituting only the unsent-call helper from `83c737f` made all ten fail. In the eight Runner cases, the final `done` assertion still passed before the call-ID assertion exposed the missing output. That contrast helped us understand why inspecting the next model input matters, beyond checking the final response.

These were local ScriptedModel experiments, so our observation stops at request construction. The staged-approval case establishes one inclusion per output in that input; it does not tell us what happens if a server accepts a request but its acknowledgement is lost. For a follow-up fault-injection experiment, is there an existing SDK test boundary you would recommend for that ambiguous-acknowledgement case, or is it best exercised separately at the transport/server boundary?

[Reproduction scripts, passing/failing logs, and limitations](https://github.com/joinwell52-AI/joinwell52/tree/e09cf423/research/manual-runs/2026-09-11-current-authority).

## Orca：给 @brennanb2025

位置：[stablyai/orca #19946](https://github.com/stablyai/orca/pull/19946)。依据：原函数与连接替身的八组双版本对照；未重跑真实 Claude。

**中文交流稿**

@brennanb2025 这次修复对历史模型选择和当前模型目录的处理给了我们启发。我们想具体看看：恢复旧选择时，目录明确不支持与目录暂时不可用，会走怎样不同的路径？于是固定了 base/head，运行原设置与恢复函数，用记录调用的连接替身做了八组工程对照。明确未列出与退役恢复的 setModel 调用从 1 降为 0；别名、完整 resolved ID、查询失败、空目录与 default-only 的兼容分支均保留。

这个实验帮助我们区分“允许尝试”和“确认可用”。我们没有运行真实 Claude。你报告无效模型也能出现在初始化帧里，后来又补充了界面恢复验证，这让我们想到下一步的问题：对于允许设置的模型，应观察什么来确认实际采用？成功回合中的模型用量元数据是否合适，还是已有更直接的提供方确认？我们理解账号使用资格不在本次修复范围内。

**English · 已发送**

@brennanb2025 The distinction between an explicitly absent model and an unavailable catalog prompted us to run eight comparisons using the original setting/restore functions at `027acb4` and `a13c845`, with a recording connection double. Unlisted changes and retired restores went from one `setModel` call to zero, while listed aliases, resolved IDs, valid restores, and the three unavailable/non-identifying catalog cases still reached the setter. It helped us separate “allowed to try” from “confirmed usable” in our own restoration checks.

We did not run the real Claude binary. Your report that even an invalid model can appear in the init frame, together with the later UI reconciliation check, gives us a useful next experimental question: for a permitted choice, what observation would you use to confirm effective model adoption? Would a successful turn with model-usage metadata be the right boundary, or is there a more direct provider confirmation already available? We understand that account entitlement is outside this fix's scope.

[Original-function probe, all sixteen observations, and limitations](https://github.com/joinwell52-AI/joinwell52/tree/e09cf423/research/manual-runs/2026-09-11-current-authority).

## Superset：给 @saddlepaddle

位置：[superset-sh/superset #7408](https://github.com/superset-sh/superset/pull/7408)。依据：本地原 Ed25519 函数九项检查；没有真实云沙箱验证。

**中文交流稿**

@saddlepaddle 我们对 4ec6c8e 的原签发/验签函数进行了本地检查：跨 workspace、到期时刻、错误公钥与篡改 audience 都被拒绝；同一 workspace、公钥和有效期内的再次验证仍通过。后一项只是重复验签，不是实际重启实验。

这看起来是 workspace 访问权合同。新 sandbox/process generation 恢复后的执行授权是否有另一层校验，还是产品有意允许同一 workspace 的访问凭证跨实例延续？我们没有把缺少 generation 参数当成漏洞。

**English draft**

@saddlepaddle We checked the original signing/verifying functions at 4ec6c8e locally: wrong workspace, expiry, wrong public key, and a tampered audience were rejected. Reverification for the same workspace and key within the lifetime still passed; this was not an actual sandbox restart.

That appears to be a workspace-access contract. Is execution authority after a new sandbox/process generation established elsewhere, or is access-token continuity across instances an intentional workspace-level behavior? We are not treating the absence of a generation argument as a defect.
