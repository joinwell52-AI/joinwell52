# 2026-08-19｜最终包独立复核 Round 2

## 最终结论

**最终判定：PASS。**

上一轮 Article 3 English 的 B1、B2 均已闭环；更新后的中英文 Figure 1 清楚标明 target boundary，没有把目标协议冒充当前手机 API，也没有引入新的 TMPA、FCoP、CodeFlowMu 或 Operation Approval 边界错误。

本轮为窄范围只读复核，只检查：

- 英文绑定段的 10 分钟 replay eligibility 与 lazy removal；
- target decision contract 与当前 mobile route / Operation Approval 的区分；
- 中英文 Figure 1 的图内文字、alt、图注和事实边界；
- 上一轮分数是否可以升级为最终 PASS。

除新增本报告外，没有修改正文或图片。

## Round 2 分数

| 正文 | 内容 /90 | 其中证据 /25 | 视觉 /10 | 总分 /100 | 判定 |
|---|---:|---:|---:|---:|---|
| Article 3 中文 | **85** | **23** | **9** | **94** | PASS |
| Article 3 英文 | **85** | **23** | **9** | **94** | PASS |

Article 3 双语包按较低语言版本计：**94/100，证据 23/25，PASS。**

沿用终审中未发生变化的五份正文分数，六份最终包如下：

| 正文 | 内容 /90 | 视觉 /10 | 总分 /100 | 证据门禁 | 判定 |
|---|---:|---:|---:|---|---|
| Article 1 中文 | 86 | 8 | 94 | 23/25 | PASS |
| Article 1 英文 | 83 | 7 | 90 | 22/25 | PASS |
| Article 2 中文 | 85 | 9 | 94 | 23/25 | PASS |
| Article 2 英文 | 86 | 9 | 95 | 23/25 | PASS |
| Article 3 中文 | 85 | 9 | 94 | 23/25 | PASS |
| Article 3 英文 | 85 | 9 | 94 | 23/25 | PASS |

六份正文均达到内容门槛，证据均不低于 20/25，总分均不低于 85/100。

## B1 复核｜10 分钟重放资格与惰性清理

**裁决：CLOSED。**

位置：`02-article-3-local-runtime-mobile-control.en.md` 第 56、58 行。

英文现在准确拆开三个事实：

1. 长期设备记录保存 session-token hash；
2. 进程内完成记录在仍驻留内存时保存原 session token；
3. 第一次结果的重放资格在十分钟后结束，过期记录只在该 binding ID 再次被访问时惰性删除，不存在“第十分钟由定时器准点删除”的保证。

这与固定提交 `ed5634c718b9e238c44bb70851020c9793546fe6` 的 `mobileBindStore.ts` 一致：

- `replayTtlMs = 10 * 60 * 1000`；
- `tryConfirm` 访问 `completed` 记录时才检查是否过期；
- 发现过期后执行 `completed.delete(bindId)`；
- 窗口内同一 token 可取回原 `mobile_session_token`；
- 没有定时清理器。

英文不再把十分钟写成明文 token 驻留上限，与中文第 90 行事实一致，但措辞不是机械翻译。

## B2 复核｜目标决定合同与当前实现

**裁决：CLOSED。**

关键位置：英文第 73、89、153 行。

英文现在明确区分三层：

- **目标合同：**手机应提交目标、所见 revision、理由和客户端幂等键；权威服务应重新检查设备、角色、版本和重复请求。
- **当前移动路由：**现有公开代码只证明更窄的能力；当前 route 没有证明已经接受并执行这套客户端 revision/idempotency 合同。
- **当前 Operation Approval：**服务端为绑定摘要的一次高风险尝试创建 action ID；它与任务 REVIEW 分离，不能替代尚未落地的通用手机决定合同。

第 153 行已经从现在时能力声明改为 `Under the target decision contract ... would send / would recheck`，随后直接列出 current public code 能证明与不能证明的范围。

这与当前实现相符：移动治理审批路径读取 `reason`/decision，服务端为调用生成新的 `actionId` 并用作 `idempotencyKey`；Operation Approval 由独立服务处理摘要绑定的高风险尝试。正文没有再声称当前手机路由接受客户端提供的版本与幂等流水号，也没有把 FCoP REVIEW 当成 Git push 或外部写入授权。

## Figure 1 中英文复核

**裁决：PASS。**

### 中文图

- 图内核心标题已从“本地权威服务”收窄为 **“CodeFlowMu 目标权威边界”**。
- 底部来源行明确写 **“目标协议示意”**。
- alt 以“目标决定协议中”开头。
- 图注明确说明“不是当前手机 API 已完整实现的能力声明”，并用“权威服务应重新检查”表达目标合同。

### 英文图

- 图内核心标题为 **“Target Local Authority Boundary”**。
- 底部说明为 **“Target protocol model based on ... verified CodeFlowMu implementation boundaries”**。
- alt 以 **“Target decision contract”** 开头。
- 图注第一句直接写 **“This is the target decision boundary, not a claim about the current mobile API.”**

### 图内事实边界

中英文图都保持以下正确关系：

- Mobile PWA 只是请求入口；
- 设备、角色、目标版本、重复请求是目标服务端检查项；
- 不确定时保持只读、拒绝或返回结果未知；
- 人类批准只允许尝试，不证明成功；
- FCoP REVIEW 属于任务平面；
- Operation Approval 属于高风险操作平面，只授权绑定摘要的精确尝试；
- 后续报告与验证才说明实际结果。

图内标题、alt、图注三层互相支持，没有使用当前时态掩盖 target 性质，也没有新增现成 API、自动发布或 exactly-once 承诺。图片仍为 1600×900、16:9，文字清楚，未出现裁切、重叠或语言串用。

## 中英文同步判断

中英文现在事实一致但保留各自叙事：

- 中文更详细说明吊销、惰性清理、心跳与抗时钟漂移验收目标；
- 英文更紧凑地说明 target contract、current public code 与 Operation Approval 的三段边界；
- 两版都没有把 10 分钟重放资格写成 token 驻留保证；
- 两版都没有把目标决定协议写成当前 mobile route 已实现能力。

这属于面向不同社区读者的有效适配，不是遗漏关键限制或机械翻译。

## 最终门禁

| 检查项 | 裁决 |
|---|---|
| B1：十分钟 replay eligibility / lazy removal | CLOSED |
| B2：target contract / current mobile route / Operation Approval | CLOSED |
| 中文 Figure 1 target 标识 | PASS |
| 英文 Figure 1 target 标识 | PASS |
| 新事实越界 | 无 |
| Article 3 内容 ≥77/90 | PASS |
| Article 3 证据 ≥20/25 | PASS |
| Article 3 总分 ≥85/100 | PASS |

**Round 2 最终包门禁：PASS。** 当前六份正文与 12 条图片引用可以进入后续用户确认和平台适配阶段；本裁决仍不是公开发布授权。
