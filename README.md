# Froggy Leap v112.4 — Owner Console Phase 3 Sync Fix

Website/PWA-only update on top of v112.1. No Firebase backend or Firestore redeploy is required.

- Adds an OWNER CONSOLE button inside Profile → Server Economy.
- The button is hidden by default and only appears after the deployed backend confirms `adminRoles/{uid}` is enabled for the signed-in account.
- Clicking the button re-checks the protected server Owner role before opening the console.
- The legacy 20-Bank-tap access path is retired in live Phase 3; it remains available only in self-test mode.
- Server-side Owner operations remain protected by the backend regardless of client UI changes.

# Froggy Leap v112.1 — Click/Input Hotfix

Hotfix for v112. Restores the accidentally omitted Owner modal runtime declarations that caused modal/navigation click handlers to throw `ReferenceError: ownerAccessModal is not defined`. Backend Phase 3 logic is unchanged; no re-migration is required.

# Froggy Leap v112 — Server Economy Phase 3

Build v112 continues from the validated v111 server-authoritative Cases build. Existing local save key remains `froggy-leap-deluxe-v3`; existing Server Economy accounts are upgraded in place and must **not** be migrated again.

## v112 changes

- Cases remain server-authoritative: BUY 1/5/10 and OPEN 1/2/3 are atomic backend transactions with server-selected outcomes and ledger entries.
- Frog and Lake purchases now use the authoritative server wallet and authoritative Player Level. Client-only money changes cannot buy server-owned frogs or lakes.
- Server Frog/Lake ownership replaces client ownership while Phase 3 is active. The default Classic Frog and Forest Pond are always preserved.
- Frog/Lake selling is temporarily locked until Bank/collateral migration, preventing a split server-ownership/local-resale exploit. Vehicles remain local.
- Job shifts now use a server session. Firebase issues fry types, enforces the authoritative timer/action cadence, calculates Job pay/XP, global XP/level rewards, equipped-frog Job perks, boost stacking, and credits the authoritative wallet. The client still reports the physical bag/discard action, so deeper anti-bot validation remains future work.
- Secure Owner economy operations are added for authoritative wallet, case inventory, Case Luck, Player Level, and Job Level. These require a protected Firestore `adminRoles/{uid}` document with `role: "owner"` and `enabled: true`; the old browser access key alone is not authorization. All protected Owner operations are ledgered.
- Local Owner Job boost injection is disabled while Server Job is active.
- Transfers/trading remain locked. Bank, Piggy, Lily Leap, Plinko, Crash, vehicles, selling, and their remaining economy paths are staged for later migration.

## Existing v111 accounts

The backend performs a one-time Phase 3 upgrade of the existing authoritative economy. It imports only missing Job Level/XP and Lake ownership from the current Cloud Save. It does **not** re-import wallet or Frog ownership, so client-only money/unlocks cannot overwrite the already protected server values.

## Deployment

Deploy the v112 Firestore rules and Cloud Functions first, then upload the complete web/PWA folder to GitHub Pages. Bump/cache references are already set to v112.


## v112.4 frontend hotfix
The Owner Console button now opens the game console through the direct FroggyGame bridge after server owner verification, and refreshes the Phase 3 snapshot if the game-side economy cache is stale. Firebase backend deployment is unchanged from v112.


### v112.4 Owner Console sync fix
- Owner authorization no longer depends on the browser-side Phase 3 snapshot being ready at the exact click moment.
- The protected Owner Console opens after the backend validates `adminRoles/{uid}`.
- Server Owner actions automatically retry the authoritative Phase 3 snapshot before they run.
- No Firebase backend, Firestore rule, or `adminRoles` changes are required from v112.
