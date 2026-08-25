# Froggy Leap v105 — Plinko Fullscreen Focus Mode

Built from the stable v103 base. The failed v104 portrait redesign is intentionally not included.

## v105 changes
- Adds a mobile **FULLSCREEN** button to Egg Plinko.
- Focus Mode hides Froggy header, game tabs, and bottom navigation.
- Requests browser fullscreen when supported.
- Attempts landscape orientation lock when the browser allows it.
- If orientation lock is unavailable, a clear Rotate Your Phone screen is shown until landscape.
- Landscape Focus Mode gives the Plinko board most of the screen and moves compact controls into a narrow right-side panel.
- EXIT returns to normal Froggy Leap and unlocks orientation.
- Manifest orientation changed from portrait-primary to any so the installed PWA can rotate.
- Desktop and normal portrait Plinko remain the v103 layout.
- Odds, physics, payouts, payout timing, 96-egg cap, 15-second Bank round, Friends, Firebase, and Cloud Saves are unchanged.

No Firestore rule changes are required.
