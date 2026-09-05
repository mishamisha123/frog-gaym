# Froggy Leap v114.2 — GITHUB / WEBSITE HOTFIX

Deploy the matching v114.2 Firebase package FIRST.

This build fixes the actual mismatch:
- TOP balance uses the authenticated Firebase Server Economy wallet.
- TOP Player Level and XP use the authenticated Firebase values.
- Incoming Firebase snapshots immediately repaint the top HUD.
- Collection/Cases wallet labels use the same authoritative wallet.

Reset:
- resets authoritative wallet to 1,000 F
- resets Player Level to 1 / XP to 0
- resets Job Level to 1 / XP to 0
- resets Cases, Frogs/Lakes, Bank, Piggy and Plinko
- deletes the old Cloud Save so stale money/levels cannot return
- resets local browser progress
- re-fetches the server snapshot to verify the reset
- writes a fresh default Cloud Save

Local state remains internally for not-yet-migrated Lily Leap/Crash logic, but it is no longer presented as the authenticated top wallet/level.

GitHub Pages only. Do not deploy this ZIP with Firebase CLI.
