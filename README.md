# Froggy Leap v114.15 — PREMIUM RESPONSE ENGINE

GITHUB / WEBSITE ONLY.
Keep the stable v114.8 Firebase backend already deployed.

## Smarter latency learning
The local latency profile now uses the latest 12 real samples, EMA, median, p80 and jitter.
No extra server requests are made. Froggy Leap only measures calls it already had to make.

Cases use recent p80 latency to choose a better reel budget, which hides occasional slow responses
without making every fast opening unnecessarily long.

## Plinko
- Clean board while waiting.
- No fake egg, hovering egg, chute or placeholder.
- DROP-button preparation cadence adapts to learned real Plinko latency.
- One physical Space press = one drop.
- Pending server request cap stays at 4.
- Real egg appears at the first legitimate peg as soon as the authoritative result exists.
- Pending copy is shorter and cleaner.

## Job
CLOCKING IN animation cadence now adapts to learned Job-start latency.

## Transaction HUD
The same tiny GTA-style line stays directly underneath the real balance.
- normal: `Transaction pending…`
- abnormally slow for this player's recent connection: `Still syncing…`
- success: `✓ Saved`
- offline: `Offline`

No large toast or modal.

## Cases
- Immediate pre-spin remains.
- Server wait remains hidden inside the animation.
- p80 timing makes the reel budget more resilient.
- Technical “result locked/server secured” wording has been removed.

## Existing improvements retained
- balance settlement pulse
- transaction HUD follows the real balance
- Spacebar repeat protection
- Plinko pending cap
- clean Plinko board
- Lily Leap end-of-round visual settlement
- Sky Crash end-of-flight visual settlement
- Job immediate clock-in
- Bank/Piggy/purchase transaction HUD
- no artificial Plinko delay

## Backend / cost
No shared gateway.
No minInstances.
No paid always-on Function.
No Firebase deployment required.

## Deploy
Extract this ZIP, upload all extracted contents to the GitHub Pages repository root,
replace the current website files, commit, then open refresh.html.
