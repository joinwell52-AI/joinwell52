# 交流稿：GitHub，未发送

以下 @ 均为对应 PR 返回的作者 GitHub login，已在本轮读取核对。不是 X 账号；没有冒充与作者对话，也没有发送通知或评论。公开前可择其一使用，不将相同问题多平台重复投递。

## Agents SDK：给 @hyeonsang010716

位置：[openai/openai-agents-python #4947](https://github.com/openai/openai-agents-python/pull/4947)。依据：固定修复代码的十个上游新增回归，及只替换旧 helper 的十个失败对照。

**中文交流稿**

@hyeonsang010716 我们在固定提交 3f9397f 上重跑了这里新增的十个回归，全部通过；保持其他代码和测试不变，只把未发送调用 ID 的 helper 换回 83c737f 的实现，十个均因缺失结果或错误归属而失败。八组 Runner 用例中，最终 done 断言先通过，调用 ID 检查随后才发现遗漏，这个观察点很有启发。

我们将结论限定为“恢复后每份输出只进入一次 ScriptedModel 输入”，没有写成网络恰好一次保证。这里的预期合同是否也应明确以请求构造为边界，把确认丢失后的重试留给传输层单独验证？

**English draft**

@hyeonsang010716 We reran the ten added regressions on pinned 3f9397f: all passed. Keeping the remaining runtime and tests identical, replacing only the unsent-call helper with its 83c737f implementation made all ten fail on missing output or incorrect ownership. In the eight Runner cases, the final `done` assertion passed before the call-ID assertion exposed the omission.

We describe the result narrowly as once-per-output inclusion in the resumed ScriptedModel input, not network exactly-once delivery. Is request construction the intended guarantee here, with retry after an ambiguous acknowledgement treated as a separate transport-level contract?

## Orca：给 @brennanb2025

位置：[stablyai/orca #19946](https://github.com/stablyai/orca/pull/19946)。依据：原函数与连接替身的八组双版本对照；未重跑真实 Claude。

**中文交流稿**

@brennanb2025 我们执行了固定 base/head 的原设置与恢复函数，用记录调用的连接替身做了八组对照。明确未列出与退役恢复的 setModel 调用从 1 降为 0；别名、完整 resolved ID、查询失败、空目录与 default-only 的兼容分支均保留。我们没有将这些结果写成真实 Claude 推理验证。

有价值的地方是没有把“目录未知”包装成“明确不支持”。产品显示上，是否值得把“兼容允许尝试”与“当前目录明确列出”分别呈现，同时与现有的实际采用确认保持区分？

**English draft**

@brennanb2025 We ran eight base/head comparisons using the pinned original setting and restore functions with a recording connection double. Unlisted changes and retired restores went from one `setModel` call to zero; aliases, resolved IDs, failed queries, empty catalogs, and default-only compatibility remained usable. We did not rerun the real Claude binary.

Preserving “unknown” rather than relabeling it “unsupported” is a useful distinction. Would it be valuable to distinguish compatibility-admitted choices from provider-listed choices in the product, separately from the existing evidence of actual adoption?

## Superset：给 @saddlepaddle

位置：[superset-sh/superset #7408](https://github.com/superset-sh/superset/pull/7408)。依据：本地原 Ed25519 函数九项检查；没有真实云沙箱验证。

**中文交流稿**

@saddlepaddle 我们对 4ec6c8e 的原签发/验签函数进行了本地检查：跨 workspace、到期时刻、错误公钥与篡改 audience 都被拒绝；同一 workspace、公钥和有效期内的再次验证仍通过。后一项只是重复验签，不是实际重启实验。

这看起来是 workspace 访问权合同。新 sandbox/process generation 恢复后的执行授权是否有另一层校验，还是产品有意允许同一 workspace 的访问凭证跨实例延续？我们没有把缺少 generation 参数当成漏洞。

**English draft**

@saddlepaddle We checked the original signing/verifying functions at 4ec6c8e locally: wrong workspace, expiry, wrong public key, and a tampered audience were rejected. Reverification for the same workspace and key within the lifetime still passed; this was not an actual sandbox restart.

That appears to be a workspace-access contract. Is execution authority after a new sandbox/process generation established elsewhere, or is access-token continuity across instances an intentional workspace-level behavior? We are not treating the absence of a generation argument as a defect.
