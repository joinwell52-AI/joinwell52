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

# 4. 规范对象、编码与重建

## 4.1 规范对象 Schema

以下 JSON Schema 定义 TMPA Core S0.4 规范治理对象。它约束单个治理对象的结构。ID 唯一性、流连续性、角色授权、生命周期合法性、引用解析和确定性重建等跨对象属性，由适用 Profile 与 Reader 评估，不能由单对象 Schema 单独建立。

实现只能在 `extensions` 下增加 Profile 特定字段，并且 **MUST** 保留所有 Core 字段的既定含义。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:tmpa:schema:governance-object:s0.4",
  "title": "TMPA Governance Object S0.4",
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
    "tmpa_version": { "const": "S0.4" },
    "id": { "type": "string", "minLength": 1 },
    "type": { "type": "string", "minLength": 1 },
    "governed_work": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "primary_carrier_id"],
      "properties": {
        "id": { "type": "string", "minLength": 1 },
        "primary_carrier_id": { "type": "string", "minLength": 1 }
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
| `stream` | 在不使用时间戳的情况下建立可归属局部顺序 |
| `creator` 与 `role` | 针对有效 Assignment 求值权限声明；字段本身不创建权限 |
| `lifecycle` | 标识 Profile 与声明状态；存在 `transition` 时提供显式 `from/action/to` 证据 |
| `references` | 根据关系注册表构建类型化顺序或非顺序链接 |
| `content` | 以声明 Media Type 承载受治理 Payload |
| `integrity` | 标识被覆盖字节的规范化与验证程序 |
| `extensions` | 包含全部 Profile 特定扩展；未知扩展只能依据声明 Profile 处理 |

主载体对象把自己的 `id` 用作 `governed_work.primary_carrier_id`。同一工作项的其他对象重复该载体 ID。生命周期迁移文档类型 **SHALL** 要求 `lifecycle.transition`；非迁移类型 **MAY** 省略它。该条件由类型注册表而不是通用单对象 Schema 强制。

C01 使用的 Schema Processor **SHALL** 为 `created_at` 执行 JSON Schema Draft 2020-12 `format` 断言；仅把 `date-time` 当作注释不足以通过 C01。下方链接的 S0.4 机器可读工件是规范 Schema 字节序列；上方嵌入展示 **SHALL** 与其保持语义一致。

| S0.4 机器可读工件 | SHA-256 |
|---|---|
| [治理对象 Schema](/spec/tmpa/s0.4/governance-object.schema.json) | `738ef14d6425ddde211ca5a353533b1590a08dd5e783c2b7839ea607f3f3cc9e` |
| [生命周期 Profile Schema](/spec/tmpa/s0.4/lifecycle-profile.schema.json) | `e6250933d6e923b6a8858abefadd546d5ecc99a781c6579eba1d1bcd77276990` |
| [Reader 结果 Schema](/spec/tmpa/s0.4/reader-result.schema.json) | `05f6e3e1eec4974240690a261710fabbb8ed22beecd8e504f7d6702c1e1dc9b3` |
| [一致性结果 Schema](/spec/tmpa/s0.4/conformance-result.schema.json) | `33073847c48edc49567db2c2b83a2817c29740db1a99dfe665e22aa3338ef529` |

`lifecycle.state` 记录此不可变对象发布时声明的状态，不是可变当前状态字段。当前权威生命周期状态 **MUST** 从有效对象集合、已接受迁移证据与适用生命周期 Profile 重建。

规范化 Profile **MUST** 定义 Digest 覆盖的精确表示；使用签名时，还 **MUST** 定义签名覆盖的精确表示与自引用完整性字段的排除或规范化方法。TMPA Core S0.4 要求显式声明该 Profile，但不强制唯一的字节级规范化算法。

Schema 有效只是进入权威治理视图的必要条件而非充分条件。Reader 仍 **MUST** 检查 ID 唯一性、类型规则、流顺序、权限、生命周期、引用、Digest 与适用的签名策略。
