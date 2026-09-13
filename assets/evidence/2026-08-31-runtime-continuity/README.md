# 三篇研究文章的证据附件

状态：本地审阅版，尚未公开发布。所有身份均为实验合成标识；不含真实任务账本、凭据、签名密钥或产品源码。

本包有两层复核，不能混淆：

1. **捕获数据复核与研究 Reader 重跑**：仅需 Node.js，无网络、无产品依赖。可逐项检查文章表格，重跑时点截断和负对照。
2. **产品行为重新实验**：需要获准访问固定 CodeFlowMu 源码和其已安装依赖。探针导入真实服务，但使用本地合成执行器；不验证真实 HTTP、Git、Issue 或账号切换。

## 一分钟复核

本轮验证环境为 Node.js v24.16.0。在此目录执行：

```text
node check.mjs
node check-manifest.mjs
```

预期退出码为 0，JSON 输出 `result: PASS`，并列出：

| 集合 | 预期 |
|---|---|
| restart_variants | 3 |
| authorization_cases | 11 |
| binding_cases | 8 |
| reader_cases | 8 |
| benchmark_configs | 1187 |

第一条命令的完整本轮结果见 [check-output.json](check-output.json)；第二条校验文件是否仍与包内清单一致。不同集合不能相加成产品可靠性或检测准确率。

检查输出中的 `first_party_details` 还逐项核验正文新增的第一方证据：failed 记录保留第一次效果证据；同一合成操作恢复后出现两个不同效果标识；6 条空 session 分为5条不可信声明和1条合法无会话操作；T2 接受5个证据对象并拒绝2个未来对象；累积快照行数相加为4，但T3实际不同效果为2。这些是现有捕获数据的细化核对，不是新增生产运行或检测准确率。

原始保留现场与本包导出结果的逐项对账结论见[第一方证据审读](../05-first-party-evidence-review.md)。该对账需要本地原始研究记录；公开捕获数据检查不冒充原始产品行为复跑。

## Claim → 来源 → Fixture → Check

| Evidence ID / 文章主张 | 受测来源 | 公开捕获数据 | 检查方式及支持边界 |
|---|---|---|---|
| E-A0：正常完成后只执行一次；审计三个落点结果不同 | 审批服务，发布工作树与固定 main | [historical-probes.json](fixtures/historical-probes.json) | 检查双基线 P0/P3；P1/P2 保留状态及错误。是合成实验，不是线上故障率 |
| E-A1：新进程重试的效果由执行器与摘要决定 | 审批服务 + 真实执行注册器 + 合成适配器 | [restart.json](fixtures/restart.json) | 比对调用数、效果文件快照、状态、EISDIR/APPROVAL_STALE；不是生产 executor 全覆盖 |
| E-B1：恢复 session 可消费匹配批准，其他九条件未取得授权 | consumeApprovedAuthorization | [authorization.json](fixtures/authorization.json) | 检查 11 场景、两条接受路径二次消费拒绝；上下文由探针提供，不证明外部身份入口可信 |
| E-B2：已登记会话绑定、未登记/错配/sessionless 分类 | SessionStore + 技能调用记录服务 | [session-binding.json](fixtures/session-binding.json) | 检查 8 行分类和已捕获的 HMAC 正反校验结果；未提供密钥，公开 check 不重新验证产品 HMAC |
| E-C0：官方 PRE 结果与分来源、覆盖率 | CatchBench 固定源码 874433db | [原始输出](fixtures/catchbench-pre.log)、[汇总](fixtures/benchmark-summary.json) | 核对 1,187 配置、11 输出行及基线；缓存结果重算，不是新模型调用或 CodeFlowMu 成绩 |
| E-C1：时点、归属、缺失和改动改变结论 | 本次真实服务探针的分阶段捕获 + 研究 Reader | [timeline.json](fixtures/timeline.json) | [reader.mjs](reader.mjs) 实际执行 4 正常/4 负对照；不是产品新能力或统计准确率 |
| E-CTRL：既有保护对照 | 四个产品测试文件 | [TAP 日志](fixtures/existing-tests.log)、[环境/退出码](fixtures/run-metadata.json) | 28 pass / 0 fail / 0 skip，非全量回归或独立 QA |

源码版本、外部一手链接、受测模块 SHA-256 与捕获来源摘要见 [provenance.json](provenance.json)。[manifest.json](manifest.json) 列出本包文件摘要；它防止相对于该清单的静默改动，不提供独立见证。

## 重跑真实产品探针

附带 [reproduce-product.mts](reproduce-product.mts)，它与本次执行的研究脚本字节一致。源码必须固定在 `f0f42f01c8f6d55bfe3d32e108f607841a2900d9`，不能无记录地换成最新版。按本机路径替换下面三个占位符（此处不是可原样粘贴的绝对路径）：

```text
node --import <SOURCE_ROOT的tsx-loader-file-URL> reproduce-product.mts <SOURCE_ROOT> <ISOLATED_OUTPUT_ROOT>
```

loader 位于 `packages/codeflowmu-runtime/node_modules/tsx/dist/loader.mjs`，转换为本机 `file:///...` URL。依赖使用该产品固定安装状态。输出目录必须是研究专用目录，不得指向生产实例或真实任务账本。

脚本会新建随机子目录，保留每次运行；首次故障和恢复各启动一个 Node 子进程；审计路径改名及目录替换只作用于这些合成目录。不强杀、不删除现场、不读取真实凭据，不产生网络副作用。产品 HMAC 密钥只存在于隔离现场，不在本包中。

合成适配器借用注册器支持的 `git.push` 名称，但实现只写本地 JSONL。不得把名称当成真实 Git push 已被测试。

## 重跑外部 PRE

取得 CatchBench 仓库、核对 `874433dbd79243e5756d80ed2782617b34bc8ec1`，遵守该仓库 README，在其源码目录用 Python 3.10.11 执行：

```text
python run.py --task pre
```

本轮用官方源码入口，没有新模型调用；未跑 LIVE/POST/Gold。上游代码/数据的许可适用于上游资源，本包没有重新分发其完整语料。

## 时间线 Reader 的精确合同

`available_at` 是研究脚本赋予的观察序号；owner 是合成运行 ID；它们不是由可信时间戳服务签发。T0 故意不给 Reader 效果文件，T1/T2 给一条，T3 给两条。效果快照是累积快照，Reader 取截至时点最新快照，不能把每个快照重复累加。

Reader 只把独立效果文件作为本实验的效果来源，不把审批状态或执行器自述升级成效果证明。`not_observed` 不是“不会发生”；`unknown` 不是“失败”；`yes` 只表示当前合成标记命题成立。

N2 的另一个 owner 和 N4 的篡改都是在捕获数据的内存副本上施加的研究变换，未伪造产品历史。N3 刻意将未来快照提供给 Reader，用来检查过滤行为。简单读取器是故意设置的弱对照，不能当作某真实产品的基线。

## 局限与审查身份

实验与文章均由同一研究者完成。产品源码属于访问受限复跑层；公开捕获数据可以自洽检查，但不能凭自签清单证明研究者没有编造源头。没有独立 QA、盲测、现场故障率或真实账号权限提升证明。当前交付为三篇文章、实验脚本与审阅附件，没有产品修复、发版或发布动作。
