# Froggy Leap v102 — Mobile Plinko multiplier resize

Built on v100.

- Preserves the v100 cloud-restore fix.
- Changes friend-request documents to schema v2 with a `participants` array.
- Friend-request listeners now use one `array-contains` query that matches Firestore Security Rules.
- Sending a request no longer probes missing private documents before create.
- Accepting a request no longer tries to read a friendship document that may not exist.
- Publish the included `firestore.rules` before testing Friends v1.
- Existing v1 pending friend-request documents are not listed by the new query; recreate them if any existed.

## v102 changes
- Mobile-only Plinko multiplier rail resize; desktop unchanged.
- Low rail ~91% width, Medium ~88%, High ~84%; narrower again on <=390px phones.
- Smaller 23–25px payout pockets with centered spacing so Medium/High do not crowd the frame.
- Preserves v101 Friends query fix, v100 cloud-restore fix, Firestore profiles/friends/cloud saves, and all game math.
