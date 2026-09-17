# Froggy Leap v114.9 — RESPONSIVE UX / GTA-STYLE TRANSACTION STATUS

GITHUB / WEBSITE ONLY.
NO FIREBASE DEPLOYMENT IS REQUIRED if v114.8 recovery backend is already live.

This keeps the stable v114.8 dedicated Firebase backend and changes only client responsiveness.

WHAT CHANGED
- Tiny GTA-style `Transaction pending…` line directly below the top balance.
- Cases: opening overlay starts immediately; after the reveal, a tiny pending -> Case saved status appears.
- Plinko: an egg visibly moves at the top of the board immediately while Firebase commits the protected path.
  The real egg then follows the server result. After it lands, the tiny pending -> Plinko saved status appears.
- Job: tiny status appears after the shift/result screen, while final queued server work settles.
- Bank/Piggy/purchases: tiny status appears during the actual server transaction.

IMPORTANT
The Firebase network/cold-start time still exists on scale-to-zero Functions. This build hides that wait
with immediate safe animation rather than weakening server authority or adding a paid reserved instance.

DEPLOYMENT
1. Extract this ZIP.
2. Upload all extracted files/folders to the GitHub Pages repository root.
3. Replace the existing v114.8 website files.
4. Commit.
5. Open refresh.html and reload the game/PWA.

No Firebase commands are needed for this website-only update.
