## 3.6 读端聚合与治理重建

TMPA 的读取面包含两个概念上独立的阶段：**来源聚合**与**治理重建**。

令 `O_τ` 为观测时刻 `τ` 可见的有限来源候选集合。保留来源的聚合器 `A` 发现来源工件，保留来源身份与字节，解析候选封装，索引 ID 与引用，并执行 Reader 所需的确定性规范化：

`C_τ = A(O_τ)`

聚合器 **MUST NOT** 判断哪项声明为真，**MUST NOT** 静默修复冲突，**MUST NOT** 发明缺失证据，也 **MUST NOT** 把到达顺序转换为治理顺序。它的职责是构造治理 Reader 可用的完整规范候选集合 `C_τ`，同时保留每项来源候选的 Provenance。

令 `P` 为固定规则 Profile，其中包含 Schema、类型规则、角色分配、生命周期规则、关系语义、规范化规则、冲突策略与输出规范化规则。治理 Reader 计算：

`R_P(C_τ) = (G_τ, I_τ)`

其中 `G_τ` 是规范重建的偏序流程与治理图，`I_τ` 是规范问题集合。`G_τ` 表达工作进度、责任、生命周期、复核、批准、拒绝、恢复与审计关系，同时保留局部流顺序、显式跨流依赖和不可比较对象之间的并发；它不是权威总时间线。

后文可用 `R_P(O)` 简写组合 Pipeline `R_P(A(O))`。核心确定性要求是排列不变性。对于同一规范候选集合的任意排列 `π`：

`R_P(A(π(O))) = R_P(A(O))`

等式适用于 `G` 与 `I` 的规范序列化，不适用于偶然的内存顺序或诊断格式。延迟到达会改变当前可用集合，因此可能合法地把 partial 视图改变为 authoritative 或 disputed；同一集合的不同枚举顺序 **MUST NOT** 改变结果。

**确定性命题。** 令 `O` 为有限来源多重集合，`P` 为固定 Profile。若：(1) 来源规范化是来源身份和被覆盖字节的纯函数；(2) 重复分类、验证、权限、生命周期检查和问题 ID 均由规范对象值与 `P` 决定；(3) 图边只从流内序号与 Profile 声明关系导出；(4) 图与问题序列化使用已发布的确定性排序及 Tie-break 规则，则 `R_P(A(O))` 对来源枚举顺序不变。

**证明概要。** 任意枚举均被聚合为同一规范索引候选多重集合；逐对象验证与顺序无关；重复 ID、流缺口、缺失引用、禁止环、权限冲突和生命周期冲突均在同一集合与关系上计算。因此，每次排列得到相同的接受节点集合与有向边集合。规范问题 ID、确定性排序和只用于表示不可比较节点的稳定 Tie-break 产生字节等价的 `G` 与 `I`。该命题只证明固定 Profile 下的排列不变性，不证明语义真实性、Profile 正确性、对受损信任根的抵抗或不同证据集合之间的相等。更强保证仍需机械化证明与可执行语料库。

重建主题或子图的视图分类为：

- **authoritative：** 必需证据有效，且没有影响结论的未解决完整性、权限、生命周期、顺序或必需引用问题；
- **partial：** 必需证据缺失，或流/依赖不完整；
- **disputed：** 多项有效但互不兼容的治理声明尚未解决；
- **quarantined：** Profile 定义的完整性、身份、重复 ID 或禁止环条件，使受影响证据不能进入权威重建。

认证是正交的保证标签。对象或视图可以在 TMPA Core 下结构性 authoritative，但在更强身份 Profile 下仍未认证；此时 **MUST NOT** 将其表述为具有认证完整性。

TMPA 要求**保留冲突**：有效但矛盾的对象必须保持可见，直至出现新的授权解决对象。TMPA 也要求**扩展时保留证据**：增加候选证据不得擦除既有来源证据。治理状态不保证对任意集合扩展单调，因为新增有效证据可能把 authoritative 合法地改变为 partial、disputed 或 quarantined。

确定性拓扑序列 **MAY** 用于交换或显示，但不得增加不可比较节点之间的治理顺序。C11 验证聚合与重建确定性；C03、C04、C09、C10、C12 分别验证 ID、顺序、依赖、环与冲突保留行为。

## 3.7 完整性与签名证据

TMPA 区分三个经常被混淆的属性：

1. **归属（Attribution）：** 对象声明创建者与责任角色；
2. **完整性（Integrity）：** 能够检测对象发布后的修改；
3. **认证完整性（Authenticated integrity）：** 对象通过密码学方式绑定到已验证身份或密钥。

TMPA Core 要求归属与完整性证据。只有应用可信身份、签名与密钥管理 Profile 时，部署 **MAY** 声称认证完整性。

完整性记录标识：规范化 Profile、Hash 算法、内容 Digest、Profile 要求的前驱或引用 Digest，以及可选的签名算法、密钥 ID 与签名值。

角色标签不是密码学签名。没有可信身份绑定的 Digest 可以检测修改，却不能证明对象由谁创建。有效签名在部署信任模型内证明来源与完整性，但不证明签名内容在语义上真实。

## 3.8 从 FCoP 工程实践抽象的治理闭环

S0.6 从 FCoP 协议规范、Rules、Schema 与 ADR，以及 `fcop` / `fcop-mcp` 参考实现的有界观察中提炼供应商中立的 Core 约束。FCoP 是协议与参考 Profile，不是应用程序，也不是 TMPA 的定义者；Python Package 只是参考实现。因此本节吸收的是可移植语义，而不是 `_lifecycle/`、文件名或 MCP 工具名。

这种历史提炼属于工程反馈进入规范设计，不表示当前权威关系倒置。规范发布后，TMPA 理论与本 Core 约束 CodeFlowMu 的预期工程落实；观测到的产品行为可以支持、质疑或推动后续修订，但不能静默重定义当前要求。

### 3.8.1 当前状态、迁移历史与业务完成

Profile **MUST** 分别定义当前状态观测与迁移历史证据。FCoP 以路径表达当前阶段、以只增 `transitions` 表达历史；数据库 Profile 可以使用当前状态行与 Event 表。Reader 遇到两者冲突时 **MUST** 保留两份来源并输出 `STATE_EVIDENCE_CONFLICT` 或 Profile 声明的等价规范问题，不得用“最新时间戳”覆盖冲突。

生命周期进入 `done`、终态或归档 **MUST NOT** 自动建立业务验收。执行者的报告是可归属的交付声明；只有有权且满足职责分离的复核/接受对象才能建立业务完成。缺少接受对象时，完成结论为 `undetermined`，视图为 `partial` 或 `pending_human`。

### 3.8.2 回执、声明与证据门控

面向工作的 Profile **MUST** 定义任务与响应的互惠关系。每个被接收的工作对象最终 **SHALL** 关联报告、问题、拒绝、取消或后续工作对象之一；静默不能被 Reader 推断为成功。

完成、失败、恢复与验收声明 **MAY** 由 `claims` 表示。每个声明必须具有稳定 Claim ID、Predicate、Subject 与证据对象 ID 集合。完成声明缺少 Profile 要求的测试、产物、Commit、报告或其他证据时，Reader **SHALL** 输出 `CLAIM_EVIDENCE_MISSING`，并保持 `undetermined`。这条规则治理未经证实的声明，不声称消除模型幻觉。

### 3.8.3 父子工作与闭环汇总

子工作 **SHALL** 通过 `governed_work.parent_id` 或 Profile 声明的等价关系指向父工作；共享 Thread 可以通过 `thread_id` 表示，但 Thread **MUST NOT** 取代父子范围关系。父工作存在未结束、被阻塞但未处理或缺少回执的子工作时，父级完成声明 **SHALL** 产生 `CHILD_WORK_OPEN` 并保持 `undetermined`。

修正范围 **MUST** 通过新对象、取代关系或新派生关系表达，不得原地重写已发布父对象。Reader **SHALL** 保留父工作、全部子工作、各自回执及汇总结论。

### 3.8.4 治理裁决、风险与人工审批

生命周期中的待复核阶段与治理裁决对象是正交机制。Profile **MUST** 为两者分配不同类型或关系语义；实现 **MUST NOT** 仅因工作进入 `review` 阶段就推断存在独立复核，也不得用治理 REVIEW 取代执行报告。

Profile **MAY** 采用 `low`、`medium`、`high`、`irreversible` 风险等级。若对象声明需要人工审批，或其风险等级落入 Profile 的人工审批集合，则在有效人工批准对象存在之前，Reader **SHALL** 输出 `HUMAN_APPROVAL_REQUIRED`，判断为 `undetermined`，视图为 `pending_human`。Agent 自行改写批准结论无效。

### 3.8.5 失败、恢复、巡检与漂移

Profile **MUST** 发布有限失败类型与恢复动作注册表，并说明重试、继续、回滚、中止和升级如何形成新对象。失败 **MUST NOT** 通过成功报告隐藏；恢复动作 **MUST** 引用触发它的失败与被恢复工作。

协议巡检与治理告警是观察输出，不是自动修复。INSPECTION、ALERT 或等价对象 **MAY** 报告阻塞、规范或整洁级别的发现，但建议命令 **MUST NOT** 被 Reader 当作已经执行的迁移。独立治理信号与执行者自述 **MUST** 分开分类。

# 4. 规范对象、编码与重建

## 4.1 规范对象 Schema

以下 JSON Schema 定义 TMPA Core S0.6 规范治理对象。它约束单个治理对象的结构。ID 唯一性、流连续性、角色授权、生命周期合法性、引用解析和确定性重建等跨对象属性，由适用 Profile 与 Reader 评估，不能由单对象 Schema 单独建立。

实现只能在 `extensions` 下增加 Profile 特定字段，并且 **MUST** 保留所有 Core 字段的既定含义。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:tmpa:schema:governance-object:s0.6",
  "title": "TMPA Governance Object S0.6",
  "$comment": "Structural validation does not establish role authority, lifecycle legality, cross-object uniqueness, or integrity verification.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "tmpa_version",
    "id",
    "type",
    "governed_work",
    "stream",
    "creator",
    "role",
    "created_at",
    "lifecycle",
    "references",
    "content",
    "integrity"
  ],
  "properties": {
    "tmpa_version": { "const": "S0.6" },
    "id": { "type": "string", "minLength": 1 },
    "type": { "type": "string", "minLength": 1 },
    "governed_work": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "primary_carrier_id"],
      "properties": {
        "id": { "type": "string", "minLength": 1 },
        "primary_carrier_id": { "type": "string", "minLength": 1 },
        "parent_id": { "type": "string", "minLength": 1 },
        "thread_id": { "type": "string", "minLength": 1 }
      }
    },
    "stream": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "sequence"],
      "properties": {
        "id": { "type": "string", "minLength": 1 },
        "sequence": { "type": "integer", "minimum": 1 }
      }
    },
    "creator": { "type": "string", "minLength": 1 },
    "role": { "type": "string", "minLength": 1 },
    "created_at": { "type": "string", "format": "date-time" },
    "lifecycle": {
      "type": "object",
      "additionalProperties": false,
      "required": ["profile", "state"],
      "properties": {
        "profile": { "type": "string", "minLength": 1 },
        "state": { "type": "string", "minLength": 1 },
        "transition": {
          "type": "object",
          "additionalProperties": false,
          "required": ["from", "action", "to"],
          "properties": {
            "from": { "type": "string", "minLength": 1 },
            "action": { "type": "string", "minLength": 1 },
            "to": { "type": "string", "minLength": 1 }
          }
        }
      }
    },
    "references": {
      "type": "array",
      "uniqueItems": true,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["relation", "target"],
        "properties": {
          "relation": { "type": "string", "minLength": 1 },
          "target": { "type": "string", "minLength": 1 }
        }
      }
    },
    "claims": {
      "type": "array",
      "uniqueItems": true,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["id", "predicate", "subject", "evidence"],
        "properties": {
          "id": { "type": "string", "minLength": 1 },
          "predicate": { "type": "string", "minLength": 1 },
          "subject": { "type": "string", "minLength": 1 },
          "evidence": { "type": "array", "uniqueItems": true, "items": { "type": "string", "minLength": 1 } }
        }
      }
    },
    "risk": {
      "type": "object",
      "additionalProperties": false,
      "required": ["level", "requires_human_approval"],
      "properties": {
        "level": { "enum": ["low", "medium", "high", "irreversible"] },
        "requires_human_approval": { "type": "boolean" }
      }
    },
    "content": {
      "type": "object",
      "required": ["media_type", "body"],
      "properties": {
        "media_type": { "type": "string", "minLength": 1 },
        "body": {}
      },
      "additionalProperties": false
    },
    "integrity": {
      "type": "object",
      "additionalProperties": false,
      "required": ["canonicalization", "hash_algorithm", "digest"],
      "dependentRequired": {
        "signature_algorithm": ["key_id", "signature"],
        "key_id": ["signature_algorithm", "signature"],
        "signature": ["signature_algorithm", "key_id"]
      },
      "properties": {
        "canonicalization": { "type": "string", "minLength": 1 },
        "hash_algorithm": { "type": "string", "minLength": 1 },
        "digest": { "type": "string", "minLength": 1 },
        "signature_algorithm": { "type": ["string", "null"] },
        "key_id": { "type": ["string", "null"] },
        "signature": { "type": ["string", "null"] }
      },
      "oneOf": [
        {
          "properties": {
            "signature_algorithm": { "type": "null" },
            "key_id": { "type": "null" },
            "signature": { "type": "null" }
          }
        },
        {
          "required": ["signature_algorithm", "key_id", "signature"],
          "properties": {
            "signature_algorithm": { "type": "string", "minLength": 1 },
            "key_id": { "type": "string", "minLength": 1 },
            "signature": { "type": "string", "minLength": 1 }
          }
        }
      ]
    },
    "extensions": {
      "type": "object",
      "additionalProperties": true
    }
  }
}
```

各字段具有以下运行含义：

| 字段 | Reader 义务 |
|---|---|
| `tmpa_version` | 选择兼容的 Core 对象 Schema 版本线；不得静默降级未知主版本 |
| `id` | 索引规范身份并检测同 ID 不同内容冲突 |
| `type` | 解析一个带版本的类型注册项 |
| `governed_work.id` | 对治理同一工作项的对象分组 |
| `governed_work.primary_carrier_id` | 标识后续证据必须解析到的唯一稳定主载体 |
| `governed_work.parent_id` / `thread_id` | 保留工作派生与会话无关的协作 Thread；Thread 不取代父子关系 |
| `stream` | 在不使用时间戳的情况下建立可归属局部顺序 |
| `creator` 与 `role` | 针对有效 Assignment 求值权限声明；字段本身不创建权限 |
| `lifecycle` | 标识 Profile 与声明状态；存在 `transition` 时提供显式 `from/action/to` 证据 |
| `references` | 根据关系注册表构建类型化顺序或非顺序链接 |
| `claims` | 表示可审查声明及其证据对象集合；字段存在不代表声明已经成立 |
| `risk` | 表示 Profile 规定的风险等级和人工审批要求；不自行构成批准 |
| `content` | 以声明 Media Type 承载受治理 Payload |
| `integrity` | 标识被覆盖字节的规范化与验证程序 |
| `extensions` | 包含全部 Profile 特定扩展；未知扩展只能依据声明 Profile 处理 |

主载体对象把自己的 `id` 用作 `governed_work.primary_carrier_id`。同一工作项的其他对象重复该载体 ID。生命周期迁移文档类型 **SHALL** 要求 `lifecycle.transition`；非迁移类型 **MAY** 省略它。该条件由类型注册表而不是通用单对象 Schema 强制。

C01 使用的 Schema Processor **SHALL** 为 `created_at` 执行 JSON Schema Draft 2020-12 `format` 断言；仅把 `date-time` 当作注释不足以通过 C01。下方链接的 S0.6 机器可读工件是规范 Schema 字节序列；上方嵌入展示 **SHALL** 与其保持语义一致。

| S0.6 机器可读工件 | SHA-256 |
|---|---|
| [治理对象 Schema](/spec/tmpa/s0.6/governance-object.schema.json) | `623fd1d639defa441353993a3f5c1b228889d8977f5ac199d05c23f4683d036b` |
| [生命周期 Profile Schema](/spec/tmpa/s0.6/lifecycle-profile.schema.json) | `df925fc3c515f680e2f699ef5e82aba00c299ba63675d520effb0c006e6ce9d8` |
| [Reader 结果 Schema](/spec/tmpa/s0.6/reader-result.schema.json) | `f62aca5fb0a696bf92cd89bbf84e8c59d185d45af8f189504151c18509cc4f59` |
| [一致性结果 Schema](/spec/tmpa/s0.6/conformance-result.schema.json) | `11c21a8d4dc8ef1b9f9990123a6deb4870a39232574f9565d7d95ed78a808749` |

生命周期 Profile Schema 除状态、动作、迁移与恢复规则外，还强制要求显式 `acceptance`、`work_graph`、`risk_policy` 与 `failure_model` 区段。S0.6 进一步要求风险策略标识允许的批准对象类型，以及是否要求批准人相互独立。这些区段使 FCoP 派生的协作周期语义可以审查，同时不把 TMPA 绑定到 FCoP 参考实现或 CodeFlowMu。

`lifecycle.state` 记录此不可变对象发布时声明的状态，不是可变当前状态字段。当前权威生命周期状态 **MUST** 从有效对象集合、已接受迁移证据与适用生命周期 Profile 重建。

规范化 Profile **MUST** 定义 Digest 覆盖的精确表示；使用签名时，还 **MUST** 定义签名覆盖的精确表示与自引用完整性字段的排除或规范化方法。TMPA Core S0.6 要求显式声明该 Profile，但不强制唯一的字节级规范化算法。

Schema 有效只是进入权威治理视图的必要条件而非充分条件。Reader 仍 **MUST** 检查 ID 唯一性、类型规则、流顺序、权限、生命周期、引用、Digest 与适用的签名策略。
