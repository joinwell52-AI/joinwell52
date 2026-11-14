# AI 验收需要看见什么：七例受控对照

日期：2026-11-14。研究问题：另一位 AI 给出好评时，它是否看到了原委托、当前工件与业务事实？这是**人工编写的实验夹具**，不是生产订单，也不是 CodeFlowMu EVAL 的端到端运行。

## 来源与主张

- [browser-use #6398](https://github.com/browser-use/browser-use/pull/6398)：运行后加入同模型判断，记录判断用量和成本。该 PR 支持“事后判断是有用观察点”，不证明不同评估者的独立性。
- 本地 CodeFlowMu V3.0.152 源码提交 `0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f`：`source_evaluations.py` 的请求先落盘，丢失回执返回 `unknown`、不自动重试，观察带 `grants_authority=false`。这里是代码路径和定向测试结论，不是本组七例已经进入产品正式验收。
- 参考 [Anthropic 评估方法](https://www.anthropic.com/research/building-strong-safety-evaluations)：固定问题与标签、校准并交代范围；本轮样本太小，不做一般化模型排名。

## 可复跑材料

- [`probe_eval.py`](probe_eval.py)：七例的事先标签、规则与程序负对照。执行 `python probe_eval.py`，本轮退出码 0；输出误收分别为 `6`、`1`，规则误拒为 `0`；规则放行 `K7` 与 `M8`。
- [`eval-blind-prompt.txt`](eval-blind-prompt.txt)：交给两个模型的完全相同输入，不包含固定通过标签；提示明确列出须检查的错误类别，案例事实清楚，不能称为困难盲评。
- [`eval-rule-pass-prompt.txt`](eval-rule-pass-prompt.txt)：仅包含规则放行的两类，换成 `Q2/N5` 编号；测试规则加模型的分工。

提示交给非交互 Codex CLI，`--sandbox read-only --ephemeral --skip-git-repo-check`，要求不调用工具。2026-11-14 两次运行退出码均 0：`gpt-6.1-sol` 和 `gpt-6-astra` 均返回七项 JSON；第三次只对规则放行两例调用 `gpt-6.1-sol`，退出码 0。CLI 输出的 token 计数分别约 4,309、10,749、3,862（包含提示开销；不是可比较的产品价格）。`claude -p` 的尝试返回 `Not logged in`、输入 token 为 0，不计入结果。重复运行的模型输出可能变化。

| ID | 事先标签 | 规则 | gpt-6.1-sol | gpt-6-astra | 决定性事实 |
| --- | --- | --- | --- | --- | --- |
| K7 | 接受 | 接受 | 接受 | 接受 | 一笔订单，两项匹配，版本及授权正确 |
| P2 | 拒绝 | 拒绝 | 拒绝 | 拒绝 | 缺少 B-22 |
| R4 | 拒绝 | 拒绝 | 拒绝 | 拒绝 | 证据指向版本 1，工件为版本 2 |
| T9 | 拒绝 | 拒绝 | 拒绝 | 拒绝 | 发布时无授权 |
| L3 | 拒绝 | 拒绝 | 拒绝 | 拒绝 | 两笔订单，要求一笔 |
| V6 | 拒绝 | 拒绝 | 拒绝 | 拒绝 | 零笔订单，要求一笔 |
| M8 | 拒绝 | **接受** | 拒绝 | 拒绝 | 实际 B-23，要求 B-22 |

规则筛选后，模型接受 Q2（等价 K7）、拒绝 N5（等价 M8），并指出 B-23/B-22 的差别。规则是纯数量/版本/授权检查，故意不比对 SKU 文本；模型收到完整的要求与内容，因此这个结果支持“可见语义差异能被此轮模型识别”，不支持“模型能自行找到可信业务事实”。两种模型均来自 OpenAI，没有真实执行者模型参与，不能以型号不同证明评估独立。

## 产品边界与未通过项

定向测试 `tests/contracts/v3/test_source_eval_transport.py -q`：5 项通过；`test_source_eval_process_lifetime.py -q`：1 项通过，记录 `model_request: false`。两者只验证传输形状和进程生命周期。尝试运行 `test_source_evaluations.py -q` 时，在夹具初始化报 `TEST_ADMIN_TOKEN_REQUIRED`，**未执行到 EVAL 断言**；非管理员环境前置条件不满足，不记产品失败或通过。当前没有真实 CodeFlowMu EVAL 对这七例的产物，也没有发现相应产品缺陷。

结论只到此为止：在这七个简单案例里，规则挡住五种错误，模型在直接取得原要求和当前事实后识别最后的 SKU 不符。正式验收仍需要证明证据的来源、版本、访问资格和最终决策权；下一轮应接入真实 TASK/REPORT、当前工件、外部结果读回和人工复核。
