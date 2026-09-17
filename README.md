# Froggy Leap v114.7 — RECOVERY WEBSITE

Website-only recovery built from the last user-confirmed working v114.3 frontend.

This intentionally removes the v114.4/v114.5/v114.6 latency/gateway/transaction-status frontend experiments. It restores the proven dedicated Firebase callable paths for Cases, Plinko, Job, Collection, Bank and Piggy, plus the working authoritative Reset/HUD behavior from v114.3.

NO FIREBASE DEPLOYMENT IS REQUIRED if a v114.x backend is already live.

GitHub deployment:
1. Extract this ZIP.
2. Upload ALL extracted files/folders to the GitHub Pages repository root.
3. Replace the current website files.
4. Commit.
5. Open refresh.html.
6. Hard-refresh/reopen the game.

Standard Firebase commands for any future backend release:
cd functions
npm install
cd ..
firebase.cmd use froggyleap-f59a8
firebase.cmd deploy --only functions
