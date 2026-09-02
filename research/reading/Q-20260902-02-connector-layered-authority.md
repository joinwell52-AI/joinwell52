# Q-20260902-02 — Connector Calls Need Layered Authority

- Runtime date: 2026-09-02 (Asia/Shanghai)
- Queue signal: SIG-20260902-001
- Primary sources: OpenAI Epic plugin documentation and healthcare release; Microsoft Copilot Studio Entra Agent ID documentation; OpenAI Codex current implementation evidence
- Evidence level: `official_product_docs_plus_primary_code`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

Which distinct authority identities must be bound before an enterprise-agent connector call may execute, and which layers must be revalidated at call time rather than inferred from an Installed/Enabled state?

## Cross-sample Evidence

### OpenAI Epic integration

OpenAI's official Epic plugin documentation separates organizational availability, workspace/plugin setup, organization-specific EHR app configuration, each clinician's own Epic sign-in, approved OAuth scopes, and the clinician's pre-existing patient-chart permissions. Installing or making the plugin available does not connect a user's Epic account and does not expand existing Epic permissions. The integration is documented as read-only and cannot override patient-chart permissions.

This is direct evidence that **administrative enablement, account connection, granted scopes, and target-resource permission are different layers**.

Primary sources:
- https://help.openai.com/articles/20001490-using-the-epic-plugin-with-chatgpt-and-codex
- https://openai.com/index/chatgpt-connects-health-records-and-healthcare-sources/

### Microsoft Copilot Studio / Entra Agent ID

Microsoft documents that published Copilot Studio agents receive connector API permissions on their Entra Agent ID describing configured connector access. These scopes are mediated by the Power Platform connector runtime and are revalidated at runtime against Advanced Connector Policies and DLP. Microsoft also explicitly distinguishes configured connector scope from raw resource permissions and notes channel-specific limits on current Conditional Access enforcement.

This is direct evidence that **declared/configured capability scope and runtime policy authorization are not the same proposition**.

Primary source:
- https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-use-entra-agent-identities

### OpenAI Codex Apps/MCP implementation

Current OpenAI Codex code feeds connector identity, selected `link_id`, tool identity, and tool annotations into application-tool policy evaluation before an Apps/MCP call. The current implementation carries `link_id` in MCP tool-call metadata and evaluates policy against that selected link, rather than treating connector/tool identity alone as the whole approval scope.

Primary implementation source:
- https://github.com/openai/codex/blob/eb10d91e48ccbd0930427461fb392337addb1ac0/codex-rs/core/src/mcp_tool_call.rs

## Comparative Mechanism

Across the three samples, a useful bounded decomposition is:

1. **Administrative availability** — whether an app/connector is allowed or published for a workspace/agent.
2. **Agent capability identity** — which connector/actions the agent is configured to use.
3. **Principal/account identity** — which human/service/account link is acting.
4. **Target-resource authority** — what that principal may access in the external system.
5. **Runtime policy decision** — whether this occurrence is allowed under current governance constraints.
6. **Effect evidence** — what the external provider actually accepted or returned.

The samples implement different subsets and technologies; they should not be treated as one common protocol. The cross-sample conclusion is architectural: an Installed/Enabled flag is insufficient to establish all of these propositions.

## Negative Evidence and Limits

OpenAI's product documentation proves documented setup and permission boundaries, not that every connector call has a universally identical authorization path. Microsoft documents runtime revalidation but also states current Conditional Access enforcement limits across channels. Codex code is evidence about that implementation revision, not a portable MCP specification or a proof of end-to-end provider authorization.

None of these sources by itself proves exactly-once effects, immutable audit history, complete credential isolation, or universal revocation semantics. External-system permissions can also change after installation or publication, which is precisely why call-time revalidation matters where the platform supports it.

## Reading Conclusion

Enterprise connector authority is layered. Administrative enablement can make a capability available, but execution should bind the current agent/tool capability, acting principal or selected account, target-resource permission, applicable runtime policy, and—when effects matter—external effect evidence. Analysis may use this as a bounded architecture object; it must not convert vendor release language into claims of complete end-to-end authorization.
