from pathlib import Path
import re

zh = Path('docs/zh/industry/2026-08-10-saaw-software-as-an-agent-worker.md')
en = Path('docs/en/industry/2026-08-10-saaw-software-as-an-agent-worker.md')

z = zh.read_text(encoding='utf-8')
e = en.read_text(encoding='utf-8')

z_new = '''### 一个数字员工的一天：Research Report Production Engine V1.3

不用想象一个虚构的数字员工。我们每天运行的 **Research Report Production Engine V1.3**，本身就是一个可以观察的研究型数字员工。

**09:00 · 研究发现（Discovery）**  
扫描当天值得研究的信号、工程变化与研究问题，形成 **Signal Pool**。先回答一个最简单的问题：**今天有什么值得研究？**

**10:00 · 研究队列（Queue）**  
从候选信号中确定当天真正要推进的对象，形成 **Today's Research Plan**。也就是决定：**今天具体做哪一件？**

**11:00 · 研究阅读（Reading）**  
围绕已选对象读取来源、证据和已有材料，形成 **Reading Result**。证据不足就留下缺口，不用语言流畅度把未知内容补出来。

**13:00 · 研究分析（Analysis）**  
把阅读结果整理成判断、争议点、边界条件与待验证问题，形成 **Research Object**。到这里，系统已经知道：**这件事到底说明了什么？**

**15:00 · 研究生产（Production）**  
把 Research Object 转化为正式报告或文章候选，完成结构、证据检查和必要的可视化，形成 **Publication Candidate**。

**20:00 · 正式发布（Publication）**  
完整候选满足发布条件后，写入 GitHub、生成网站页面，并完成 **Commit Verify + Release**；如果存在需要人承担责任的事项，就停在人类授权边界等待决定，而不是自行越权发布。

```text
09:00 Discovery → Signal Pool
10:00 Queue → Today's Research Plan
11:00 Reading → Reading Result
13:00 Analysis → Research Object
15:00 Production → Publication Candidate
20:00 Publication → GitHub + Website + Commit Verify + Release
```

这就是 SaaW 最直观的样子：**软件不是在回答一个问题，而是在按岗位、班次和治理规则持续完成一天的工作。**'''

pattern_zh = r'### 一个数字员工的一天：Research Report Production Engine V1\.3[\s\S]*?(?=\n\n---\n\n## 9\. CodeFlowMu：TMPA 从理论进入运行世界)'
z, n = re.subn(pattern_zh, z_new, z, count=1)
if n != 1:
    raise SystemExit(f'Chinese workday section replacement count={n}')

e_new = '''### A Day in the Life of Research Report Production Engine V1.3

There is no need to invent a fictional digital employee. The **Research Report Production Engine V1.3** already operates as an observable research worker.

**09:00 · Discovery**  
Scan the day's signals, engineering changes, and research questions → **Signal Pool**.

**10:00 · Queue**  
Select the object that will actually move forward today → **Today's Research Plan**.

**11:00 · Reading**  
Read sources, evidence, and existing material → **Reading Result**.

**13:00 · Analysis**  
Turn the reading result into claims, disagreements, boundary conditions, and open questions → **Research Object**.

**15:00 · Production**  
Turn the Research Object into a formal report or article candidate, with evidence checks and required visualization → **Publication Candidate**.

**20:00 · Publication**  
Publish only when the candidate satisfies the release conditions → **GitHub + Website + Commit Verify + Release**. If human authority is required, the workflow stops at that boundary instead of publishing autonomously.

```text
09:00 Discovery → Signal Pool
10:00 Queue → Today's Research Plan
11:00 Reading → Reading Result
13:00 Analysis → Research Object
15:00 Production → Publication Candidate
20:00 Publication → GitHub + Website + Commit Verify + Release
```

That is SaaW in concrete form: **software is not merely answering a question; it is performing a day's work on a governed schedule.**'''

pattern_en = r'### A Day in the Life of Research Report Production Engine V1\.3[\s\S]*?(?=\n\n---\n\n## 9\. CodeFlowMu:)'
e, n = re.subn(pattern_en, e_new, e, count=1)
if n != 1:
    raise SystemExit(f'English workday section replacement count={n}')

zh.write_text(z, encoding='utf-8')
en.write_text(e, encoding='utf-8')
