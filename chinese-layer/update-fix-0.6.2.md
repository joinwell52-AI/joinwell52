# Chinese Layer 0.6.2 — update-state hotfix

## Root cause

In 0.6.1, `dev-live-refresh-0.5.2.js` replaced `isNewerVersion(remote, current)` with a one-argument function that compared against its own `0.6.0` constant. The later Gmail override passed `0.6.1`, but that argument was discarded. Consequently an already-current 0.6.1 runtime repeatedly displayed “发现新版本 v0.6.1”. The base app also still declared 0.5.1.

## Changes

- `APP_VERSION` is the sole runtime version source; adapter constants are aliases.
- Remove adapter replacements of the comparator, checker and banner renderer.
- Automatic equal/older checks hide the update banner. Manual equal/older checks show the current version with a dismiss-only button.
- Separate dismissal from the update action; a failed manual check cannot reload using an earlier remote-version value.
- Ignore stale responses when multiple checks overlap.
- Cache-bust all frontend asset references to 0.6.2.

## Validation

`node scripts/chinese-layer-mobile-smoke.mjs` runs synthetic WebKit at widths 375/390/430 and Chromium at 375. It tests version parity, explicit comparator arguments, equal/older/newer metadata, stored old-version migration, saved timer callbacks, foreground checks, dismissal, concurrent-response ordering, a simulated old-build upgrade, and existing synthetic Mail interactions.

A green run does not establish real iPhone OAuth success. The test explicitly reports `realIphoneOAuth: NOT_RUN` and `standaloneRedirectOAuth: NOT_RUN`.

## Separate unresolved user report

Google displayed “禁止访问：此应用的请求无效”. This hotfix does not modify Google Cloud OAuth client configuration and does not claim to resolve that report. The exact Google error code/details and configured authorized redirect URI are still needed to identify its cause. Never request or record passwords, MFA codes, client secrets, or access tokens.

## Release boundary

This document is not a deployment receipt. Merge only after the exact candidate HEAD passes CI. Confirm Pages deployment separately; distinguish deployed code from physical iPhone validation.
