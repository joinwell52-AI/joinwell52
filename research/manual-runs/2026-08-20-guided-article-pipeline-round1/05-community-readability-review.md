# 2026-08-22｜社区可读性独立复核

## 结论

**整体：PASS**

| 文章 | 中文 | 英文 | 结论 |
|---|---|---|---|
| T1 技能与工具权限 | PASS | PASS | **PASS** |
| T2 项目执行链换根 | PASS | PASS | **PASS** |
| T3 并行报告归属 | PASS | PASS | **PASS** |

本轮以 Research Center 面向专业 IT 读者的定位判断：科普化目标是帮助不同 IT 子领域读者跨专业理解，不要求删除代码、测试、错误码、实现名称或一手来源。六份最新正文均未发现需要退回修订的事实、边界或可读性阻断。

本轮只读六份正文并目视核对现有题图、文中图；未修改文章或图片。

## T1｜技能不是工具权限

**结论：PASS。**

- 中文关键术语首现闭合：`AI Agent（人工智能体）`、`Skill（技能）`、`Tool（工具）`、`Role Capability（角色工具能力）`、`Operation Policy（操作策略）`、`Approval（单次批准）`，后文的 MCP、HTTP、Runtime、RBAC 和 ABAC 也均给出中文解释。
- 办公室发布比喻准确：操作手册只提供方法，机器产生真实副作用，门禁卡只代表角色可发起某类调用，工作单让策略看到目标与影响，本次盖章只放行一个完全匹配动作。正文另行强调 Tool 不是权限、批准不是执行成功或交付验收，没有因降门槛而合并五个概念。
- 中英文事实边界同步：35 项仍明确为 22/22 基础门禁测试加 13/13 批准服务测试；全工具链前态绑定、通用沙箱、复杂命令与符号链接防护仍是未证实边界；`stub` / `live` 等为实现模式名，并已直接说明其行为，不形成概念歧义。
- 题图仍表达“方法保留在核心内、动作在独立授权边界等待匹配批准”；文中图仍与四层责任及“批准不等于成功/验收”一致。新增比喻没有改变文章唯一命题。

## T2｜项目执行链换根

**结论：PASS。**

- 施工队换工地比喻与工程机制一一对应：牌子是界面选择，工人是 Agent 终端/子进程，工具车是 MCP 工具进程，监控探头是 Watcher，派工台、施工台账和验收档案分别对应任务、FCoP 生命周期与日志证据根。它准确解释“局部成功、组合串项目”，没有把换根简化为复制文件或改标签。
- 七组件表完整且中英文同步：Runtime、MCP Server、Watcher、Agent 终端与子进程 `cwd`、任务准入/提交根、FCoP 生命周期根、日志/证据根均在中文首现给出准确解释；Symlink、真实路径、Immutable Context、`ENOENT`、`EBUSY`、`EPERM` 也在首次承担概念作用时解释。
- 当前能力与建议边界保持清楚：当前路径仍是紧急取消、失败关闭、停止 Runtime、保存新根、重载并核对；优雅排空、写入租约复核、Windows 句柄探测、真实路径统一、根摘要和临时任务验收均置于“更成熟目标”或“工程建议”，27 项测试也明确没有覆盖这些竞态。
- 中英文都保留“有序停止、持久化、重建与核对，并带有限回滚”，没有误称原子事务；27/27 的覆盖项和未覆盖项一致。
- 题图的灰色失活 A、红色隔离面与单一蓝色 B 仍匹配“旧根停止、整体换根”；文中图继续用虚线框标出建议增强，与修订正文一致。

## T3｜报告归属

**结论：PASS。**

- “谁干的、拿什么证明、对谁负责”三问分别对应身份/执行轮次、真实机器证据、任务合同与验收权，降低入口门槛但没有把归因、真实性、独立 QA 和业务接受混成一个判断。
- 责任链没有虚构现成功能：链前明确 CodeFlowMu 只在部分关键路径实现硬门，链后再次说明“运行系统自动注入全部身份”和“统一采集全部工具证据”是目标方向；图注也将全权威元数据注入标为目标合同。
- 否决清单边界准确：缺失命令、退出码或原始输出被判为证据不足；版本不一致被判为过期/冲突证据；三字段与派工记录冲突被判归属失败。正文明确“否决”不是恶意欺诈指控。
- 租约没有被虚构为现有通用机制：条目仅对“确实采用有时限执行权”的路径给出条件式处理，并明确未实现路径不得创造“租约过期”规则。
- 中文首现对 QA、Agent、多 Agent、DEV、frontmatter、FCoP、REPORT、Runtime、Veto List、Trace Context、trace-id、parent-id、API、span 和 TraceId 均给出中文解释。代码字段及状态字面量保留原名，适合专业 IT 读者。
- 中英文同步保留三字段一致的必要非充分边界、运行时封包目标、44/44 的实际覆盖范围、三处一致地写错的下一步测试、逻辑序号/执行轮次/替代关系优先于物理时间，以及缺失 QA 时阻止成功总结。
- 题图继续把 TASK 42 的执行事实与独立验证合成接纳链，并将 TASK 17 保留在归属边界外；文中图仍准确表达 attempt、supersession、QA 与错属隔离。新增三问和否决清单没有扩大图示能力。

## 跨语言与资源核验

- 三组中英文的核心结论、测试数字、反例、建议身份和未证实项一致；英文是自然成文，不存在中文版新增能力而英文遗漏边界的情况。
- 六篇 frontmatter 与 `ArticleCover` 仍指向对应题图；六份文中图引用均存在于 `docs/public/assets/covers`。
- 现有 3 张题图和 3 张文中图像素与上一轮通过版本一致，语义无需调整。

## 本轮正文 SHA-256

| 文件 | SHA-256 |
|---|---|
| `docs/zh/industry/2026-08-20-skill-vs-tool-authority.md` | `9303F9ADC1D48F958CE2B942EDD594B29371F825DDB8C1744E5ED1C2D9890396` |
| `docs/en/industry/2026-08-20-skill-vs-tool-authority.md` | `20CFA92EC90FBF2C7DC3EB600037C3FC608FAB1C616F331CB8850342ECC0CD4E` |
| `docs/zh/engineering/2026-08-20-project-root-switch.md` | `1C27767B6300AD12BD28276C0B552E08A055FEE64A4E50364C3399E883A50A32` |
| `docs/en/engineering/2026-08-20-project-root-switch.md` | `C6A4688EE5A8456AFAE49F929D3D92745D40752BED541344F5066419FE082863` |
| `docs/zh/digital-employee/2026-08-20-report-attribution.md` | `B94BCF225367586D7EF20AAFB8E46B4DE1AB77C79A339B5C2178B4804D98AAE8` |
| `docs/en/digital-employee/2026-08-20-report-attribution.md` | `B436E12EBD84BBB39B23009C9E82938FAF779CE8CA246BC1BDD1A7637CC776CC` |

## 图像 SHA-256

| 文件 | SHA-256 |
|---|---|
| `daily-2026-08-20-skill-vs-tool-authority-cover.png` | `43FF4C9B93543DD9C6851C2EE98D370759601FE56C59AF36A8338D3B2C1DF0A8` |
| `daily-2026-08-20-skill-vs-tool-authority-figure-1.png` | `503BA14244ECBAAEB200773823F35390F7C511588FC7F0934AD318BF5EB6A181` |
| `daily-2026-08-20-project-root-switch-cover.png` | `69040C8D0A76BE4248AEF3B4D53D2FFDEE26A51F0DE6A1586D8EA64ADCD80660` |
| `daily-2026-08-20-project-root-switch-figure-1.png` | `0B556D4B311ADA3B82CC6943F47F0867C4134BFE6D52CF99A8FD7588960E17E8` |
| `daily-2026-08-20-report-attribution-cover.png` | `B339226542AA4CA585F368F9E2BD47EB3627A85DAC6877FBC88AC3FB90122C78` |
| `daily-2026-08-20-report-attribution-figure-1.png` | `7E38E373FC85323D512DC642631EBBDD42A8D9334910A6C40A4A414B8825B170` |

最终结论：三篇双语已发布文章均为 **PASS**，可保留当前版本。
