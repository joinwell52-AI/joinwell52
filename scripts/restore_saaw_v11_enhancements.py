from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
ZH = ROOT / "docs/zh/industry/2026-08-10-saaw-software-as-an-agent-worker.md"
EN = ROOT / "docs/en/industry/2026-08-10-saaw-software-as-an-agent-worker.md"

zh = ZH.read_text(encoding="utf-8")
en = EN.read_text(encoding="utf-8")

# Remove any earlier experimental enhancement blocks before inserting the final wording.
zh = re.sub(
    r"\n### 一个数字员工的一天：.*?(?=\n---\n\n## 9\.)",
    "",
    zh,
    flags=re.S,
)
zh = re.sub(
    r"\n### 现实工程锚点：.*?(?=\n---\n\n## 16\.)",
    "",
    zh,
    flags=re.S,
)
zh = re.sub(
    r"\n### (?:What exists today / What comes next|已验证（Today）).*?(?=\n这就是 CodeFlowMu 正在探索的方向。)",
    "\n",
    zh,
    flags=re.S,
)

en = re.sub(
    r"\n### A Day in the Life of .*?(?=\n---\n\n## 9\.)",
    "",
    en,
    flags=re.S,
)
en = re.sub(
    r"\n### A Real Engineering Anchor:.*?(?=\n---\n\n## 16\.)",
    "",
    en,
    flags=re.S,
)
en = re.sub(
    r"\n### What Exists Today.*?(?=\nThat is the direction CodeFlowMu is exploring\.)",
    "\n",
    en,
    flags=re.S,
)

DAY_ZH = r'''

### 一个数字员工的一天：Research Report Production Engine V1.3

如果只看“数字员工”的定义，读者很容易把它理解成一个更聪明的聊天机器人。更直接的理解方式，是看看一个已经运行的研究型数字员工如何完成一天的工作。

当当天的研究任务进入执行窗口时，**Research Report Production Engine V1.3** 首先接收研究问题，并把它转化为明确的研究对象与工作状态。它不是立即生成一篇文章，而是先进入证据与阅读阶段：检索、读取和整理来源，记录能够支持哪些判断、还缺哪些证据。证据不足时，系统应该留下缺口，而不是用语言流畅度把缺口掩盖掉。

随后进入分析阶段。已有证据被组织成论点、反论点、边界条件和待验证问题，再形成结构化报告。此时的 Report 仍不是“可以发布的文章”，它必须经过 Evidence Gate：关键判断是否有证据支撑，引用是否可以回溯，事实与推断是否被区分，图表是否与正文一致。只有通过这些检查，才进入可视化和出版准备。

需要人类承担责任的地方不会被自动化吞掉。重要发布进入 **Human at the Authority Boundary**：人类看到报告、证据状态、风险和待决项，决定批准、驳回或要求修订。获得授权之后，Publication 才成为正式结果；如果运行中断，系统依据持久化工作事实恢复，而不是要求原来的模型会话“记得刚才做到哪里”。

把这一天压缩成一条工作链，就是：

```text
TASK → ACCEPTANCE → EVIDENCE / READING → ANALYSIS → REPORT
     → EVIDENCE GATE → HUMAN DECISION → PUBLICATION → ARCHIVE
```

这时 SaaW 就不再只是一个哲学概念。它像一个真正正在工作的研究员工：领取任务、使用技能、积累证据、提交成果、接受审查，在授权边界等待人类决定，然后继续完成工作。
'''

ANCHOR_ZH = r'''

### 现实工程锚点：这篇 SaaW 宣言本身就是案例

这里存在一个很重要的递归关系。

我们不是先写一篇文章宣称 SaaW 存在，再寻找一个虚构案例证明它。**我们用已经运行的 Research Report Production Engine V1.3 来解释 SaaW，而这篇 SaaW 宣言本身，又成为这台研究生产机所管理、审查和发布的研究成果。**

研究生产链可以写成：

```text
Research Question → Research Object → Evidence / Reading → Analysis
                  → Report → Evidence Gate → Visualization
                  → Human Authorization → Publication
```

而把同一条链换成 SaaW 的语言，就是：

```text
角色 → 工作流 → Skill → 工作状态 → 工作证据
    → 治理 → 人类授权 → 工作结果
```

两条链描述的不是两套系统，而是同一个事实：软件开始在明确职责、证据规则和授权边界下承担持续工作。

> **这不是 AI 写作工具，而是一个受治理的研究型数字员工。**  
> **This is not an AI writing tool. It is a governed research worker.**
'''

STATUS_ZH = r'''

### 已验证（Today）

为了不把研究方向包装成已经完成的产品能力，需要把今天已经存在的工程事实单独列出来：

- FCoP 的文件驱动生命周期、任务移交、报告与问题机制；
- PM / DEV / QA / OPS 四角色 Agent 的实际协作闭环；
- `Report`、`Review`、`Decision` 以及人类审批链路；
- PWA 人类控制面与待决事项处理；
- 运行中断后的恢复治理；
- TMPA Reader、规范测试与工作事实重构；
- CodeFlowMu 的真实工程协作案例；
- Research Report Production Engine V1.3 从研究任务到受治理发布的生产链路。

### 正在探索（Next）

仍处在研究、标准化或更大规模工程验证阶段的包括：

- 数字员工包（Digital Employee Package）的标准化；
- Agent PC 的标准化；
- 面向具体岗位的工作运行体；
- 从遗留系统与企业证据中提取候选 SOP；
- 从元开发运行体到领域数字员工运行体的转换；
- 受治理的 Self-Morphing 闭环。

这个区分不是保守，而是可信度的一部分：**已经验证的能力用证据说话，正在探索的能力保留为研究命题。** Self-Morphing 的意义，也正因为它建立在已经存在的治理、恢复、工作事实与工程运行能力之上。
'''

DAY_EN = r'''

### A Day in the Life of Research Report Production Engine V1.3

The fastest way to understand a digital employee is not to imagine a smarter chatbot, but to watch a governed research worker complete its work.

When a research task enters an execution window, **Research Report Production Engine V1.3** accepts the research question and turns it into an explicit research object and work state. It does not jump directly to prose generation. It first enters Evidence / Reading: locating, reading, and organizing sources, recording what each source supports and where evidence is still missing. A missing fact remains a gap instead of being hidden by fluent language.

Analysis then turns evidence into claims, counterclaims, boundary conditions, and open questions. A structured Report follows, but that Report is not yet publication. It must pass an Evidence Gate: important claims need traceable support, citations must be recoverable, fact and inference must remain distinguishable, and visualizations must agree with the text.

Human responsibility is not automated away. Important publication crosses **Human at the Authority Boundary**. A human reviews the report, evidence state, risks, and unresolved items, then approves, rejects, or requests revision. Only after authorization does Publication become a formal work outcome. If runtime execution is interrupted, the system resumes from persistent work facts rather than depending on the original model session to remember its place.

The work chain is therefore:

```text
TASK → ACCEPTANCE → EVIDENCE / READING → ANALYSIS → REPORT
     → EVIDENCE GATE → HUMAN DECISION → PUBLICATION → ARCHIVE
```
'''

ANCHOR_EN = r'''

### A Real Engineering Anchor: The SaaW Manifesto Is Part of the Case

There is a useful recursive relationship here.

We are not writing a manifesto that claims SaaW exists and then inventing an example to justify it. **We use the operating Research Report Production Engine V1.3 to explain SaaW, while this SaaW Manifesto itself becomes a research artifact managed, reviewed, and published through that production system.**

```text
Research Question → Research Object → Evidence / Reading → Analysis
                  → Report → Evidence Gate → Visualization
                  → Human Authorization → Publication
```

The same path expressed as a SaaW worker model is:

```text
Role → Workflow → Skills → Work State → Evidence
     → Governance → Human Authority → Work Outcome
```

> **This is not an AI writing tool. It is a governed research worker.**
'''

STATUS_EN = r'''

### What Exists Today

The boundary between engineering fact and research frontier should remain explicit. Validated capabilities include:

- FCoP file-driven lifecycle, handoff, reports, and issues;
- real PM / DEV / QA / OPS multi-Agent collaboration loops;
- `Report`, `Review`, `Decision`, and human approval paths;
- the PWA human control plane and pending-decision handling;
- recovery governance after runtime interruption;
- TMPA Reader, specification tests, and reconstruction of work facts;
- real CodeFlowMu engineering cases;
- the Research Report Production Engine V1.3 research-to-governed-publication workflow.

### What Comes Next

Still under research, standardization, or broader engineering validation are:

- standardized Digital Employee Packages;
- standardized Agent PC;
- role-specific Work Runtimes;
- Candidate SOP extraction from legacy systems and enterprise evidence;
- Meta-Development Runtime → Domain Worker Runtime transformation;
- governed Self-Morphing.

This distinction is part of the credibility of the architecture: **validated capability should be stated with evidence, while frontier capability should remain a research proposition.**
'''

# Insert the real-work-day block at roughly the first third of the manifesto.
marker_zh_9 = "\n## 9. CodeFlowMu：TMPA 从理论进入运行世界"
if marker_zh_9 not in zh:
    raise RuntimeError("Chinese section 9 marker not found")
zh = zh.replace(marker_zh_9, DAY_ZH + "\n\n---\n" + marker_zh_9, 1)

marker_en_9 = "\n## 9. CodeFlowMu: Bringing TMPA into the runtime world"
if marker_en_9 not in en:
    raise RuntimeError("English section 9 marker not found")
en = en.replace(marker_en_9, DAY_EN + "\n\n---\n" + marker_en_9, 1)

# Restore the real engineering anchor immediately before Self-Morphing.
marker_zh_16 = "\n## 16. Self-Morphing：当代码库开始“自己开发自己”"
if marker_zh_16 not in zh:
    raise RuntimeError("Chinese section 16 marker not found")
zh = zh.replace(marker_zh_16, ANCHOR_ZH + "\n\n---\n" + marker_zh_16, 1)

marker_en_16 = "\n## 16. Self-Morphing: When the codebase begins to “develop itself”"
if marker_en_16 not in en:
    raise RuntimeError("English section 16 marker not found")
en = en.replace(marker_en_16, ANCHOR_EN + "\n\n---\n" + marker_en_16, 1)

# Put the Today / Next boundary inside the final section, before the final declaration.
needle_zh = "一个过去不存在的软件生命周期开始形成。\n\n"
if needle_zh not in zh:
    raise RuntimeError("Chinese final lifecycle marker not found")
zh = zh.replace(needle_zh, needle_zh + STATUS_ZH + "\n\n", 1)

needle_en = "A software lifecycle that did not previously exist begins to emerge.\n\n"
if needle_en not in en:
    raise RuntimeError("English final lifecycle marker not found")
en = en.replace(needle_en, needle_en + STATUS_EN + "\n\n", 1)

# Chinese publication-language cleanup: keep technical names, translate ordinary prose.
zh_replacements = {
    "summary: \"从治理、TMPA、FCoP、Agent PC、CodeFlowMu、Self-Morphing 与数字员工运行体系推导 SaaW：软件从工具与服务走向可治理的数字工作主体。\"":
        "summary: \"从治理、TMPA、FCoP、Agent PC、CodeFlowMu 与 Self-Morphing 推导 SaaW，并以 Research Report Production Engine V1.3 作为真实工程锚点，区分已验证能力与研究前沿。\"",
    "evidence_status: \"Architecture-grounded\"":
        "evidence_status: \"Architecture-grounded + production-engine reference implementation\"",
    "## 5. Single-Writer：责任必须有明确来源": "## 5. 单写者（Single-Writer）：责任必须有明确来源",
    "## 7. Issue Set：不要隐藏冲突": "## 7. 问题集（Issue Set）：不要隐藏冲突",
    "## 8. Recoverability：数字员工必须能够“醒来继续工作”": "## 8. 可恢复性（Recoverability）：数字员工必须能够“醒来继续工作”",
    "## 14. CodeFlowMu 的第二形态：Meta-Development Runtime": "## 14. CodeFlowMu 的第二形态：元开发运行体（Meta-Development Runtime）",
    "## 15. Digital Employee Package：让数字员工成为可工程化产品": "## 15. 数字员工包（Digital Employee Package）：让数字员工成为可工程化产品",
    "## 17. 从 Development Runtime 到 Work Runtime": "## 17. 从开发运行体到工作运行体",
    "它可以使用 Browser、API、CLI、Script、MCP、企业内部服务和受控自动化接口。":
        "它可以使用浏览器、API、CLI、脚本、MCP、企业内部服务和受控自动化接口。",
    "但真实企业系统并不是简单的 CRUD。": "但真实企业系统并不是简单的增删改查（CRUD）。",
    "  ├── Browser\n  ├── CLI\n  ├── Hook\n  └── 受控自动化\n        │\n        ▼\nExisting ERP / CRM / Business System":
        "  ├── 浏览器\n  ├── CLI\n  ├── 受控 Hook\n  └── 受控自动化\n        │\n        ▼\n既有 ERP / CRM / 业务系统",
}
for old, new in zh_replacements.items():
    zh = zh.replace(old, new)

# Make internal manifesto slogans visually strong without polluting the document outline.
def normalize_h1(text: str) -> str:
    out = []
    first_h1_seen = False
    for line in text.splitlines():
        if line.startswith("# "):
            if not first_h1_seen:
                first_h1_seen = True
                out.append(line)
            else:
                out.append(f"> **{line[2:].strip()}**")
        else:
            out.append(line)
    return "\n".join(out) + "\n"

zh = normalize_h1(zh)
en = normalize_h1(en)

# English copy cleanup: keep concepts, remove unnecessary title-like H1 interruptions.
en = en.replace(
    "In SaaS, the human is often the Operator.\n\nIn SaaW, the human increasingly becomes the Supervisor / Authorizer.",
    "In SaaS, humans usually remain in the operation layer.\n\nIn SaaW, humans increasingly move to supervision and final authorization.",
)

# Structural verification: exactly 23 numbered major sections, required V1.1 additions, no AR detour.
def verify(label: str, text: str, required: list[str]) -> None:
    nums = [int(n) for n in re.findall(r"^## (\d+)\.", text, flags=re.M)]
    if nums != list(range(1, 24)):
        raise RuntimeError(f"{label}: expected numbered sections 1..23, got {nums}")
    for item in required:
        if item not in text:
            raise RuntimeError(f"{label}: required text missing: {item}")

verify(
    "Chinese",
    zh,
    [
        "### 一个数字员工的一天：Research Report Production Engine V1.3",
        "### 现实工程锚点：这篇 SaaW 宣言本身就是案例",
        "### 已验证（Today）",
        "### 正在探索（Next）",
        "企业证据 → 候选 SOP → 验证 → 受治理工作流",
        "Human at the Authority Boundary",
        "这不是 AI 写作工具，而是一个受治理的研究型数字员工。",
    ],
)
verify(
    "English",
    en,
    [
        "### A Day in the Life of Research Report Production Engine V1.3",
        "### A Real Engineering Anchor: The SaaW Manifesto Is Part of the Case",
        "### What Exists Today",
        "### What Comes Next",
        "Enterprise Evidence → Candidate SOP → Validation → Governed Workflow",
        "Human at the Authority Boundary",
        "This is not an AI writing tool. It is a governed research worker.",
    ],
)

if "应收账款" in zh or "Accounts Receivable" in en:
    raise RuntimeError("obsolete Accounts Receivable example is still present")
if re.search(r"\bOperator\b|Supervisor / Authorizer", zh):
    raise RuntimeError("unnecessary English role wording remains in Chinese copy")

ZH.write_text(zh, encoding="utf-8")
EN.write_text(en, encoding="utf-8")

print("SaaW V1.1 body polish complete")
print("Chinese numbered sections:", len(re.findall(r"^## \d+\.", zh, flags=re.M)))
print("English numbered sections:", len(re.findall(r"^## \d+\.", en, flags=re.M)))
