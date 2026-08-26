# Froggy Leap v112.6 — Phase 3 economy latency fix

GITHUB / WEBSITE ONLY. Do not deploy this ZIP with Firebase.

This build keeps the v112 backend and Firestore rules unchanged. It reduces the visible lag around server-authoritative money actions by removing duplicate economy result rendering, deduplicating Firestore snapshot redraws, replacing full-game refreshes with a lightweight economy HUD refresh on hot paths, and giving Job catches immediate visual feedback while Firebase confirms the reward.

Security is unchanged: wallet/case/collection/Job outcomes are still committed by the server before authoritative state changes are accepted.
