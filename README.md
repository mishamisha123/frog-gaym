# Froggy Leap v114.0 — GITHUB / WEBSITE UPLOAD ONLY

**Do not deploy this ZIP to Firebase.**

Deploy the matching v114.0 Firebase Functions package first. Wait until Firebase CLI says **Deploy complete!**. Then upload the contents of this package to the GitHub Pages repository.

## v114.0 authority
- Existing server wallet, Cases, Frog/Lake Collection purchases and Job rewards remain authoritative.
- Piggy deposits, withdrawals and interest are server-authoritative.
- Bank loans, collateral, repayments and the 15-minute repayment schedule are server-authoritative.
- Plinko bets, 50/50 paths, slots, multipliers and payouts are server-committed; the browser only animates the committed result.
- Vehicles, Crash, selling, gifting and trading remain outside this migration.

The website fails closed for Bank/Piggy/Plinko if the Phase 4 backend is unavailable.
