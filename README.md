# Froggy Leap v113.0 — Server Latency Pipeline

## GITHUB / WEBSITE package
Upload these files to the Froggy Leap GitHub Pages site.

This build pairs with the v113 Firebase backend. Deploy the backend first.

Changes:
- Job no longer waits for a Firebase round trip after every fry. The backend pre-issues a short server fry queue and the browser pipelines authoritative reward commits in order.
- Job wallet/shift feedback is optimistic for responsiveness, then reconciled to the authoritative server result. Protected purchases still use the confirmed server wallet.
- Case opening shows the server-lock animation immediately instead of looking frozen while Firebase commits the outcome.
- Hot economy calls are designed to pair with the v113 backend transaction-latency reduction.
- Owner Console, server Cases, Frog/Lake purchases and server Job remain Phase 3; transfers/trading remain locked.
