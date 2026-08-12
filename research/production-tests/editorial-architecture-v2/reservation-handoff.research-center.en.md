---
schema: publication-candidate-article/v2
title: "A Reservation Button Does Not Own the Reservation"
date: "2026-08-11"
column: industry-architecture
category: daily
article_type: research-brief
edition: research-center
research_question: "Where does authority move when an assistant hands a reservation action to an external provider?"
summary: "A connector should keep availability, submission, provider confirmation, and later custody as separate facts."
---

# A Reservation Button Does Not Own the Reservation

An assistant can surface an opportunity without becoming the system that owns the resulting transaction. The useful question is where authority moves as the user crosses from recommendation into an external booking flow.

## What changed in the reservation flow

Official product documentation describes a Reserve action for supported restaurant listings. The user can review details before placement, while confirmation, later modification, cancellation, and provider-account issues remain with the external reservation service. Availability is therefore an observation and the button is an eligible action surface; neither is yet a provider-confirmed booking.

## What the sources establish

The documented flow supports a bounded lifecycle: visible availability, action eligibility, user review, provider placement, provider confirmation, and external custody. The source does not disclose the connector protocol, freshness guarantee, duplicate-submit control, or consistency model. Separating those states is an architectural interpretation of the user-visible boundary, not a claim about an undocumented API.

This distinction matters beyond reservations. Any agent that crosses a system-of-record boundary needs evidence of what it observed, what it was allowed to submit, what the provider accepted, and who now owns later lifecycle actions.

## Questions left at the provider boundary

What receipt should bind the internal action identity to the provider transaction? How late must availability be rechecked? Which outcome should an agent record when submission succeeded but provider confirmation is delayed? The public documentation does not answer these protocol questions, so the brief ends with them rather than manufacturing a universal connector contract.

Sources: OpenAI ChatGPT Search help and the 2026-08-11 Reading Result.
