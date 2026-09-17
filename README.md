# Froggy Leap v114.6 — CASES + PLINKO STABILITY HOTFIX

GITHUB / WEBSITE ONLY.

This hotfix fixes the v114.5 regression where Cases/Plinko could stop working after
normal gameplay traffic was routed through the shared `economyFastAction` gateway.

v114.6 routes the game back through the proven dedicated Firebase callables:
- getEconomySnapshot
- buyCasesAuthoritative / openCasesAuthoritative
- buyCollectionAuthoritative
- startJobShiftAuthoritative / jobActionAuthoritative / endJobShiftAuthoritative
- piggyTransferAuthoritative
- bankTakeLoanAuthoritative / bankRepayLoanAuthoritative
- dropPlinkoAuthoritative

The small GTA-style `Transaction pending…` status directly under the top balance is preserved.

NO FIREBASE DEPLOYMENT IS REQUIRED for v114.6 if the v114.5 backend is already deployed.
The dedicated functions are already present in that backend.

GitHub deployment:
1. Extract this ZIP.
2. Upload the extracted files/folders to the GitHub Pages repository root.
3. Replace the current v114.5 website files.
4. Commit.
5. Open refresh.html and refresh the PWA/browser cache.

If you have NOT deployed the v114.5 backend, deploy the latest backend first using:
cd functions
npm install
cd ..
firebase.cmd use froggyleap-f59a8
firebase.cmd deploy --only functions
