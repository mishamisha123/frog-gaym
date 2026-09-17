# Froggy Leap v114.5 — WARM TRANSACTION GATEWAY + MICRO STATUS

GITHUB / WEBSITE ONLY.
Deploy the matching v114.5 Firebase Functions package FIRST and wait for `Deploy complete!`.

## Latency change
Normal player transactions now use ONE shared Firebase callable:
`economyFastAction`.

The website uses one shared transaction gateway and sends a non-blocking ping after sign-in.
The gateway is allowed to scale to zero; there is NO reserved minimum instance. The original individual Functions stay deployed for compatibility.

This targets callable cold-start/service switching, which v114.4 did not eliminate.

## Transaction status UI
The old large floating notification is removed.

The new status is a tiny GTA-style line DIRECTLY BELOW THE TOP BALANCE BOX:
- small spinner + `Transaction pending…`
- brief `Transaction saved`
- small failure line only if the server rejects the action

It is deliberately subtle and does not cover gameplay.

Timing remains:
- Job: after the visible shift is finished
- Case opening: after the reveal is finished
- Plinko: after the visible egg/round finishes
- Bank/Piggy/purchases: while the direct transaction is actually waiting

Lily Leap and Crash are not authoritative yet; their real round-end transaction status comes with v115.

Upload extracted files to the GitHub Pages repository root, replacing v114.4.
Then open refresh.html to clear the old browser/PWA cache.
