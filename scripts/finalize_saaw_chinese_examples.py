from pathlib import Path

p = Path('docs/zh/industry/2026-08-10-saaw-software-as-an-agent-worker.md')
s = p.read_text(encoding='utf-8')

# 1) Move publication/research metadata from the opening to the article footer.
front_meta = '''> **作者 / 发布单位：** joinwell52 Research Center / CodeFlowMu Core Team  
> **理论与架构支撑：** TMPA Architecture Paper — TMPA-ARCH-A0.9  
> **规范性标准：** TMPA Core Specification — S0.6  
> **实证案例：** TMPA Implementation Case Report — I0.8  
> **核心工程载体：** CodeFlowMu / FCoP

'''
s = s.replace(front_meta, '', 1)

old_footer = '''---

**joinwell52 Research Center**  
**CodeFlowMu Core Team**

**TMPA Architecture Paper A0.9 · TMPA Core Specification S0.6 · TMPA Implementation Case Report I0.8 · CodeFlowMu / FCoP**

> **V1.1 边界说明：**'''
new_footer = '''---

> **作者 / 发布单位：** joinwell52 Research Center / CodeFlowMu Core Team  
> **理论与架构支撑：** TMPA Architecture Paper — TMPA-ARCH-A0.9  
> **规范性标准：** TMPA Core Specification — S0.6  
> **实证案例：** TMPA Implementation Case Report — I0.8  
> **核心工程载体：** CodeFlowMu / FCoP

> **V1.1 边界说明：**'''
if old_footer in s:
    s = s.replace(old_footer, new_footer, 1)

# 2) Replace the explanatory workday section with a concrete digital-researcher workday.
start = s.index('### 一个数字员工的一天：Research Report Production Engine V1.3')
end = s.index('\n\n---\n\n## 9. CodeFlowMu：TMPA 从理论进入运行世界', start)
workday = '''### 一个数字研究员的一天：Research Report Production Engine V1.3

我们不再虚构一个岗位。下面就是 **Research Report Production Engine V1.3** 作为“数字研究员”的真实一天。

**09:00 · 研究发现**  
数字研究员开始当天工作，扫描新的研究信号、工程变化和待研究问题，判断哪些内容值得进入研究视野。  
**产出：信号池（Signal Pool）。**

**10:00 · 研究队列**  
它从信号池中筛选当天真正要推进的研究对象，确定优先级和研究方向。不是看到什么就写什么，而是先决定“今天研究什么”。  
**产出：今日研究计划（Today's Research Plan）。**

**11:00 · 研究阅读**  
围绕当天选定的研究对象读取论文、规范、工程记录、代码、测试结果和已有材料，整理可用证据，同时明确还缺什么。  
**产出：阅读结果（Reading Result）。**

**13:00 · 研究分析**  
把上午获得的材料转化为判断：哪些事实成立，哪些只是推断，哪里存在争议，边界条件是什么，接下来应该形成什么研究结论。  
**产出：研究对象（Research Object）。**

**15:00 · 研究生产**  
数字研究员开始把研究对象加工成正式工作成果：组织文章结构、写报告、核对证据、补充必要的图表和可视化，形成可以进入发布审查的候选版本。  
**产出：发布候选稿（Publication Candidate）。**

**20:00 · 正式发布**  
候选稿满足发布条件后进入正式发布：写入 GitHub、生成网站页面、完成提交验证与发布确认；如果存在必须由人承担责任的事项，就停在授权边界等待人工决定。  
**产出：正式发布的研究成果。**

```text
09:00 研究发现      → 信号池
10:00 研究队列      → 今日研究计划
11:00 研究阅读      → 阅读结果
13:00 研究分析      → 研究对象
15:00 研究生产      → 发布候选稿
20:00 正式发布      → GitHub 入库 + 网站发布 + 提交验证 + Release
```

这就是一个数字研究员的一天：**它不是回答一次问题，而是在固定职责和工作节奏下，持续完成研究工作。**
'''
s = s[:start] + workday + s[end:]

# 3) Formal work-fact chain: preserve identifiers and add Chinese labels.
s = s.replace('''```text
TASK
  │
  ▼
ACCEPTANCE
  │
  ▼
REPORT
  │
  ▼
REVIEW
  │
  ▼
DECISION
```''', '''```text
TASK          任务
  │
  ▼
ACCEPTANCE    接受任务
  │
  ▼
REPORT        工作报告
  │
  ▼
REVIEW        审查
  │
  ▼
DECISION      正式决策
```''', 1)

# 4) Partial-order example: bilingual labels.
s = s.replace('''```text
            ┌── DEV REPORT ──┐
TASK ───────┤                ├── REVIEW
            └── OPS REPORT ──┘
```''', '''```text
                  ┌── DEV REPORT / 开发报告 ──┐
TASK / 任务 ──────┤                           ├── REVIEW / 审查
                  └── OPS REPORT / 运维报告 ──┘
```''', 1)

# 5) Five FCoP buckets: English protocol names on the left, Chinese names on the right.
s = s.replace('''```text
inbox
  │
  ▼
active
  │
  ▼
review
  │
  ▼
done
  │
  ▼
archive
```''', '''```text
inbox      收件箱 / 待领取
  │
  ▼
active     执行中
  │
  ▼
review     待审查
  │
  ▼
done       已完成
  │
  ▼
archive    已归档
```''', 1)

# 6) Existing-system operation diagram: translate ordinary labels, preserve technical terms.
s = s.replace('''```text
Agent
  │
  ├── API
  ├── 浏览器
  ├── CLI
  ├── 受控 Hook
  └── 受控自动化
        │
        ▼
既有 ERP / CRM / 业务系统
```''', '''```text
Agent / 智能体
  │
  ├── API / 接口
  ├── Browser / 浏览器
  ├── CLI / 命令行
  ├── Hook / 受控钩子
  └── Approved Automation / 受控自动化
        │
        ▼
Existing ERP / CRM / Business System
既有 ERP / CRM / 业务系统
```''', 1)

# 7) CodeFlowMu Meta Team box: bilingual role labels.
s = s.replace('''```text
┌───────────────────────────────┐
│      CodeFlowMu Meta Team     │
│                               │
│ PM        DEV       QA    OPS │
└───────────────────────────────┘
```''', '''```text
┌─────────────────────────────────────────────────────┐
│        CodeFlowMu Meta Team / 元开发团队            │
│                                                     │
│ PM / 项目经理   DEV / 开发   QA / 质量验证   OPS / 运维 │
└─────────────────────────────────────────────────────┘
```''', 1)

# 8) Research production chain: add Chinese mapping; this is distinct from the workday timeline.
s = s.replace('''```text
Research Question → Research Object → Evidence / Reading → Analysis
                  → Report → Evidence Gate → Visualization
                  → Human Authorization → Publication
```''', '''```text
Research Question      研究问题
        ↓
Research Object        研究对象
        ↓
Evidence / Reading     证据 / 阅读
        ↓
Analysis               分析
        ↓
Report                 报告
        ↓
Evidence Gate          证据门
        ↓
Visualization          可视化
        ↓
Human Authorization    人类授权
        ↓
Publication            发布
```''', 1)

# 9) Self-Morphing main flow: bilingual labels.
s = s.replace('''```text
Meta-Dev Runtime
        │
        ▼
Analyze Existing Work
        │
        ▼
Develop Worker Package
        │
        ▼
Validate
        │
        ▼
Human / Governance Decision
        │
        ▼
Deploy
        │
        ▼
Domain Worker Runtime
```''', '''```text
Meta-Dev Runtime              元开发运行体
        │
        ▼
Analyze Existing Work         分析现有工作
        │
        ▼
Develop Worker Package        开发数字员工包
        │
        ▼
Validate                      验证
        │
        ▼
Human / Governance Decision   人类 / 治理决策
        │
        ▼
Deploy                        部署
        │
        ▼
Domain Worker Runtime         领域数字员工运行体
```''', 1)

# 10) Finance and contract worker examples: bilingual labels.
s = s.replace('''```text
PM / DEV / QA / OPS
        │
        │ 开发
        ▼
Finance Worker Package
        │
        ▼
Invoice Agent
ERP Entry Agent
Compliance Agent
Archive Agent
```''', '''```text
PM / DEV / QA / OPS           元开发团队
        │
        │ 开发
        ▼
Finance Worker Package        财务数字员工包
        │
        ▼
Invoice Agent                 发票处理智能体
ERP Entry Agent               ERP 录入智能体
Compliance Agent              合规智能体
Archive Agent                 归档智能体
```''', 1)

s = s.replace('''```text
PM / DEV / QA / OPS
        │
        ▼
Contract Worker Package
        │
        ▼
Risk Analysis Agent
Signing Agent
Compliance Agent
Archive Agent
```''', '''```text
PM / DEV / QA / OPS           元开发团队
        │
        ▼
Contract Worker Package       合同数字员工包
        │
        ▼
Risk Analysis Agent           风险分析智能体
Signing Agent                 签署智能体
Compliance Agent              合规智能体
Archive Agent                 归档智能体
```''', 1)

# 11) Development-to-work runtime loop: bilingual.
s = s.replace('''```text
Development Runtime
        │
        ▼
Digital Employee Package
        │
        ▼
Work Runtime
        │
        ▼
Work Evidence
        │
        ▼
Development Runtime
```''', '''```text
Development Runtime          开发运行体
        │
        ▼
Digital Employee Package     数字员工包
        │
        ▼
Work Runtime                 工作运行体
        │
        ▼
Work Evidence                工作证据
        │
        ▼
Development Runtime          回到开发运行体
```''', 1)

# 12) PWA control-plane flow: bilingual labels for remaining English nodes.
s = s.replace('''```text
SaaW Runtime
      │
      ▼
工作报告
      │
      ▼
FCoP / TMPA 工作事实
      │
      ▼
Reader
      │
      ▼
Mobile PWA
      │
      ▼
人类批准 / 驳回
      │
      ▼
正式决策
      │
      ▼
SaaW Runtime 继续运行
```''', '''```text
SaaW Runtime        SaaW 运行体
      │
      ▼
工作报告
      │
      ▼
FCoP / TMPA 工作事实
      │
      ▼
Reader              状态读取器
      │
      ▼
Mobile PWA          移动控制面
      │
      ▼
人类批准 / 驳回
      │
      ▼
正式决策
      │
      ▼
SaaW Runtime        SaaW 运行体继续工作
```''', 1)

p.write_text(s, encoding='utf-8')
