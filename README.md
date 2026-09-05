# Froggy Leap v114.4 — TRANSACTION DELAY CLEANUP + PENDING POPUP

GITHUB / WEBSITE ONLY.
Deploy the matching v114.4 Firebase Functions package FIRST and wait for `Deploy complete!`.

Popup behavior:
- Bank / Piggy / Case purchases / Frog+Lake purchases: shows while the server transaction is in flight.
- Job: waits until the visible shift ends, then shows while queued rewards + shift-end settle.
- Case opening: waits until the reel/reveal is finished, then shows pending -> confirmed.
- Plinko: waits until the final visible egg lands, then shows pending -> confirmed.
It is a small non-blocking toast with a spinning circle; it does not freeze gameplay.

Latency changes:
- redundant Phase-4 preflight transactions removed from hot backend calls
- independent Firestore reads parallelized
- authoritative server calculations, atomic writes, unique request IDs, ledger and replay protection remain unchanged

Lily Leap and Crash are not server-authoritative yet, so v114.4 does not pretend they have a Firebase transaction.
Their real round-end settlement popup will be connected when they migrate in v115.

Upload extracted files to the GitHub Pages repository root, replace v114.3 files, then use refresh.html.
