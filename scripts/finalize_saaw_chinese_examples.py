from pathlib import Path

p = Path('docs/zh/industry/2026-08-10-saaw-software-as-an-agent-worker.md')
s = p.read_text(encoding='utf-8')

# 1) Replace the explanatory workday section with a concrete digital-researcher workday.
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
20:00 正式发布      → GitHub + Website + Commit Verify + Release
```

这就是一个数字研究员的一天：**它不是回答一次问题，而是在固定职责和工作节奏下，持续完成研究工作。**
'''
s = s[:start] + workday + s[end:]

# 2) Five FCoP buckets: preserve English protocol names and add Chinese labels on the right.
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

# 3) Self-Morphing main flow: bilingual labels.
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

# 4) Research production chain: add Chinese mapping without turning it into the workday timeline.
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

# 5) Development-to-work runtime loop: bilingual.
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

# 6) PWA control-plane flow: bilingual labels for the remaining English nodes.
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
