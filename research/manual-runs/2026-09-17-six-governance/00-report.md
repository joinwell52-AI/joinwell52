# 六位 Agent 治理研究者：第一轮论文—代码—实验研究

日期：2026-09-17。本轮覆盖六位作者及六个固定仓库版本，采用“收集信息 → 分类处理 → 生产报告”。6/6 已完成来源、代码与讨论核查；其中五个方向运行了原代码的有界机制探针，MAST 方向完成公开数据的可重跑审计。没有运行付费模型、完整论文基准或真实业务工具。

最值得带入下一轮的问题是：**治理工具本身所读取的标签、动作、历史和权限，是否仍然具有我们以为的含义？** 本轮发现不是六个产品漏洞，也不是六条开发任务。

## 1. 六位作者分别研究了什么

| 作者、来源 | 为什么值得研究 | 本轮实证与处置 | 新问题 |
| --- | --- | --- | --- |
| Maurits Kaptein：[Runtime Governance](https://arxiv.org/abs/2603.16586v1)；[Kyvvu/manifests](https://github.com/Kyvvu/manifests/tree/ed09a4e7ddf3f06b49c0f862a2da13caa9ffc5b4) | 同一个动作的风险取决于之前做过什么；适合研究跨步骤授权依据 | 安装并运行 kyvvu-engine 0.11.0，6 条历史对照；原外泄策略测试 8 条通过。进入文章 B | 多 Agent 交接、恢复时，哪些历史必须传给下一次政策判断？完整历史由谁证明？ |
| Lakshya Agrawal 等：[MAST](https://arxiv.org/abs/2503.13657v3)；[仓库](https://github.com/multi-agent-systems-failure-taxonomy/MAST/tree/a70542e541b2104ef8fcd785778179e173fb8d70) | 把“团队表现不好”拆成可讨论的失败类型，适合校准审查语言 | 核对 19 条公开人工标注和固定仓库内 31 条 AG2 人工样本；确认分类版本不同，不能直接合并频次。进入文章 A | 分类版本与代码编号应如何一起发布？结果正确但过程失控应该怎样评价？ |
| Christian Schroeder de Witt 等：[Open Challenges](https://arxiv.org/abs/2505.02077v2)；[所引隐写论文代码](https://github.com/schroederdewitt/perfectly-secure-steganography/tree/cc36ae0b585fae4c7fcf65f7ee4db43aac2edd28) | 提醒我们：看到通信，不等于能理解全部信息流 | 对原 NumPy 耦合函数做 80 组数值检查和均匀分布对照。形成研究笔记，暂不单独写“Agent 串谋”文章 | 如果表面分布不变，治理还需哪些结构限制与信息流证据？ |
| Mansura Habiba 等：[AGENTSAFE](https://arxiv.org/abs/2512.03180v1)；[作者相关技能工具](https://github.com/mansura-habiba/bulbasaur-skill-cli/tree/40303e91b1289200541b3c9f0c975d427fc5b632) | 将能力、限制、运行监督、归因和保证证据连起来；需要核对原则怎样进入实现 | 相关工具的 YAML 加载器及权限判断器做 5 项对照；原权限测试 29 项通过。发现空列表文档与受测实现含义不同。进入文章 B | 缺失字段、明确空列表与拒绝全部，是否应该分别编码？ |
| Shaokun Zhang 等：[Who&When](https://arxiv.org/abs/2505.00212v3)；[上游仓库](https://github.com/ag2ai/Agents_Failure_Attribution/tree/f4d2b6da464a826580e59b3a0eae15ea2d642d7c) | 把失败定位到某个参与者与关键步骤，可为工程调查提供入口 | 4 个原评分函数对照、两题原命令行对照、184 条标注结构检查；复核已有评分问题。进入文章 A | 如何发布精确匹配评分与原始预测，使别人能衡量评分差异？ |
| Haoyu Wang 等：[AgentSpec](https://arxiv.org/abs/2503.18666v3)；[仓库](https://github.com/haoyuwang99/AgentSpec/tree/e6fa3902e2cfb9681f454b355691b771f70543f8) | 把自然语言安全要求转换成动作前执行约束，适合检查规则接入边界 | 原解析器和 Rule.triggered 做 6 个输入对照。确认命名与输入类型会影响触发；两种输入抛 AttributeError。进入文章 B | 结构化工具参数和结束动作应遵循什么统一输入契约？ |

AGENTSAFE 的正式代码仍未找到，不能把 Mansura 的另一个项目当成其实现。Christian 的实验来自综述所引用论文，不能写成已经复现多 Agent 串谋。论文旧成果、当天仓库状态和本轮新实测分别记账。

## 2. 实验结果与反例

### E1：运行政策需要实际历史，而不是相同任务编号

运行原 PolicyEngine、原公开外泄策略与仓库示例的数据构造函数，发送动作和 agent/task 标识保持相同，改变提供给引擎的历史。

| 历史条件 | 发送动作的决策 |
| --- | --- |
| 公共数据读取 + 审查记录 | allow |
| 敏感数据读取 + 审查记录 | block |
| 敏感数据读取 + 两条审查记录 | block |
| 公共数据读取，但没有审查记录 | block |
| 新建引擎，只提供审查记录，仍用相同标识 | allow |
| 新建引擎，重新提供敏感读取与审查历史 | block |

支持：这项政策确实依赖输入历史；增加审批记录不会清除该策略的敏感标记。第五项是主动省略历史的控制实验，不是 Kyvvu 平台丢数据事故，也不是同任务必定绕过。没有发送消息或执行网络外泄。

### E2：失败分类先要固定版本

固定 Hugging Face revision `95118ac951421753cf1deb87ddea3b01e693c41b`，人工标注文件 SHA-256 为 `30a0c4075078e9a1b8c39bc608d2b5156cc64c6bda1f6fd262786eb81ff4a286`。仓库旧 README 指向 MAD，论文 v3 指向 MAST-Data；本轮 API 核对二者解析到相同 revision。

| 文件分组 | 记录数 | 每条标签数 |
| --- | ---: | ---: |
| Round 1 | 5 | 18 |
| Round 2 | 5 | 17 |
| Round 3 | 5 | 17 |
| Generlazability（保留原字段拼写） | 4 | 14 |

同一个 `1.2`，早期轮次指推理与动作不一致，末组指违反角色职责。不能用代码编号直接拼表；这与上游 [Issue #18](https://github.com/multi-agent-systems-failure-taxonomy/MAST/issues/18) 的版本混用报告一致。本轮没有重新计算论文的一致性指标，也未把 19 条人工文件当成全部研究数据。

另外固定读取 `traces/AG2/*human.json` 的全部 31 个直接子文件：每条都有 22 项旧标签。7 条标记没有验证结果，19 条标记评估者缺乏批判检查，两类可以重叠，不能相加当成失败率。其中一条同时被标为结果正确和存在过程问题。该结论是复查原标注，不是本轮重做人工标注或重跑 Agent。

### E3：观测到相同分布，不能推出没有依赖

提取并原样执行上游 `mec_kocaoglu_np` 函数，输入 2、4、8、16 维合成概率分布，每种 20 组，随机种子 917。80 组的最大边缘概率误差为 `2.393918396847994e-16`。

均匀四状态对照中，独立联合分布和耦合联合分布具有相同的可观察边缘分布，互信息分别为 0 和 2 bit。互信息衡量两个变量的依赖程度，不是本轮实际发送的消息量。

这解释了为什么只看表面统计不足以推断信息流。没有执行完整编码器、密钥协商、语言模型生成或 Agent 协作；不宣称复现隐蔽串谋或安全攻击。

### E4：权限文档的空列表与实现的空列表含义不同

原 YAML loader → 原 Guardrails.evaluate_write，输入 POSIX 路径字符串，不执行写入：字段缺失和 `write_paths: []` 都返回 allow；明确目录内返回 allow，目录外返回 deny，带 `..` 但仍匹配字符串 glob 的输入返回 allow。

原文档把空列表示例解释为没有写入权限，原单元测试却明确将没有规则解释为允许。这是可验证的文档/检查器契约差异；路径规范化是否由调用者执行、生产适配器是否可达，本轮没有证明。29 条上游权限测试通过，说明测试通过与这项文档边界澄清并不矛盾。

### E5：步骤“1”不是步骤“10”

原 `evaluate.py` 使用字符串包含判断。实际值 1、预测 10 被算对；实际 10、预测 1 不会被算对，方向不能写反。两个合成题通过原命令行入口得到步骤准确率 100%，整数精确匹配应为 50%。

184 条参考标注由 126 条 Algorithm-Generated 和 58 条 Hand-Crafted 组成。在其中 22 条的历史长度范围内，可以构造与原标签不同、但包含其数字字符串的步骤。这是评分歧义的可达输入分析，不是 22 条真实模型误判，也不能据此重估论文成绩。本轮未获得可匹配的已发布预测文本，不能计算论文成绩变化。

该问题已有 [Issue #14](https://github.com/ag2ai/Agents_Failure_Attribution/issues/14)，本轮贡献是方向性复核、命令行对照和有界数据检查。

### E6：规则触发也是需要验证的输入契约

通过原生成解析器建立 PythonREPL 规则，6 个触发对照：精确工具名 + 字符串输入为 true；工具改名为 false；其他工具但文本以 PythonREPL 开头为 true；精确工具名 + 字典参数为 true；其他工具 + 字典参数、finish + None 均抛 AttributeError。

原因在 `Rule.triggered` 的短路判断：未按工具名匹配时继续调用输入的 `.strip()`。本轮没有加载完整 AgentExecutor，不能据此宣称所有 AgentSpec 集成都会崩溃或造成危险动作。论文支持运行时约束方向，受测实现仍需明确动作适配契约。

## 3. 分类与产出

- 来源覆盖：6 人、6 个仓库；六篇起点论文及 Christian 的被引代码链；无仓库遗漏。
- 实证：5 个原代码机制方向 + 1 个公开数据审计方向。不同粒度的测试和样本不合并成“总成功率”。
- 文章：两篇中英双语研究稿，共四份；A 讨论验证者与标签，B 讨论规则在实现中的含义。详见 [文章论证地图](04-article-briefs.md) 和 [文章目录](articles/README.md)。
- Christian 方向：保留机制研究笔记，后续若要写 Agent 串谋文章，必须补真实编码、解码和 Agent 场景证据。
- CodeFlowMu 正式开发评审：0。尚未建立这六项与本地产品问题/需求之间的针对性验证，不将外部观察变成产品缺陷或新增治理子系统。
- 互动：只对有实测增量且有合适讨论入口的条目交流；正文、回执、Star/Watch 状态与回复仅存本地台账，不纳入公开证据包。

## 4. 复核与限制

运行脚本：`probe-mechanisms.py`、`probe-datasets.py`、`verify-round.py`。固定版本见 `sources/repositories.json`，Python 依赖见 `results/environment.json`，逐项输出见 `results/`。

本轮 Windows 初次检出 MAST 因长路径失败，已通过本仓库操作级 `core.longpaths=true` 恢复；没有改上游代码。命令行探针最初的输出断言漏考虑两空格，调整为匹配空白后重新执行；不是上游评分结果发生变化。原项目测试通过，只证明所选测试范围。全文结论均不代表论文完整复现、部署验收或 CodeFlowMu 已有能力。
