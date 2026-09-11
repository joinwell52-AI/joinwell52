# 交流稿：GitHub，未发送

以下 @ 均为对应 PR 返回的作者 GitHub login，已在本轮读取核对。不是 X 账号；没有冒充与作者对话，也没有发送通知或评论。公开前可择其一使用，不将相同问题多平台重复投递。

## Agents SDK：给 @hyeonsang010716

位置：[openai/openai-agents-python #4947](https://github.com/openai/openai-agents-python/pull/4947)。依据：固定修复代码的十个上游新增回归，及只替换旧 helper 的十个失败对照。

**中文交流稿**

@hyeonsang010716 读到这次修复后，我们受到了启发，围绕“恢复执行完成，是否就意味着工具结果已经进入下一次模型输入”做了一组小型工程实验。我们在固定提交 3f9397f 上重跑了新增的十个回归，全部通过；保持其他代码和测试不变，只把未发送调用 ID 的 helper 换回 83c737f 的实现，十个均因缺失结果或错误归属而失败。八组 Runner 用例中，最终 done 断言先通过，调用 ID 检查随后才发现遗漏。这个对照让我们更清楚地理解了为什么要直接检查恢复请求中的工具输出。

这些是本地 ScriptedModel 实验。我们的理解是，这次修复确保了受测恢复路径中每份输出只进入一次模型输入；确认丢失后的网络重试还需要另外验证。想请教，这样理解本次修复的保证范围是否准确？

**English draft**

@hyeonsang010716 This fix inspired a small engineering experiment around a question: when a resumed run finishes, have its tool outputs actually reached the next model input? We reran the ten added regressions on pinned 3f9397f: all passed. Keeping the remaining runtime and tests identical, replacing only the unsent-call helper with its 83c737f implementation made all ten fail on missing output or incorrect ownership. In the eight Runner cases, the final `done` assertion passed before the call-ID assertion exposed the omission. That contrast helped us understand why inspecting the tool outputs in the resumed request matters.

These were local ScriptedModel experiments. Our reading is that the fix ensures each output appears once in the model input on the tested resume paths; network retries after an ambiguous acknowledgement would need separate verification. Does that accurately describe the scope of this fix?

## Orca：给 @brennanb2025

位置：[stablyai/orca #19946](https://github.com/stablyai/orca/pull/19946)。依据：原函数与连接替身的八组双版本对照；未重跑真实 Claude。

**中文交流稿**

@brennanb2025 这次修复对历史模型选择和当前模型目录的处理给了我们启发。我们想具体看看：恢复旧选择时，目录明确不支持与目录暂时不可用，会走怎样不同的路径？于是固定了 base/head，运行原设置与恢复函数，用记录调用的连接替身做了八组工程对照。明确未列出与退役恢复的 setModel 调用从 1 降为 0；别名、完整 resolved ID、查询失败、空目录与 default-only 的兼容分支均保留。

这个实验帮助我们认识到，“允许尝试”与“当前目录明确支持”需要分别理解。我们没有运行真实 Claude，因此结论只到设置和恢复函数的调用边界。想请教，目录未知时保留尝试机会、把模型是否实际采用留给后续确认，是否符合这里的设计意图？

**English draft**

@brennanb2025 The way this fix handles saved model choices against the current model catalog inspired us to explore a specific question: how does restoring an old choice differ when the catalog excludes it versus when the catalog is unavailable? We ran eight engineering comparisons using the pinned base/head setting and restore functions with a recording connection double. Unlisted changes and retired restores went from one `setModel` call to zero; aliases, resolved IDs, failed queries, empty catalogs, and default-only compatibility remained usable.

The experiment helped us distinguish permission to try a choice from explicit support in the current catalog. We did not run the real Claude binary, so our observations stop at the setting and restore call boundary. Is the intent to preserve the opportunity to try when the catalog is unknown, leaving confirmation of actual model adoption to a later step?

## Superset：给 @saddlepaddle

位置：[superset-sh/superset #7408](https://github.com/superset-sh/superset/pull/7408)。依据：本地原 Ed25519 函数九项检查；没有真实云沙箱验证。

**中文交流稿**

@saddlepaddle 我们对 4ec6c8e 的原签发/验签函数进行了本地检查：跨 workspace、到期时刻、错误公钥与篡改 audience 都被拒绝；同一 workspace、公钥和有效期内的再次验证仍通过。后一项只是重复验签，不是实际重启实验。

这看起来是 workspace 访问权合同。新 sandbox/process generation 恢复后的执行授权是否有另一层校验，还是产品有意允许同一 workspace 的访问凭证跨实例延续？我们没有把缺少 generation 参数当成漏洞。

**English draft**

@saddlepaddle We checked the original signing/verifying functions at 4ec6c8e locally: wrong workspace, expiry, wrong public key, and a tampered audience were rejected. Reverification for the same workspace and key within the lifetime still passed; this was not an actual sandbox restart.

That appears to be a workspace-access contract. Is execution authority after a new sandbox/process generation established elsewhere, or is access-token continuity across instances an intentional workspace-level behavior? We are not treating the absence of a generation argument as a defect.
