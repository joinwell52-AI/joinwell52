---
title: "Configuration Precedence Needs Provenance"
date: '2026-08-16'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should an SDK expose a raw configuration escape hatch for values its structured serializer cannot represent while keeping effective configuration understandable and preventing accidental ownership inversion?"
summary: "Deterministic configuration order resolves which value wins; it does not explain who supplied that value or whether that layer was authorized to control it. Raw escape hatches are safer when they sit inside an explicit precedence chain and effective security-relevant values retain observable provenance."
sources:
  - research/analysis/Q-20260816-03-config-precedence-provenance.md
item_id: "Q-20260816-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-16-config-precedence-provenance-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-16-config-precedence-provenance-cover.png"
  kicker="Open-source Engineering · Daily Research"
  title="Configuration Precedence Needs Provenance"
  summary="Deterministic configuration order resolves which value wins; it does not explain who supplied that value or whether that layer was authorized to control it. Raw escape hatches are safer when they sit inside an explicit precedence chain and effective security-relevant values retain observable provenance."
  version="Q-20260816-03"
  status="Daily Runtime V5 · 2026-08-16"
  languageHref="/zh/engineering/2026-08-16-config-precedence-provenance"
  languageLabel="中文"
/>

# Configuration Precedence Needs Provenance

Structured SDK configuration is useful because it gives callers typed, documented controls. It is also inevitably incomplete. Some downstream configuration shapes are too dynamic, too new, or too literal to fit a serializer cleanly. A raw override channel can close that expressiveness gap, but it creates a second question: when several configuration layers specify the same key, who actually owns the effective value?

The 2026-08-16 Research Object examined a merged Codex TypeScript SDK change that adds ordered raw `configOverrides`. The SDK forwards those overrides unchanged after structured configuration and preserves caller order, including duplicate keys. SDK-managed settings are emitted later, and thread- or run-specific settings later still. The resulting observed precedence is explicit and testable. It is not, however, a security guarantee.

## Deterministic order solves conflict, not meaning

The selected mechanism has an important virtue: it does not create a hidden second merge engine. One observable command-line sequence determines precedence.

For overlapping keys, the observed order is:

**structured global configuration < ordered raw overrides < SDK-managed settings < thread/run-specific settings**.

That means a raw application-level escape hatch can express values the structured serializer cannot represent while later execution-owned settings retain the ability to override it. This is a useful ownership boundary. Raw expressiveness does not automatically become absolute authority.

Preserving duplicate raw keys is also semantically honest. The SDK passes the caller's sequence to the downstream parser instead of silently inventing its own deduplication rule. The cost is that inspection becomes more important: operators need to understand which occurrence became effective.

The feature is partly motivated by literal TOML forms such as permission maps. Reinterpreting those keys through a generic serializer could change their meaning. Raw passthrough preserves syntax faithfully. But faithful transport says nothing about whether the supplied value is safe, authorized, or valid for a particular deployment.

## Provenance is the missing half of configuration governance

Precedence answers **which value wins**. Operational governance also needs to answer **where that value came from**.

When configuration affects sandboxing, approvals, network access, permissions, or other security-sensitive behavior, an effective value should ideally carry a trace: which layer supplied it, what earlier values it replaced, which later layer overrode it, and whether the source layer was authorized to control that key.

Without that provenance, deterministic order can still be hard to audit. A final command may reveal the resulting sequence, but reconstructing ownership from that sequence becomes increasingly difficult as systems add global defaults, raw application overrides, SDK-managed controls, thread configuration, run overrides, environment policy, and remote administration.

This does not mean every SDK needs a complex policy engine. A machine-readable effective-config trace can remain observational. It can expose source layer and precedence while leaving authorization decisions to a surrounding control plane.

## Raw passthrough should not become a privilege channel

An escape hatch is defensible when its scope is explicit. In developer tooling, broad raw access may be appropriate. In a security-sensitive deployment, the same channel may need a narrower key policy, explicit review, or audit treatment.

The important distinction is between expression and privilege. A caller may need a raw syntax channel because the serializer cannot represent a literal structure. That requirement does not imply that the caller should be allowed to override every setting owned by later execution stages.

The selected ordering already preserves one useful boundary by placing SDK-managed and thread/run-specific settings after raw overrides. Systems can strengthen that model by documenting ownership per key family and surfacing provenance for the effective configuration.

Duplicate keys also deserve context rather than blanket rejection. Repetition can be a legitimate CLI technique. For security-relevant settings, however, duplicates should at least be visible to audit tooling so an operator can see why the final value won.

## Limits of the evidence

The evidence is scoped to Codex TypeScript SDK command construction and regression tests. It does not establish the same precedence for other SDKs or direct CLI use. The selected change does not add semantic validation for arbitrary raw TOML, signing, policy review, or provenance tracing.

The proposed effective-config trace is therefore an engineering interpretation, not a feature established by the patch.

## Open questions

Which keys should a raw application-level channel be allowed to control in security-sensitive deployments? Can an SDK expose effective-config provenance without leaking secrets? Should duplicate security-sensitive raw keys trigger warnings, rejection, or simply stronger audit evidence?

A deterministic chain is necessary because configuration conflicts must resolve predictably. Provenance is what makes that predictability explainable.
