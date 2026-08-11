# Q-20260811-02 — Restaurant reservation availability creates a governed action handoff boundary

- Runtime date: 2026-08-11
- Column: Industry Architecture
- Source object: Q-20260811-02 / SIG-20260811-P-001
- Primary sources:
  - https://help.openai.com/en/articles/6825453-chatgpt-release-notes
  - https://help.openai.com/en/articles/9237897-chatgpt-search
- Evidence class: Vendor Claim / product fact from official OpenAI documentation
- Stage: Skill 03 Deep Reading only

## Problem

Restaurant recommendations are informational until the assistant grounds them in live availability and connects the user to a booking action. The architecture question is where recommendation ends, where externally sourced state enters, and where authority shifts from ChatGPT to a third-party reservation provider.

## Facts

1. OpenAI's August 10, 2026 release notes state that ChatGPT can show restaurant reservation availability from OpenTable, Resy, and Yelp.
2. The documented input can include location, desired date/time, party size, cuisine, budget, dietary needs, and atmosphere.
3. Available reservation times can appear directly in the response, and users can narrow results or ask about a specific restaurant.
4. The release notes say a user can select a time that works to book it.
5. The rollout covers ChatGPT plans on mobile, web, and desktop. OpenTable availability is described as global; Resy is available in the United States; Yelp is available in the United States and Canada.
6. ChatGPT Work is explicitly excluded from restaurant reservation search in the release note.
7. The ChatGPT Search help article states that restaurant results can expose a Reserve button only when ChatGPT can match the restaurant to a supported third-party reservation listing.
8. Selecting Reserve opens a reservation flow. In some experiences ChatGPT may prefill details from the prompt, including party size, date, or time, but the user can choose or adjust the details before placing the reservation.
9. The help article instructs the user to confirm reservation details before booking because availability can change and not every restaurant or provider is supported.
10. After a reservation is placed, ChatGPT does not save the reservation. The confirmation record is delivered by the third-party restaurant provider.
11. Existing reservations cannot be cancelled, modified, or found in ChatGPT; those operations are handled through the reservation provider.
12. Support responsibility is split: OpenAI Support covers ChatGPT restaurant-result and Reserve-button behavior; booking confirmation, cancellation, modification, and partner-account problems belong to the third-party reservation provider.

## Mechanisms

### Externally grounded availability

The assistant is not merely ranking restaurants from static metadata. When availability is shown, the time slots are sourced from supported reservation providers for a specific date, time, and party size. This introduces externally owned, time-sensitive state into the assistant response.

### Match gate before action surface

The Reserve action is conditional. It appears only when ChatGPT can match the restaurant to a supported provider listing. Therefore recommendation and action eligibility are separate states: a restaurant can be recommendable without being bookable through the integrated flow.

### User-confirmed handoff

Selecting Reserve opens a reservation flow, with some details optionally prefilled. The user remains responsible for reviewing or changing date, time, party size, and related fields before placing the reservation. The product documentation does not establish an autonomous booking action performed silently by ChatGPT.

### Split system of record

ChatGPT can surface availability and initiate the booking flow, but it does not retain the booked reservation as the authoritative post-booking record. Confirmation, later modification, and cancellation live with the third-party provider. This is a clear ownership boundary between assistant-side orchestration and provider-side transaction state.

### Product-surface governance

The release is available on ChatGPT mobile, web, and desktop but excludes ChatGPT Work. The action capability is therefore intentionally governed by product surface rather than assumed to exist wherever the same model can answer restaurant questions.

## Evidence

- The August 10, 2026 ChatGPT release note names OpenTable, Resy, and Yelp, documents direct availability display and regional/product-surface availability.
- The official ChatGPT Search help article documents the Reserve-button match gate, reservation-flow handoff, optional prefill, user confirmation, provider-owned confirmation record, and post-booking support boundary.

## Limitations

1. The sources describe product behavior, not the connector protocol, authentication model, API schema, cache policy, freshness SLA, or consistency guarantees used to obtain availability.
2. Availability is explicitly changeable, so a displayed time is not a durable booking guarantee until the booking flow confirms it.
3. Not every restaurant or provider is supported; absence of a Reserve button does not mean the restaurant has no reservations.
4. The release note phrase “select it to book it” does not by itself prove that ChatGPT is the transaction system of record. The help article clarifies that a reservation flow opens and the third-party provider owns the confirmation and lifecycle after booking.
5. The documentation does not specify whether every supported surface uses the same embedded versus external-app handoff UX.
6. The sources do not establish how duplicate booking attempts, payment/deposit requirements, provider login, consent, or cancellation fees are handled.
7. ChatGPT Work's exclusion demonstrates a capability boundary but the documentation does not explain the underlying governance reason.

## Comparisons

- **Recommendation-only assistant:** provides ranked restaurant options but has no live availability or action handoff.
- **Availability-aware assistant:** adds provider-grounded, time-sensitive reservation state while still leaving booking confirmation to an explicit user flow.
- **Transaction system of record:** would own reservation persistence, modification, cancellation, and confirmation history; the documented ChatGPT flow does not do this.

## Unresolved questions

1. What freshness contract applies to displayed availability, and is availability revalidated when the user enters the booking flow?
2. Which provider identity/account is authoritative when the same restaurant is available through more than one supported provider?
3. How is provider authentication handled without confusing ChatGPT identity with booking-provider identity?
4. What action receipt, if any, remains in ChatGPT after the user places the reservation, given that ChatGPT does not save the booking?
5. How are duplicate booking attempts or stale time-slot selections prevented?
6. What product-governance rule explains why ChatGPT Work does not expose restaurant reservation search while Chat does?

## Reading boundary

This note records the documented availability, handoff, user-confirmation, provider-ownership, and product-surface boundaries only. It does not decide how a general agent platform should model connector authority or transactional action governance; that belongs to Skill 04 Research Analysis.
