from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
zh_path = root / 'docs/zh/industry/2026-08-10-saaw-software-as-an-agent-worker.md'
en_path = root / 'docs/en/industry/2026-08-10-saaw-software-as-an-agent-worker.md'

zh = zh_path.read_text(encoding='utf-8')
en = en_path.read_text(encoding='utf-8')

# Final cover is a real JPEG, never an SVG wrapper.
cover = '/assets/covers/saaw-manifesto-cover-final.jpg?v=20260811-final'
for old in [
    '/assets/covers/saaw-manifesto-cover-hd.svg',
    '/assets/covers/saaw-manifesto-cover-approved.webp',
    '/assets/covers/saaw-manifesto-cover.svg?v=20260811-final',
    '/assets/covers/saaw-manifesto-cover.svg',
]:
    zh = zh.replace(old, cover)
    en = en.replace(old, cover)

# Remove any mistakenly introduced Accounts Receivable example.
zh = re.sub(r'\n### 一个数字员工的一天：应收账款数字员工.*?(?=\n---\n\n## 9\.)', '\n', zh, flags=re.S)
en = re.sub(r'\n### A Day in the Life of an Accounts Receivable Worker.*?(?=\n---\n\n## 9\.)', '\n', en, flags=re.S)

DAY_ZH = r'''

### 一个数字员工的一天：Research Report Production Engine V1.3

如果 SaaW 只停留在 Role、Workflow、Governance 这些概念上，读者很容易理解它，却很难真正“看见”一个数字员工如何工作。我们已经有一个不需要虚构的例子：**Research Report Production Engine V1.3**。它不是一个聊天框，也不是“让 AI 帮忙写文章”的工具，而是一条正在运行的、具有证据门和人类授权边界的研究生产链。

一天的工作可以从一个 Research Question 开始。系统首先把问题形成正式的 Research Object，并进入证据发现与阅读阶段。研究 Agent 不是直接生成结论，而是寻找来源、阅读材料、区分事实与推断，把可引用证据带入 Analysis。分析阶段如果发现证据不足、来源互相冲突，或者某个判断越过当前证据边界，流程不会为了“写完”而继续向前：它必须留下 Issue、补充阅读，或者等待新的研究输入。

当分析能够被证据支持，系统生成 Report，但 Report 还不是可以发表的结果。它必须经过 Evidence Gate：引用是否真的支持主张？关键结论是否存在悬空证据？研究边界有没有被夸大？不满足条件的内容被退回修订。通过证据门之后，系统再生成或校正 Visualization，把复杂关系变成可检查的图形表达。

最后一步不是“AI 自动发布”。Publication 位于明确的人类授权边界之后。主管看到报告、证据状态、图形和仍然存在的限制，作出 Human Authorization。批准之后，文章才成为正式发布事实；如果被驳回，数字员工从被要求修订的位置继续，而不是靠一个永不掉线的模型会话维持记忆。

这条链路可以被压缩成：

**TASK → ACCEPTANCE → ACTION → REPORT → ISSUE → HUMAN DECISION → CONTINUE → REVIEW → DONE**

更有意思的是，**这篇 SaaW Manifesto 本身就是这条生产链中的一个真实研究成果**。我们不是先写一篇文章宣称 SaaW 存在，再找一个虚构案例来证明它；我们用已经运行的研究报告生产机解释 SaaW，而 SaaW Manifesto 又反过来成为这台生产机所管理、审查和发布的研究对象。

> **这不是 AI 写作工具，而是一个受治理的研究型数字员工。**  
> **This is not an AI writing tool. It is a governed research worker.**
'''

ANCHOR_ZH = r'''

### 真实工程锚点：从研究生产到 SaaW 工作结构

Research Report Production Engine V1.3 之所以重要，不只是因为它能产出研究报告，而是因为它已经显露出 SaaW 所需要的结构对应关系：Research Question 对应岗位任务，Research Object 对应持续工作对象，Evidence / Reading 与 Analysis 对应受 Skill 和 Workflow 约束的执行过程，Report 与 Visualization 对应工作成果，Evidence Gate 对应治理与验证，Human Authorization 对应不可被 Agent 越过的人类授权边界，Publication 则对应最终 Work Outcome。

因此，SaaW 在这里不是给现有系统贴一个新标签。它是在总结一种已经出现的工程事实：**当软件拥有持续岗位、工作流、技能、状态、证据、治理和授权边界时，它开始从“提供功能”走向“承担工作”。**
'''

STATUS_ZH = r'''

### 已存在的能力 / 下一步研究（What exists today / What comes next）

为了不把研究方向包装成已经完成的产品能力，这里的边界必须明确。

**Today / 已验证：** FCoP 生命周期与文件化协作；PM / DEV / QA / OPS 四角色 Agent 协作；Report / Review / Decision 工作链；人类审批与 PWA 控制面；恢复治理；TMPA Reader、规范测试与工作事实重构；CodeFlowMu 的实际工程协作案例；以及 Research Report Production Engine V1.3 已经运行的研究、证据门、授权与发布链路。

**Next / 正在探索：** Digital Employee Package 标准化；Agent PC 标准化；岗位 Runtime；Legacy SOP Extraction；Meta-Dev Runtime 向 Domain Worker Runtime 的转换；以及受治理的 Self-Morphing 闭环。

这个区分不是保守，而是 SaaW 可信度的一部分：**已经验证的，就用公开规范、测试和运行证据说话；尚在探索的，就明确保留为研究命题。** Self-Morphing 的意义也因此更清楚——它不是一个已经完成的“无限自改”能力，而是建立在现有治理、恢复、工作事实和工程运行能力之上的下一阶段研究。
'''

DAY_EN = r'''

### A Day in the Life of Research Report Production Engine V1.3

If SaaW remains only a vocabulary of roles, workflows, and governance, readers can understand the idea without seeing a worker at work. We already have a non-fictional example: **Research Report Production Engine V1.3**. It is not a chat box and not an “AI writing assistant”; it is an operating research-production chain with evidence gates and a human authority boundary.

A workday can begin with a Research Question. The system turns it into a persistent Research Object and enters evidence discovery and reading. Research agents do not jump directly to conclusions: they locate sources, read them, separate facts from inference, and carry citable evidence into Analysis. If evidence is incomplete, sources conflict, or a claim exceeds the current evidence boundary, the workflow does not keep moving merely to finish a draft. It records an Issue, performs additional reading, or waits for new research input.

Once analysis is supportable, the system produces a Report, but that report is not yet a publishable outcome. It must pass an Evidence Gate: do citations actually support the claims, are there dangling assertions, and are research boundaries overstated? Failed material is returned for correction. After the evidence gate, Visualization turns complex relations into inspectable representations.

Publication is not an automatic AI action. It sits behind Human Authorization. A supervisor sees the report, evidence status, visualization, and remaining limitations, then authorizes publication or sends the work back to a precise correction point. Continuity comes from durable work facts, not from an immortal model session.

The chain can be compressed as:

**TASK → ACCEPTANCE → ACTION → REPORT → ISSUE → HUMAN DECISION → CONTINUE → REVIEW → DONE**

The recursive part is especially important: **this SaaW Manifesto is itself a real research output managed, reviewed, and published through that production process.** We are not declaring SaaW first and inventing a case afterward; we use an operating research-production engine to explain SaaW, while the manifesto itself becomes one of the engine's governed research objects.

> **This is not an AI writing tool. It is a governed research worker.**
'''

ANCHOR_EN = r'''

### A Real Engineering Anchor: From Research Production to the SaaW Worker Structure

Research Report Production Engine V1.3 matters not merely because it produces reports, but because its structure already maps onto the requirements of SaaW: Research Question maps to assigned work; Research Object to persistent work state; Evidence / Reading and Analysis to skill- and workflow-constrained execution; Report and Visualization to work products; Evidence Gate to validation and governance; Human Authorization to the authority boundary that an agent may not cross; and Publication to the final Work Outcome.

SaaW is therefore not a new label pasted onto an existing system. It names an engineering transition already becoming visible: **when software has a persistent role, workflow, skills, state, evidence, governance, and authority boundaries, it begins to move from providing functions to performing work.**
'''

STATUS_EN = r'''

### What Exists Today / What Comes Next

The boundary must remain explicit.

**Today / validated:** FCoP lifecycle and file-driven coordination; PM / DEV / QA / OPS four-role agent collaboration; Report / Review / Decision chains; human approval and the PWA control plane; recovery governance; TMPA Reader, specification tests, and reconstruction of work facts; real CodeFlowMu engineering cases; and the operating research, evidence-gate, authorization, and publication path of Research Report Production Engine V1.3.

**Next / under exploration:** standardized Digital Employee Packages; standardized Agent PC; role-specific runtimes; Legacy SOP Extraction; Meta-Dev Runtime → Domain Worker Runtime transformation; and governed Self-Morphing.

This distinction is part of SaaW's credibility: **validated capabilities should be stated with public specifications, tests, and runtime evidence; research frontiers should remain explicitly research frontiers.** Self-Morphing is therefore not a completed capability for unconstrained self-modification, but a next-stage research direction grounded in governance, recovery, persistent work facts, and runtime engineering that already exist.
'''

def insert_before(text, marker, block, sentinel):
    if sentinel in text:
        return text
    if marker not in text:
        raise RuntimeError(f'marker not found: {marker}')
    return text.replace(marker, block + '\n\n---\n' + marker, 1)

zh = insert_before(zh, '\n## 9. CodeFlowMu：TMPA 从理论进入运行世界', DAY_ZH, '### 一个数字员工的一天：Research Report Production Engine V1.3')
zh = insert_before(zh, '\n## 16. Self-Morphing：当代码库开始“自己开发自己”', ANCHOR_ZH, '### 真实工程锚点：从研究生产到 SaaW 工作结构')
zh = insert_before(zh, '\n## 23. 从 SaaS 到 SaaW', STATUS_ZH, '### 已存在的能力 / 下一步研究')

en_mark9 = next((m for m in ['\n## 9. CodeFlowMu:', '\n## 9. CodeFlowMu —'] if m in en), None)
en_mark16 = next((m for m in ['\n## 16. Self-Morphing:', '\n## 16. Self-Morphing —'] if m in en), None)
en_mark23 = next((m for m in ['\n## 23. From SaaS to SaaW', '\n## 23. From SaaS to SaaW:'] if m in en), None)
if not all([en_mark9, en_mark16, en_mark23]):
    raise RuntimeError('English section markers not found')
en = insert_before(en, en_mark9, DAY_EN, '### A Day in the Life of Research Report Production Engine V1.3')
en = insert_before(en, en_mark16, ANCHOR_EN, '### A Real Engineering Anchor: From Research Production')
en = insert_before(en, en_mark23, STATUS_EN, '### What Exists Today / What Comes Next')

zh_path.write_text(zh, encoding='utf-8')
en_path.write_text(en, encoding='utf-8')

# Structural assertions: retain exactly the original numbered 23 sections and only two in-body figures.
for label, text in [('zh', zh), ('en', en)]:
    numbered = re.findall(r'^## (\d+)\.', text, re.M)
    assert numbered == [str(i) for i in range(1, 24)], (label, numbered)
    assert text.count('saaw-governance-stack.svg') == 1, label
    assert text.count('saaw-self-morphing-loop.svg') == 1, label
    assert 'saaw-research-worker-loop' not in text, label
    assert 'Accounts Receivable' not in text and '应收账款数字员工' not in text, label
    assert cover in text, label

print('SaaW manifesto final content assertions: PASS')
