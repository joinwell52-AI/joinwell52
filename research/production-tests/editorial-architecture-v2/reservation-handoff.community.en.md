---
title: "Where Should an Agent Stop During a Reservation Handoff?"
edition: community
parent: reservation-handoff.research-center.en.md
community: OpenAI Developer Community
---

# Where Should an Agent Stop During a Reservation Handoff?

## The boundary developers actually control

An agent can expose current availability and open a booking flow without owning the provider's final record. Connector code should therefore avoid one generic `success` state for observation, submission, and confirmation.

## A concrete implementation question

Would a typed result such as `observed`, `submitted`, `provider_confirmed`, or `external_custody` make retries and user messaging safer? The public product flow supports the distinction, while the underlying connector contract remains undisclosed.

## What should the API make explicit?

Should provider confirmation and post-booking custody be separate typed outcomes, and what receipt should connect them to the original agent action?
