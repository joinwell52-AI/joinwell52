## 5.3 纳入考虑的威胁

符合规范的实现 **SHOULD** 考虑：身份冒充、未授权角色声明、对象篡改、有效对象重放、非法生命周期迁移、必需证据遗漏、首次发布时伪造结构正确但事实错误的证据、通过冲突对象进行双重陈述、受损工具或 Connector、导致越权动作的 Prompt Injection、证据删除或隐匿、时钟偏差与时间戳操纵、由错误/过期/对抗性审计结论触发的自动修复、扩大而非收敛权限的传递委托、能力组合形成越权结果、过期或撤销不足的委托证据、合法单步组合成非法路径，以及由同一模型、控制器、凭证、Host 或管理主体控制的名义独立复核者。

## 5.4 恶意参与者与存储表面受损

TMPA Core 不假设所有参与者诚实。实现 **MUST** 保留归属、冲突对象、被拒迁移与验证问题，使不当行为可以被发现或调查。

### 首次发布时结构正确但事实错误的证据

TMPA 区分**首次发布时的伪造**与发布后的篡改。恶意、受损或错误的参与者可能发布 Schema 有效、Digest 一致、生命周期合法、甚至签名正确的 `REPORT`、`REVIEW` 或 `DECISION`，但其中事实声明仍然错误。Core 验证可以建立结构有效性、连续性、声明权限与已发布字节完整性，不能由这些属性推导语义真实性。

事实保证需要与声明相适配的证据 Profile，例如工具回执、外部可验证输出、可复现执行、测试结果、独立数据源、在真正独立安全主体下的交叉复核或人工批准。执行者与复核者共享同一受损控制器、凭证、证据源或管理主体时，名义职责分离可能产生相关性伪造。TMPA 可以保留 Provenance、矛盾与后续更正，但不能检测隐蔽串谋，也不保证首次发布声明为真。

FCoP 把文件系统纳入协议边界，因此存在特定攻击面：有直接写权限的参与者可能把对象直接放入 `_lifecycle/done/`、修改已发布工件、删除证据、重放旧文件，或制造路径/事件不一致。文件存在本身 **MUST NOT** 被视为有效性证明。

Reader **SHOULD** 至少区分：

1. **未授权插入：** 工件出现在生命周期位置，但没有有效创建者、角色分配、前驱状态或迁移记录；
2. **发布后变更：** 内容与记录的 Digest 或签名不一致；
3. **状态证据分歧：** 生命周期路径、迁移历史、引用与预期配对工件互不一致。

这些攻击只能在部署保护或独立验证身份绑定、完整性记录、只增事件与存储历史的范围内被检测。如果攻击者能够同时改写工件及全部可信完整性、身份与审计记录，本地文件系统视图无法建立真实历史。更强部署 **MAY** 增加受限写权限、只增或版本化存储、远程公证、透明日志、复制或密码学签名；这些属于最低 FCoP 文件 Profile 之外的部署控制。

TMPA Core **MUST NOT** 被描述为提供拜占庭共识。若身份提供方、角色权限、密钥注册表、可信存储边界和验证器均受损，TMPA 无法保证真实历史。需要拜占庭容错的部署 **MUST** 增加外部共识、复制、公证或透明日志机制。

Inspect-only 审计 Profile 可以缩小一次失败的影响：受损 Inspector 可以生成误导性发现或建议，但审计功能不直接修改受治理业务状态。这不是完整防护；建议的 Provenance、复核、批准与执行证据仍然 **MUST** 保留。

## 5.5 角色与身份分离层级

TMPA 区分逻辑责任分离与安全域分离：

1. **Prompt 级角色分离：** 参与者使用不同角色指令，但可以共享 Runtime、凭证与存储权限；
2. **进程级身份分离：** 不同 Agent/进程实例具有稳定 Runtime 身份与独立可归属 Session；
3. **凭证级分离：** 使用可独立验证、限制和撤销的不同凭证、密钥或委托授权；
4. **Host 级隔离：** OS 账户、容器、Sandbox 或强制访问控制阻止参与者直接修改他人受保护证据；
5. **管理域分离：** 独立组织、信任根、审计服务或透明系统降低单一管理员改写全部记录的风险。

Prompt 级分离可以支持流程清晰，但不是安全边界。进程级身份改善归属，但不能阻止共享凭证或跨进程存储修改。声称独立复核、认证责任或防篡改的部署 **MUST** 采用与威胁模型相称的凭证、Host 或管理域控制。

最低 FCoP Profile 下的文件名、文件所有者、角色文档或 Frontmatter `sender` 都只是**声明性归属**。只有验证执行进程、凭证/密钥、有效角色分配与受保护写入边界之间的绑定后，它才成为已验证归属。由同一模型、服务账户或无限制 Host 控制的多个逻辑角色 **MUST NOT** 仅因 Prompt 或文件名不同就被描述为独立安全主体。

已验证委托链还 **MUST** 区分委托主体、委托任务/意图、授予能力集合、权限衰减规则、时间有效性、执行次数或撤销条件，以及每次下游再委托。既有 `TASK`、`REPORT` 或角色标签不会自动授权新动作，除非有效身份与授权 Profile 明确认可其为当前委托证据。

## 5.6 AI Agent 身份

AI Agent **MUST NOT** 被视为自认证法律身份。FCoP 仍要求 Agent 获得自己能够读取的显式运行身份：角色、团队上下文、责任边界与当前工作范围。运行身份背后的权限来自人类或组织主体、部署身份、角色分配权限、Runtime 凭证与策略范围。

身份记录 **SHOULD** 分开表示：组织主体、人类授权者、Agent 实例、模型或 Runtime 版本、有效角色、委托权限、凭证或密钥 ID。这样可以避免把 Agent 动作只归属于借用的人类账户或服务账户。

## 5.7 安全声明

实现 **MUST** 明确声明其支持的保证层级：

| 声明 | 最低要求 |
|---|---|
| 文本可追踪性 | 持久规范对象与引用 |
| 篡改检测 | 对保留或可信完整性元数据执行确定性 Digest 验证 |
| 认证完整性 | 已验证签名与可信密钥绑定 |
| 授权执行 | 已验证角色分配与动作策略 |
| 语义声明验证 | Core 之外的声明特定证据、可复现输出或独立领域验证 |
| 不可否认 | TMPA Core 之外的法律与密码学 Profile |
| 拜占庭韧性 | 外部共识或等价机制 |

实现 **MUST NOT** 声称超出实际部署控制的更强属性。

---

# 6. 生命周期与权限求值

## 6.1 必需注册表

实现 Profile 发布带版本的生命周期、角色与关系注册表。生命周期注册项包含：Profile ID 与版本、状态集合、初始与终止状态、动作集合、合法 `from/action/to` 元组、每项动作允许的角色、必需引用与前置条件、职责分离规则，以及任何授权重新打开或恢复规则。角色注册项包含：角色 ID、Assignment 对象类型、允许的文档类型和生命周期动作、Scope 维度、不兼容角色、分配权限方与撤销语义。关系注册项声明关系属于顺序、非顺序、必需或无环关系。

注册表字节是重建输入。因此，注册表版本与 Digest 属于 Reader 输入契约和一致性报告；修改注册表而保留原 ID 不会得到同一个固定 Profile。

## 6.2 迁移求值顺序

对于候选迁移 `x`、Profile `P`、规范候选集合 `C` 和当前重建状态 `s`，按以下固定顺序求值：

```text
EVALUATE_TRANSITION(x, s, C, P):
  1. 验证对象 Schema、类型规则、身份与完整性
  2. 解析受治理工作项、主载体与生命周期 Profile
  3. 从已接受前驱证据重建唯一当前状态
  4. 验证 x.from 等于该当前状态
  5. 验证 (x.from, x.action, x.to) 是合法迁移元组
  6. 解析有效角色 Assignment 并验证动作 Scope
  7. 求值职责分离规则与授权例外
  8. 解析必需引用、前置条件与证据
  9. 赋予 valid、invalid 或 undetermined，并生成规范问题
 10. 仅当迁移判断为 valid 时应用 x.to
```

已证明的违规——例如非法元组、已撤销权限、超出 Scope 的动作或禁止的角色组合——产生 `invalid`。证据缺失——例如 Assignment 不可用、前驱未解析、必需引用缺失或当前状态有歧义——产生 `undetermined`。只有 `valid` 迁移改变权威生命周期投影。

## 6.3 状态重建

对每个受治理工作项，Reader 在接受有效主载体后从生命周期 Profile 的初始状态开始，再按写者流序号和声明顺序依赖建立的偏序求值迁移对象。不得使用挂钟时间选择下一项迁移。

如果两个有效迁移候选消费同一来源状态，效果互不兼容，且不存在顺序关系或授权解决，则当前状态为 `undetermined`，视图为 `disputed`。Reader 保留两个分支，不选择最后到达者。终止状态保持终止，除非生命周期注册表显式定义授权恢复或重新打开迁移。

## 6.4 权限时间与撤销

Reader 针对适用于该动作的 Assignment 与撤销证据验证权限。`created_at` 本身不是可信授权时钟。进行时间敏感权限声明的 Profile 要定义用于判断 Assignment 是否有效的可信时间或序列证据。

证据证明权限无效，动作判断为 `invalid`；无法确定相关权限区间，动作判断为 `undetermined`。Profile 还声明撤销是前瞻性的，还是可以使已定义类别的早期动作无效；Reader 不得虚构追溯效力。

# 7. 三值治理逻辑

## 7.1 判断域

TMPA Core 的规范判断域为：

```text
J = { valid, invalid, undetermined }
```

`valid` 表示固定输入和适用规则证明要求成立；`invalid` 表示它们证明存在违规或拒绝；`undetermined` 表示证据缺失、冲突或尚未解决，因而无法得出二值结论。`undetermined` 不是 `invalid` 的委婉说法，也不是默认接受。

## 7.2 原子分类规则

Reader **SHALL** 按下表分类原子检查：

| 条件 | 判断 | 主要视图原因 |
|---|---|---|
| 要求已证明满足 | `valid` | `authoritative` |
| 规则已证明被违反 | `invalid` | `rejected` 或 `quarantined` |
| 必需证据缺失或无法读取 | `undetermined` | `partial` |
| 多个有效候选互相矛盾且无授权解决 | `undetermined` | `disputed` |
| 必需人工决定尚未发布 | `undetermined` | `pending_human` |
| 可选签名在 Core 下缺失 | Core 判断不变 | `unauthenticated` 保证标记 |
| 认证 Profile 要求的认证无法建立 | 按已发布 Profile 为 `undetermined` 或 `invalid` | `unauthenticated` 或 `quarantined` |

`unauthenticated` 是认证状态，而不是第四个治理判断值。要求认证完整性的 Profile 中，缺失认证证据产生 `undetermined`；已证明签名或身份无效产生 `invalid`。

## 7.3 组合规则

对于全部条件都必须满足的合取 `ALL(a,b)`，以及至少一个条件必须满足的析取 `ANY(a,b)`，Reader **SHALL** 使用下表：

| a | b | `ALL(a,b)` | `ANY(a,b)` |
|---|---|---|---|
| `valid` | `valid` | `valid` | `valid` |
| `valid` | `invalid` | `invalid` | `valid` |
| `valid` | `undetermined` | `undetermined` | `valid` |
| `invalid` | `valid` | `invalid` | `valid` |
| `invalid` | `invalid` | `invalid` | `invalid` |
| `invalid` | `undetermined` | `invalid` | `undetermined` |
| `undetermined` | `valid` | `undetermined` | `valid` |
| `undetermined` | `invalid` | `invalid` | `undetermined` |
| `undetermined` | `undetermined` | `undetermined` | `undetermined` |

必需依赖为 `invalid` 时，依赖的接受条件为 `invalid`；必需依赖为 `undetermined` 时，依赖结论 **SHALL** 保持 `undetermined`。互相矛盾的有效结论不会相互抵消，也不会变成 `invalid`；它们形成 `undetermined` 的争议结论。只有解决对象本身有效、已授权并显式引用所解决的冲突时，解决才改变结论。

Profile **MAY** 定义领域特定聚合，但必须发布真值表，且不得把缺失或冲突的强制证据直接映射为 `valid`。

## 7.4 判断与视图映射

判断是语义；视图状态解释运行原因。`valid` 映射为 `authoritative`。动作 `invalid` 映射为 `rejected`；证据或子图被排除时映射为 `quarantined`。`undetermined` 根据规范问题原因映射为 `disputed`、`partial` 或 `pending_human`。

一个主体有多个原因时，全部原因都保留在问题集合中。需要一个主视图标签时，按 `quarantined` → `rejected` → `disputed` → `partial` → `pending_human` → `authoritative` 选择。认证是独立保证状态，不形成第四个语义判断。

# 8. Reader 输入与输出契约

## 8.1 输入 Bundle

一次可复现 Reader 运行 **SHALL** 固定并记录以下输入：

- TMPA Core 对象 Schema 版本与 Digest；
- 一致性 Profile ID、版本与 Digest；
- 类型、生命周期、角色、关系、完整性和规范化注册表的版本与 Digest；
- 有限来源候选多重集合，其中每个候选具有稳定 `source_id`、媒体类型、精确字节与字节 Digest；
- 声明的信任根与认证策略；
- Reader 实现标识与版本；
- 规范输出格式版本；
- 任何实现扩展，以及扩展是否影响规范语义。

只有以上输入相等的两次运行才能用于 C11 比较。环境特定 Locator、发现时间戳、日志顺序、内存地址与本地化诊断不是规范输入。

## 8.2 规范结果

Reader **SHALL** 输出至少包含以下字段的规范结果 Envelope：

```json
{
  "core_version": "S0.5",
  "output_version": "1",
  "profile": {},
  "reader": { "id": "<id>", "version": "<version>" },
  "source_set_digest": "sha256:<hex>",
  "judgment": "valid | invalid | undetermined",
  "view_state": "authoritative | rejected | quarantined | partial | disputed | pending_human",
  "nodes": [],
  "edges": [],
  "issues": []
}
```

每个节点和边 **SHALL** 包含稳定 ID 与其来源对象 ID。每个问题 **SHALL** 包含稳定 `issue_id` 与 `source_id`；解析产生来源对象 ID 时还记录 `source_object_id`。节点 **SHOULD** 另记录规范 Digest、受治理工作项 ID、主载体 ID、类型、流位置、判断、视图状态与保留的来源 ID；边 **SHOULD** 记录关系与排序语义；问题 **SHALL** 记录代码和严重级别，并 **SHOULD** 记录受影响判断、规范规则与确定性参数。

Core 问题代码为：`SCHEMA_INVALID`、`UNKNOWN_TYPE`、`INTEGRITY_MISMATCH`、`SIGNATURE_UNVERIFIED`、`DUPLICATE_ID_CONFLICT`、`PRIMARY_CARRIER_CONFLICT`、`STREAM_DUPLICATE_SEQUENCE`、`STREAM_GAP`、`AUTHORITY_UNDETERMINED`、`AUTHORITY_DENIED`、`SOD_VIOLATION`、`LIFECYCLE_UNDETERMINED`、`ILLEGAL_TRANSITION`、`MISSING_REFERENCE`、`PROHIBITED_CYCLE`、`UNRESOLVED_CONFLICT`、`CLAIM_EVIDENCE_MISSING`、`ACCEPTANCE_UNDETERMINED`、`HUMAN_APPROVAL_REQUIRED`、`CHILD_WORK_OPEN`、`RECIPROCITY_MISSING` 与 `STATE_EVIDENCE_CONFLICT`。Profile **MAY** 增加命名空间化代码，但不得重定义 Core 代码。

## 8.3 规范化与排序

`source_set_digest` 按声明输出 Profile 从 `(source_id, byte_digest)` 对的确定性排序列表计算。节点按 `(id, source_object_id)` 排序；边按 `(source_id, relation, target_id, id)` 排序；问题按 `(severity, code, object_id, relation, target_id, issue_id)` 排序，其中严重级别顺序为 `critical`、`error`、`warning`、`info`。元组中不存在的字段按空字符串处理。

`issue_id` **SHALL** 由 `(code, object_id, relation, target_id, profile_digest)` 的规范编码确定性导出。人类可读消息、Stack Trace、本地路径与执行时间戳排除在规范等价性之外。主体与来源 ID 数组在 Profile 定义规范化后按 Unicode 码点排序。

对于相同固定输入，规范结果序列化必须字节稳定。非规范日志与用户界面排序可以变化，但不得改变用于 C11 的结果 Envelope。

## 8.4 失败与部分输出

即使某些候选格式错误或子图无效，Reader 仍返回规范结果与问题集合。只有固定 Profile、Schema、注册表 Bundle 或输出规范化契约无法加载或验证时，Reader 才可使整个调用失败。此类调用失败不同于 `invalid` 治理判断，并作为一致性运行错误报告。

# 9. TMPA Core 规范

## 9.1 规范语言

术语 **MUST**、**MUST NOT**、**SHALL**、**SHALL NOT**、**SHOULD**、**SHOULD NOT** 与 **MAY** 定义一致性要求。MUST、MUST NOT、SHALL、SHALL NOT 表示强制要求。

本章之外的说明性示例、实现观察与未来工作陈述不产生额外 Core 要求，除非命名一致性 Profile 明确把它们纳入规范。

## 9.2 对象要求

每个治理对象 **MUST**：

- 符合 TMPA Core Schema 与已发布的文档类型定义；
- 在其治理域内具有全局唯一 ID；
- 恰好具有一个声明创建者身份；
- 标识恰好一个责任角色；
- 标识一条写者流和一个正整数序号；
- 标识一个文档类型；
- 标识一个受治理工作项和恰好一个主载体 ID；
- 标识一个生命周期 Profile 与声明状态；
- 包含规范文本内容；
- 包含可为空的 `references` 数组；
- 包含完整性证据。

符合规范的 Validator **SHALL** 强制验证 `created_at` 声明的 `date-time` 格式；只把格式当作注释不足以通过 C01。

记录生命周期迁移的对象类型 **SHALL** 包含完整的 `from`、`action`、`to` 元组。非迁移类型 **SHALL NOT** 使用该元组产生隐式状态变化。

已发布对象 **SHALL** 不可变。更正、拒绝、取代、回滚或解决 **SHALL** 创建新的对象或迁移记录，并 **SHALL** 保留旧证据。

Schema 有效性 **SHALL NOT** 被解释为 ID 唯一、角色授权、生命周期合法、引用有效、Digest 正确或身份已认证的证明。

面向任务的 Profile **SHALL** 为每个受治理工作项定义一个稳定主载体 ID。后续接受、报告、复核、决策、更正与恢复对象 **SHALL** 引用该载体或 Profile 定义的后继关系，不得创建同一任务的歧义可变副本。

每个已发布治理对象 **SHALL** 只有一个写者。其他参与者 **SHALL** 通过新的可归属对象或迁移记录响应，并 **SHALL NOT** 修改其他写者已发布对象的内容。

## 9.3 类型注册要求

符合规范的实现 **SHALL** 发布文档类型注册表。每个类型定义 **SHALL** 指明允许创建者角色、必填字段、允许引用关系、适用生命周期 Profile 与验证规则。

注册表 **SHALL** 具有稳定 ID、版本与字节 Digest。Reader **SHALL** 把结果绑定到该精确注册表修订。每个类型定义还 **SHALL** 指明该类型是否要求生命周期迁移元组。

文档 **SHALL NOT** 同时充当自己的独立复核或批准，除非实现 Profile 允许一个已记录例外，而且例外标识批准权限。

## 9.4 角色要求

角色声明 **SHALL** 根据对相关对象与动作有效的权威角色分配进行验证。参与者 **SHALL NOT** 在有效角色范围之外执行受保护动作。

声称职责分离的部署 **SHALL** 定义并执行同一受治理结果上的不兼容角色组合。

角色分配、撤销、委托与职责分离例外 **SHOULD** 自身表示为治理对象。

角色与权限求值 **SHALL** 遵循第 6.2 节的顺序。已证明拒绝或超出 Scope 的动作 **SHALL** 为 `invalid`；分配证据缺失或有歧义 **SHALL** 为 `undetermined`。
