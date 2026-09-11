# 本地实验与可支持的结论

## A. 暂停后的工具结果：真实 SDK 回归与单函数消融

固定修复代码：`openai/openai-agents-python@3f9397f035a891ce3623723eb0c2181847006fc9`。对照函数来自 `83c737fd0b8d9a53bd39fa2a0856070417bb0bd3`。Python 3.12.10，SDK 元数据 0.22.2；具体依赖记录另存。运行 [probe-sdk.py](probe-sdk.py)，原始观测见 [sdk.json](runs/sdk.json) 与两份日志。

这不是运行整棵前一版本源码：固定同一 SDK 和同一套上游新测试，只在独立进程内把目标函数的代码对象换成上一版本实现，保留其余源码不变。该消融用来定位修复的因果作用，不声称验证两个完整发行版。

| 回归类别 | 用例数 | 固定修复 | 旧函数消融 |
| --- | ---: | ---: | ---: |
| 两种延续方式 × 内存/JSON 状态 × 流式/非流式 | 8 | 8 通过 | 8 缺失 call-missing |
| 两次分阶段批准 | 1 | 通过，结果各一次 | 缺失 call-missing |
| 无 pending tool run 的 tracker 中断状态 | 1 | 通过 | 错把 call_MISSING 归入已送达集合 |

模型响应和接收端为上游 ScriptedModel；Runner、工具分类、审批、序列化、恢复和输入准备是真实 SDK。没有调用真实 OpenAI 服务。普通八组均在最终文本已经为 done 之后，才被结果列表断言发现缺失。因此“任务显示完成”不足以替代配对交付证据。

网络故障下的恰好一次、真实模型消费、外部工具效果是否重复都未测试。上游所述几千个全量测试通过不计作我们的执行结果。

## B. 恢复旧模型：原函数、可观察连接替身

head `a13c8452e70f214b50ea37149c6f6485bc149f6f`；base `027acb4efa2e6b226d40df266b86367423946d62`。Node 24.16.0。完整源码哈希见 [code-manifest.json](sources/code-manifest.json)。[probe-orca.mjs](probe-orca.mjs) 删除 import、由 Node 去除 TypeScript 类型，执行其余原函数体；连接、错误类是显式替身。没有启动 Claude、没有云端推理，默认种子目录替身不参与所测路径。

| 输入/入口 | base setModel 次数 | head setModel 次数 | head 可观察结果 |
| --- | ---: | ---: | --- |
| 明确未列出的模型，普通修改 | 1 | 0 | 类型化拒绝，options 不保存该值 |
| 已退役模型，恢复 | 1 | 0 | model 加入 skipped，旧偏好清除 |
| 已列出的别名 | 1 | 1 | 正常写入 |
| 别名行携带的 resolved ID | 1 | 1 | 正常写入 |
| 查询抛错 | 1 | 1 | 兼容放行 |
| 空目录 | 1 | 1 | 兼容放行 |
| 只有 synthetic default 行 | 1 | 1 | 兼容放行 |
| 已列出模型，恢复 | 1 | 1 | 正常恢复 |

8 组输入 × 2 个版本，共 16 条观测，不能写成 16 种故障。实际结果见 [orca.json](runs/orca.json)。支持结论：原守卫可在已知未列出时阻止写入，保留别名和无证据兼容。不能证明账号 entitlement，也不能证明真实 provider 已采用、完成推理或持久化。

## C. 工作区访问凭证：真实 Ed25519 函数

固定 Superset 候选 head `4ec6c8e1636541709a09a6bf127d31d5ac5d541b`。直接执行原模块；本机临时生成两对密钥，真实签名与验签，时钟固定，不输出密钥或 token。见 [probe-superset.mjs](probe-superset.mjs) / [superset.json](runs/superset.json)。

| 情形 | 原验签函数 |
| --- | --- |
| 正确工作区、有效期内 | true |
| 其他工作区 | false |
| 过期前 1 毫秒 | true |
| 到期时刻 | false |
| 错误公钥、篡改 audience、空 token、畸形 token | 均 false |
| 同一 audience/公钥、60 秒后的再次调用 | true |

共 9 项。最后一项仅模拟“工作区身份与验证参数没变”的重复验签，不是真实重启。其意义是：当前函数没有 process generation 参数，不能独立证明新执行进程重新授权。工作区访问跨重启继续有效可能正是预期产品合同，不能据此报告越权漏洞。

## 执行环境限制与失败记录

Windows 解包最初因 CLAUDE.md 符号链接失败；最终只排除该指向指令文件的链接，原 AGENTS.md 已读取，SDK src/tests 完整保留。依赖安装发生跨盘 hardlink 回退，不改变测试断言。全部受测源码可由固定提交重新取得，原始失败日志保留。没有合并不同实验的计数生成“系统可靠率”。
