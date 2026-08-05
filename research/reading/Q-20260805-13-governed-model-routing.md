# Reading Record — Q-20260805-13 Governed task-aware model routing for enterprise Agent runtimes

- **Queue item:** `Q-20260805-13`
- **Column:** Industry Architecture
- **Selection status:** Selected
- **Priority:** P1
- **Skill invoked:** `Skill 03 — Deep Reading`
- **Operating date:** 2026-08-05 (Asia/Shanghai)
- **Primary source class:** Cursor official changelog and announcement, supported by official enterprise-control and model-retirement sources

## Reading scope

This pass reads Cursor Router as a disclosed enterprise model-routing surface, then checks its governance claims against official model-access, managed-settings and retirement evidence. It records what the sources establish and what remains undisclosed. It does not recommend a routing architecture or rank vendors.

## Deep Reading output

```yaml
reading_notes:
  problem:
    - An enterprise Agent runtime may have many eligible models whose quality, price, latency and availability differ by task.
    - Automatic selection becomes a governance problem when a router can override user choice, hide the routed model or encounter a model retirement.
    - The selected question is which routing inputs and controls are disclosed, how policy is enforced and what audit, fallback and migration behavior remains unknown.

  facts:
    - Cursor Auto mode is powered by Cursor Router and performs per-request classification by task type and complexity.
    - The disclosed optimization modes are Intelligence, Balance and Cost.
    - Intelligence targets frontier quality; Balance targets strong everyday quality; Cost targets the highest available intelligence while optimizing token expenditure.
    - Balance and Intelligence bill at the routed model's rate.
    - Administrators can enable the router by team or group, restrict modes, set a default mode and allow or block underlying models.
    - Cursor exposes soft and hard enforcement for standardizing on Auto.
    - The routed model can be displayed or hidden and is hidden by default.
    - Router availability spans desktop, web, iOS, CLI and SDK; Teams enables it by default, while Enterprise administrators enable it from the dashboard.
    - The changelog identifies Grok 4.5 as a required price-efficient routing option.

  vendor_claims:
    - Cursor describes the system as sending each request to the right model for the job.
    - Cursor's announcement reports approximately 30–50 percent lower cost in early enterprise access and up to roughly 60 percent savings over millions of routed requests while preserving frontier-quality results.
    - Cost, Balance and Intelligence are described as positions on a cost-intelligence Pareto frontier.

  mechanisms:
    - A request is first classified by task type and complexity, after which the chosen optimization mode constrains model selection.
    - Enterprise policy can narrow the usable optimization modes and underlying model pool.
    - Team or group enablement and a default mode provide administrative rollout controls.
    - Model allow/block lists provide a policy boundary below the router rather than relying only on the router's preference.
    - Soft or hard Auto enforcement controls whether standardization is advisory or mandatory.
    - Display or hiding of the routed model changes the amount of per-request information visible to the user.

  evidence:
    - Cursor's official changelog enumerates the classification inputs, optimization modes, billing behavior, administrative controls, deployment surfaces and display default.
    - Cursor's official model-access controls allow administrators to permit or block providers and models and to block newly introduced models by default.
    - GitHub's official managed-settings documentation provides a comparison point: enterprise-managed values take precedence over supported user-local settings and refresh at authentication or about hourly.
    - OpenAI's official release notes show that model retirement still creates an operator migration obligation across workspace defaults, managed configurations, custom Agents and scheduled tasks.
    - Microsoft Copilot Studio documentation provides a separate enterprise-platform comparison with orchestration, reusable skills, memory and computer-control surfaces, but several capabilities are preview or rollout-dependent.

  limitations:
    - Cursor does not disclose the classifier features, confidence score, routing model, per-model eligibility rules or decision thresholds.
    - The sources do not publish reproducible benchmark design, task mix, confidence intervals or route-error rates for the cost and quality claims.
    - The behavior when the allowed model pool cannot satisfy a mode's requirements is not specified.
    - Fallback ordering, outage handling, latency budgets and retry behavior are not disclosed.
    - The precise precedence among enterprise policy, team/group settings, mode restrictions, model allow/block lists and user choice is not fully documented on the Router page.
    - Hiding the routed model by default reduces user-visible traceability; the source does not describe an immutable per-request audit record.
    - The sources do not establish automatic retirement-aware migration or prove that saved tasks and custom Agents are rewritten safely when models disappear.
    - Availability defaults differ between Teams and Enterprise and may change during rollout.

  comparisons:
    - Cursor Router combines optimization and policy controls in one Auto-selection surface; GitHub managed settings demonstrates a more explicit precedence rule for supported enterprise values over local configuration.
    - OpenAI's retirement notice shows that a routing layer does not remove the need to locate and migrate durable model references in defaults, managed settings, Agents and schedules.
    - Copilot Studio exposes orchestration, skills, memory and computer control as separate platform capabilities; this is broader than model routing and does not prove equivalent policy precedence.
    - A visible routed-model label supports user traceability, while the default hidden state prioritizes abstraction over direct disclosure.

  contradictions:
    - The phrase "right model for the job" is a vendor claim because the public sources do not disclose an independently reproducible correctness criterion.
    - "Frontier quality" and reported cost savings are not accompanied by a public evaluation protocol sufficient for independent validation.
    - Admin allow/block controls bound the eligible pool, but the changelog's requirement for a specific price-efficient model implies that policy restrictions can reduce or disable intended routing behavior.
    - Automatic routing simplifies per-request choice, while model retirement evidence shows that durable configuration migration remains an explicit operational responsibility.

  unresolved_questions:
    - What is the complete policy-precedence order when enterprise, group, team, user and router preferences conflict?
    - What happens when every model eligible for the selected mode is blocked, unavailable, over budget or retired?
    - Which route-decision facts are logged: classified task type, complexity, candidate set, excluded models, selected model, price estimate and fallback reason?
    - Can a regulated organization require routed-model disclosure and immutable route evidence for every request?
    - How are route-quality regressions detected when model versions or prices change?
    - How are scheduled tasks and custom Agents migrated without silently changing capability or cost semantics?
```

## Source traceability

1. Cursor Router official changelog: `https://cursor.com/changelog/router`
2. Cursor Router official announcement: `https://cursor.com/blog/router`
3. Cursor official model-access controls: `https://cursor.com/changelog/05-04-26`
4. Cursor enterprise organization controls: `https://cursor.com/docs/account/teams/enterprise-organizations`
5. GitHub enterprise managed-settings GA: `https://github.blog/changelog/2026-07-01-enterprise-managed-settings-json-is-generally-available/`
6. GitHub enterprise managed settings across Copilot app and cloud Agent: `https://github.blog/changelog/2026-07-27-enterprise-managed-settings-now-apply-to-the-github-copilot-app/`
7. OpenAI product release notes for Codex model retirement: `https://openai.com/products/release-notes/`
8. Microsoft Copilot Studio What's New: `https://learn.microsoft.com/en-us/microsoft-copilot-studio/whats-new`
9. Today's Research Plan: `research/runtime/plans/2026/08/2026-08-05-plan.json`

## Reading gate decision

**Result:** Deep Reading completed. The disclosed routing surface and its evidence gaps are now traceable for a later Analysis shift. No enterprise architecture recommendation, vendor comparison verdict or publication draft was produced.
