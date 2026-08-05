## 9.5 流要求

每条流 **SHALL** 具有稳定流 ID。

每个已发布对象 **SHALL** 恰好属于一条写者流。符合规范的 Profile **SHALL** 保留该写者的局部发布顺序，并 **SHALL NOT** 要求多个写者共同编写一个可变对象。

独立流 **MAY** 异步推进，**SHALL NOT** 被要求同步前进。当 Profile 未定义依赖时，一条流暂时没有新对象 **SHALL NOT** 阻止无关流继续推进。

序号 **SHALL** 为正整数，并 **SHALL** 在流内唯一。

Reader **SHALL** 把重复序号报告为流完整性错误，并 **SHALL** 保留全部冲突候选用于检查。

Reader **SHALL** 报告序号缺口，**SHALL NOT** 发明缺失对象、推断其内容或用时间戳替代缺失序号位置。

墙上时钟时间戳 **SHALL NOT** 成为唯一权威排序机制。

除非适用 Profile 定义跨流因果、生命周期或依赖关系，否则 Reader **SHALL NOT** 推断不同流对象之间的权威顺序。没有此类关系的对象 **SHALL** 在治理图中保持并发或不可比较。

## 9.6 生命周期要求

每个生命周期 Profile **SHALL** 定义状态、初始状态、终态、动作、合法迁移、授权角色、前置条件与必需证据。

每个生命周期 Profile **SHALL** 具有稳定 ID、版本与字节 Digest。Reader **SHALL** 按第 6.2 节定义的顺序验证迁移，按第 6.3 节重建状态，并只应用判断为 `valid` 的迁移。无法重建唯一当前状态时，候选迁移 **SHALL** 为 `undetermined`，且 **SHALL NOT** 改变权威状态。

非法或未经授权的迁移 **SHALL NOT** 改变权威生命周期状态。

尝试迁移 **SHALL** 通过拒绝、ISSUE、告警或 Profile 规定的等价记录保持可观察；只有部署声明的威胁模型确实无法捕获该尝试时才可例外。

终态或归档操作 **SHALL** 保留重建该状态如何到达所需的对象与迁移证据。

## 9.7 引用要求

每项引用 **SHALL** 标识关系类型和目标对象 ID。

Profile **SHALL** 定义哪些引用类型产生顺序依赖、哪些是非排序链接，以及哪些关系类别必须无环。

关系注册表 **SHALL** 具有稳定 ID、版本与字节 Digest，Reader 结果 **SHALL** 标识所用的精确修订。

缺失目标 **SHALL** 被报告。引用对象 **MAY** 保留在 partial 视图，但缺失依赖 **SHALL NOT** 被视为已满足。

Reader **SHALL** 隔离禁止环的受影响子图，不得静默删除边或任意选择顺序。未受影响的有效对象 **SHOULD** 继续可重建。

## 9.8 完整性要求

规范化与 Digest 算法 **SHALL** 由版本化完整性 Profile 声明。

完整性 Profile **SHALL** 定义 Digest 以及适用签名覆盖的精确字段或字节，并 **SHALL** 定义如何排除或规范化 `digest`、`signature_algorithm`、`key_id` 与 `signature`，避免自引用。

Profile 还 **SHALL** 定义字符编码、Unicode 规范化、换行、字段顺序、空白与转义、数字和时间戳表示、缺失与 `null` 的区别、文本正文处理、附件 Hash、扩展字段处理，以及绑定到规范形式的 Schema/Profile 版本。未知扩展字段 **SHALL** 被确定性地纳入覆盖表示或被拒绝；它们 **SHALL NOT** 在影响权威语义的同时被静默排除在完整性保护之外。

Reader **SHALL** 在接受对象为完整对象之前重算并验证 Digest。Digest 不匹配 **SHALL** 被报告；对象 **SHALL NOT** 进入完整权威对象集合，但来源 **SHALL** 保留为失败证据。

存在签名元数据时，`signature_algorithm`、`key_id` 与 `signature` **SHALL** 作为完整组提供。Reader **SHALL** 在声称认证完整性前验证签名、密钥状态与身份绑定。

TMPA Core 允许没有签名。无法验证的签名 **SHALL NOT** 被视为认证完整性的有效证据。

部署 **SHALL NOT** 把 Schema、Digest、签名、角色授权或生命周期合法性表述为对象事实声明真实的证明。语义保证需要 Core 之外声明的证据与验证 Profile。

部署 **SHALL NOT** 仅因对象带有同处存储的 Digest，就声称能够抵抗同时修改内容与未锚定完整性元数据的攻击者。此类声明要求认证完整性、外部锚定 Digest、可信存储或等价控制。

## 9.9 聚合与 Reader 重建要求

符合规范的来源聚合器 **SHALL** 保留来源身份与内容，在不使用枚举顺序作为治理顺序的情况下发现候选，并为 Reader 生成确定性规范候选集合。它 **SHALL NOT** 静默解决冲突、发明缺失对象，或把传输/文件系统到达顺序转换为权威流程顺序。

对于同一规范候选集合与固定规则 Profile，治理 Reader **SHALL**：

- 对每种输入排列产生相同的规范偏序图/视图与问题集合；
- 保留流内顺序、Profile 定义的跨流关系和不可比较对象之间的并发；
- 原样保留来源对象；
- 保留有效冲突对象，直至出现授权解决对象；
- 把 Schema 无效和 Digest 无效对象排除在权威对象集合之外，同时保留诊断证据；
- 报告重复 ID、序号缺口、重复序号、非法迁移、越权动作、缺失引用、禁止环与完整性失败；
- 为每项受治理结论输出 `valid`、`invalid` 或 `undetermined` 三者之一，并保留形成该判断的原因；
- 在适用时区分 authoritative、partial、disputed、quarantined 与 unauthenticated；
- 对一致性问题和序列化视图元素使用确定性排序。

固定规则 Profile **SHALL** 包含第 8.1 节列出的全部输入。Reader **SHALL** 输出第 8.2 节定义的 Envelope，使用其中定义的 Core 问题代码与 ID，并应用第 7.3 节的三值组合规则。规范输出排序 **SHALL** 遵循第 8.3 节。

确定性拓扑序列或显示 Tie-break **SHALL NOT** 被解释为治理决定、真实性优先级或新增跨流顺序。

Reader **SHALL NOT** 使用输入到达顺序、文件系统枚举顺序或墙上时钟顺序解决治理冲突。

若依赖对象为 `undetermined`，依赖该对象的结论 **SHALL** 保持 `undetermined`，直至授权解决对象满足适用 Profile。视图分类用于解释判断原因，**SHALL NOT** 替代或扩展三个语义值。

## 9.10 恢复要求

替代参与者 **SHALL** 能够从持久治理对象与适用 Profile 判断：

- 当前 authoritative 或显式 partial 生命周期状态；
- 责任角色；
- 未解决要求；
- 相关结果、复核、批准与拒绝；
- 完整性、权限、顺序、引用与验证问题。

恢复 **SHALL NOT** 要求访问前任参与者的隐藏思维链。

治理对象中未表示的执行上下文 **MAY** 不可获得；这种缺失 **SHALL** 被报告，不得被猜测。

## 9.11 治理闭环、声明与人工控制要求

面向工作的 Profile **SHALL** 定义报告、问题、拒绝、取消、后续工作、复核、接受、父子派生、人工批准与归档授权的关系语义。

生命周期状态与业务验收 **SHALL** 分别重建。终态、`done` 标签、物理归档或执行者完成声明 **SHALL NOT** 单独建立业务完成。缺少有效接受证据时，Reader **SHALL** 输出 `ACCEPTANCE_UNDETERMINED`。

治理裁决对象 **SHALL** 与生命周期待复核阶段保持正交。执行报告 **SHALL NOT** 充当自己的独立复核；治理 REVIEW **SHALL NOT** 取代必需回执。

每项完成、失败、恢复或验收 Claim **SHALL** 标识稳定 Claim ID、Predicate、Subject 与证据对象 ID 集合。缺失必需证据 **SHALL** 输出 `CLAIM_EVIDENCE_MISSING`，且相应结论 **SHALL** 为 `undetermined`。

每个已接收工作 **SHALL** 最终具有报告、问题、拒绝、取消或后续工作回执。Reader 在 Profile 要求闭环但未找到回执时 **SHALL** 输出 `RECIPROCITY_MISSING`，不得把沉默解释为成功。

子工作 **SHALL** 显式标识父工作。父工作有未结束、未处理阻塞或缺少回执的子工作时，父级完成或验收 **SHALL** 输出 `CHILD_WORK_OPEN` 并保持 `undetermined`。

需要人工批准的风险对象 **SHALL** 保持 `undetermined` / `pending_human`，直至 Reader 验证由 Profile 授权角色发布的人工批准对象。Agent 自签批准、缺失批准或越权批准 **SHALL NOT** 满足该要求，并 **SHALL** 输出 `HUMAN_APPROVAL_REQUIRED` 或适用权限问题。

Profile **SHALL** 发布失败类型与恢复动作注册表。失败与恢复对象 **SHALL** 引用受影响工作；恢复对象还 **SHALL** 引用触发失败。失败 **SHALL NOT** 被成功回执覆盖或隐藏。

当前状态观测与迁移历史冲突时，Reader **SHALL** 输出 `STATE_EVIDENCE_CONFLICT`，保留两种来源，并阻止冲突状态成为唯一 authoritative 结论。

巡检与治理告警 **MAY** 产生发现和建议方案，但它们 **SHALL NOT** 在没有独立执行证据时被解释为已实施修复、生命周期迁移或业务裁决。

---

# 10. 一致性与可测试性

第 9、10 节保留历史综合 TMPA Draft V1.0 使用的条款 ID，使一致性报告与 Fixture 可以在 Architecture Paper、Core Specification 与 Implementation Case Report 之间引用相同的规范基础。该历史来源不具有当前编辑权威；本 GitHub Core Specification 是这些条款的唯一现行规范性来源。

## 10.1 一致性层级

TMPA 定义三个一致性层级：

1. **TMPA Core Conformance：** 实现持久文本消息与状态对象、主载体规则、单写者流、异步多流推进、确定性聚合与治理重建、类型规则、角色、生命周期、完整性验证和恢复要求；
2. **FCoP Profile Conformance：** 通过有文档记录的投影满足 TMPA Core 与已发布 FCoP 协议的命名、生命周期、原子迁移、路由及证据规则。某个 FCoP 参考实现 Package 的测试通过只构成实现证据；它既不是“安装协议”，也不足以单独建立本层级一致性；
3. **Authenticated Governance Conformance：** 满足 TMPA Core，并通过可信签名、密钥与授权 Profile 验证创建者身份。

任何层级都不认证参与者事实声明的语义真实性。Authenticated Governance Conformance 可以建立哪个已验证主体发布了授权对象，但声明正确性仍取决于适用证据、复核、工具证明或领域验证 Profile。

一致性声明必须绑定到特定实现版本、Profile 版本、Fixture 语料库与结果集合。产品身份、仓库所有权、Package 发布或 Demo 可访问性本身都不建立一致性。

## 10.2 C01–C14 必需测试

TMPA Core 一致性套件 **SHALL** 包含 C01–C14。每项结果 **SHALL** 标识其规范基础并保留复现裁决所需的实际输出。

| ID | 测试 | 规范基础 | 通过标准 |
|---|---|---|---|
| C01 | Schema 验证 | 4.1、9.2、9.3、9.11 | 缺少必填字段、Core 类型或版本错误、字段被禁止、迁移元组格式错误、签名组不完整、Claim 缺字段、风险枚举错误或声明 `date-time` 无效的对象被排除在权威集合之外，并确定性地产生 `SCHEMA_INVALID` |
| C02 | 主载体、工作派生与单写者不可变性 | 9.2、9.11 | 一个稳定任务载体保持可识别；父子工作关系可回读且不被 Thread 替代；其他写者不能替换或共同编辑已发布对象；更正/取代通过新对象表达 |
| C03 | 重复对象 ID | 9.2、9.9 | 相同 ID、不同规范内容的两个候选都被保留，不选择任何一个作为权威节点，并产生确定性严重冲突 |
| C04 | 串行流连续性与异步推进 | 9.5、9.9 | 每个写者保持局部序号；重复与缺口被报告；无关流可独立推进；不发明缺失对象；同一集合的到达顺序不改变结果 |
| C05 | 角色权限 | 6.2、9.4、9.9 | 超出已验证角色 Scope 的动作产生 `AUTHORITY_DENIED` 与 `invalid`；Assignment 证据缺失或有歧义产生 `AUTHORITY_UNDETERMINED` 与 `undetermined`；两者都不被应用 |
| C06 | 生命周期合法性、状态证据与业务验收分离 | 6.2–6.4、9.6、9.9、9.11 | 未定义迁移产生 `ILLEGAL_TRANSITION`；当前状态或前置证据不足产生 `LIFECYCLE_UNDETERMINED`；与重建状态冲突的观测产生 `STATE_EVIDENCE_CONFLICT`；完成状态缺少独立接受证据产生 `ACCEPTANCE_UNDETERMINED`；均不得虚构业务完成 |
| C07 | 职责分离与人工控制 | 9.3、9.4、9.11 | 同一身份不能执行并独立复核同一结果；需要人工批准的风险对象在有效批准前产生 `HUMAN_APPROVAL_REQUIRED` 与 `pending_human`；例外及批准权限保留在证据中 |
| C08 | 完整性篡改 | 9.8、9.9 | 修改被覆盖内容但保留原完整性元数据会导致 Digest 验证失败；对象保留为失败证据但排除在完整权威集合之外 |
| C09 | 缺失引用与声明证据 | 9.7、9.9、9.11 | 未解决必需目标产生 `MISSING_REFERENCE`；完成 Claim 的证据缺失产生 `CLAIM_EVIDENCE_MISSING`；依赖或声明不被视为已满足 |
| C10 | 禁止环 | 9.7、9.9 | 受影响的禁止环子图被隔离并报告，未受影响有效对象继续可重建 |
| C11 | 聚合与重建确定性 | 8、9.9 | 同一来源集合与完整固定输入 Bundle 的所有测试枚举、延迟交付排列和聚合顺序，都产生字节等价的规范结果 Envelope、治理图与问题集合；无关跨流对象保持不可比较 |
| C12 | 冲突保留 | 9.9 | 矛盾的有效复核保持可见且 disputed，直至出现新的授权解决对象 |
| C13 | 恢复与父子闭环 | 9.10、9.11 | 全新 Reader 从持久治理证据重建责任、生命周期、未解决依赖、失败/恢复及父子关系；父工作有开放子工作时产生 `CHILD_WORK_OPEN`，无需隐藏 Runtime 上下文 |
| C14 | 验收后的终态历史保留 | 9.2、9.6、9.11 | 只有获得所需验收与归档授权后进入终态/归档，并保留重建任务、报告、复核、接受与迁移历史所需的全部对象 |

测试是行为测试。实现 **MAY** 使用不同存储、索引或执行机制，但可观察一致性结果 **MUST** 满足相同标准。
