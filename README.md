# Froggy Leap v114.8 — FULL RECOVERY WEBSITE

This is paired with the v114.8 Firebase recovery backend.

It uses the last known-working v114.3 gameplay/client integration and a fresh cache version.
The transaction-delay/shared-gateway experiment is removed.

DEPLOY ORDER:
1. Deploy the v114.8 Firebase recovery package first.
2. Wait for `Deploy complete!`.
3. Extract this ZIP.
4. Upload all extracted files/folders to the GitHub Pages repository root.
5. Replace the existing website files.
6. Commit.
7. Open refresh.html and refresh/clear the installed PWA/browser cache.

Test in this order:
- authoritative wallet/level loads
- open one Case
- make one small Plinko bet
- Job
- Piggy
- Bank

Do not re-run Cloud Save migration and do not change adminRoles.
