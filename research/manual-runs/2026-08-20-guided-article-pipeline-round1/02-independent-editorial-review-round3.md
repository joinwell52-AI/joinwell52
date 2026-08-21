# 2026-08-21｜独立技术编辑复核（Round 3）

## 结论

**NEEDS REVISION**

三篇均达到内容分与证据分数字门槛；T1、T2 单篇可判 PASS。T3 中文正文把一个明确未被 44 项测试覆盖的反例列入“测试包含”，与英文正文、事实矩阵和运行日志冲突，因此触发证据硬门，系列整体暂不能 PASS。该问题可局部修正，不构成 REJECT。

本轮只读核验当前磁盘正文、来源登记、事实矩阵、运行日志与固定提交实现；仅新增本报告，未修改正文或其他 supporting artifacts。

## 正文 SHA-256

哈希在完成全文复核后再次计算，六份正文在审查期间未变化。

| 文件 | SHA-256 |
|---|---|
| `02-article-1-skill-vs-tool-authority.zh.md` | `4F9B6CF7D4B8DACC4DAE0F240E97645C37875A8B114338DA7C55371D3BE9285C` |
| `02-article-1-skill-vs-tool-authority.en.md` | `C9E8FEED570F6B1DC64BC165CE1945C41AE85D8009B9546612F8FED4548FC5C9` |
| `02-article-2-project-root-switch.zh.md` | `A33CF76AD3C754BB4129BF82D0D2A765C59D8E60010D0707D1573B84627F7DED` |
| `02-article-2-project-root-switch.en.md` | `4D95A55AF4DDA5ED54FA1148E45D3639F47D8A1C53C459BDC80C9AC55473F298` |
| `02-article-3-report-attribution.zh.md` | `34E7FDD4D9E3E147112E7D0B5E1DC3FA8A12DC6FD9C8D958675C9DC14F0C1822` |
| `02-article-3-report-attribution.en.md` | `700315007C8D63AA3F6C9DC7B5ED480F78BFF1D94237B6068C33A3ACC42B9138` |

## 阻断项

### B1｜T3 中文把未覆盖反例写进“44 个测试包含”

`02-article-3-report-attribution.zh.md:151` 位于“44 个测试覆盖了哪些串账路径”下，并列出：

> 三字段一致但共同指向错误任务：当前门禁无法单独识别，必须由运行上下文封包或其他来源约束。

但当前证据明确说明该场景未被 44 项测试覆盖：

- `02-fact-claim-matrices.md` 写明“当前 44 项测试未覆盖‘三处一致地写错’”；
- 英文正文明确写 `The suite does not prove that three consistently wrong identifiers will be detected`；
- 运行日志列出的 44 项测试没有该用例；本轮独立复跑仍为 44/44，没有新增此测试；
- 中文正文自己的“限制与待验证问题”又把该场景列为下一步测试目标。

修订要求：把该条移出“测试包含”，明确写为“门禁逻辑分析发现的未覆盖反例/下一步测试目标”，并与英文、事实矩阵和运行日志保持同一证据身份。修正后无需改变“三字段一致是必要非充分条件”的核心结论。

## 重点核验结果

### 1. 开头叙事与数字位置

**PASS。** 三篇中英文都先用具体失败场景建立问题，再给出方法承诺；测试数字已后置到各自证据章节，没有再把数字摘要塞进开头。中文叙事自然，英文为独立成文而非机械镜像。

### 2. T1：35=22+13、批准服务与安全边界

**PASS。** 本轮在 commit `ed5634c718b9e238c44bb70851020c9793546fe6` 独立复跑：

- 行为手册、MCPInjector、角色与操作策略：22/22 PASS；
- `OperationApprovalService.test.ts`：13/13 PASS；
- 合计：35=22+13，正文、事实矩阵与运行日志一致。

实现与正文边界相符：

- `OperationApprovalService` 具备请求摘要、过期、随机一次性执行令牌、available/consumed 状态、错误令牌拒绝、请求变化失效与并发单次消费；
- `WorkspaceOperationApproval` 仅为特定工作区执行器构建 Git HEAD、目标文件摘要和路径快照，并使用真实路径处理边界；
- 正文没有外推为所有终端、MCP 或第三方工具都已统一获得 TOCTOU 防护；
- 正文明确静态解析、符号链接、组合命令、容器隔离和操作系统沙箱仍是边界。

运行日志另记载 `controlled-executor-registry.test.ts` 为 1/4 PASS、3/4 因夹具缺少 `thread_key` 在执行器前失败；本轮复跑得到相同结果。正文没有把这 4 项计入 35，也没有把工作区适配器写成全链路已通过，因此不构成事实错误。若追求最高透明度，可在 T1 测试边界中补一句该集成夹具未进入执行器，但当前限定语已足以避免能力外推。

### 3. T2：graceful drain、Windows 句柄与 realpath

**PASS。** 中英文均把现状与建议分开：

- 当前实现是紧急取消、失败关闭、停止 Runtime、持久化、重载和有限补偿；
- graceful drain 被写成“更成熟的目标顺序 / stronger target sequence”，不是现成功能；
- `EBUSY`、`EPERM` 与句柄探测明确是 27 项测试未注入的 Windows 风险及建议；
- `fs.realpathSync.native()` 被写成未找到全组件统一采用的证据，真实路径身份是 hardened design/工程建议；
- 验收清单末尾再次声明真实路径、排空窗口、句柄探针等并非当前切换接口全部实现。

本轮独立复跑 Runtime 5/5、Shell 22/22，合计 27/27 PASS，与运行日志和事实矩阵一致。

### 4. T3：归因上限、封包合同、版本与时间

除 B1 外其余重点均 **PASS**：

- 中英文都明确三字段一致只能发现不一致，不能发现三处一致地复制同一个错误任务号；
- Runtime envelope 注入被明确标为目标设计/下一步合同，不是 CodeFlowMu 全路径现成功能；
- `submission_attempt`、`revision_of`、`supersedes`、`superseded_by` 被准确描述为当前账本可读取的构件，没有外推为所有写入器都会自动分配唯一轮次；
- 汇总门排除 invalid/superseded 报告的能力与实现一致；
- 逻辑事件序号、执行轮次和显式替代关系被写成高后果验收的建议优先级，物理时间只作辅助；正文明确旧兼容路径与文件修改时间受复制、解压和时钟漂移影响；
- W3C `parent-id` 的中英文表述保持精确，追踪关联没有被当成业务验收。

本轮独立复跑 44/44 PASS；数字本身准确，问题仅在中文对其中一个未覆盖项的归类。

### 5. 来源清单、事实矩阵与运行日志

三份核心证据整体一致：来源登记中的 CodeFlowMu 固定链接实际为 12 个，均固定到同一 commit；T1 的 35、T2 的 27、T3 的 44 与运行日志相符；事实矩阵正确保存 TOCTOU、graceful drain、realpath、三处一致写错、envelope 注入、逻辑顺序和物理时间边界。

附带发现：`02-article-briefs.md` 的证据身份仍停留在旧版本——T1 写“3 个第一方实现、22/22”，T3 写“3 个第一方实现”，而当前来源登记分别为 5 个和 4 个第一方实现，T1 当前证据为 35=22+13。Article Brief 不是本轮三份核心证据之一，不单独触发内容硬门，但发布包若要求 planning metadata 全量一致，应同步更新。

## 内容阶段评分（满分 90）

| 文章 | 选题 20 | 证据 25 | 原创洞察 20 | 结构可读性 15 | 可行动性 10 | 总分 90 | 证据门 | 单篇结论 |
|---|---:|---:|---:|---:|---:|---:|---|---|
| T1 技能与工具权限 | 19 | 24 | 19 | 14 | 10 | **86** | PASS | **PASS** |
| T2 项目执行链换根 | 19 | 24 | 19 | 14 | 10 | **86** | PASS | **PASS** |
| T3 并行报告归属 | 19 | 22 | 19 | 14 | 10 | **84** | **FAIL（证据归类冲突）** | **NEEDS REVISION** |

三篇均超过 77/90，且 T3 的证据分仍超过 20；但证据硬门不能由总分抵消。关闭 B1、确认正文哈希更新并复核中英文/矩阵/日志一致后，系列可恢复为 PASS。
