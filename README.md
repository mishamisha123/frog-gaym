# Froggy Leap v111 — Live Server-Authoritative Cases

Build v111 continues the successful v110 Phase 1 migration. Existing local save key stays `froggy-leap-deluxe-v3`.

## v111 changes

- Cases now require the migrated Firebase Server Economy account in normal play.
- BUY 1 / 5 / 10 is authorized and committed by `buyCasesAuthoritative`.
- OPEN 1 / 2 / 3 is consumed and rolled by `openCasesAuthoritative`.
- The browser never chooses the authoritative winning frog. It only animates the result returned by the server.
- Existing single/double/triple reel presentation is preserved.
- Cases screen shows the SERVER wallet and SERVER inventory.
- Duplicate compensation is credited by the server; the same Case transaction delta is mirrored into the legacy local save while the rest of the economy is migrated in stages.
- Case actions use unique request IDs, so retries are idempotent.
- Transfers/trading remain locked.

## Important staged-migration behavior

Job, Lily Leap, Plinko, Crash, Bank, Piggy, Collection shop/selling, lakes, vehicles and Owner/admin tooling are still local/Cloud Save systems in v111. Money earned there does not automatically become spendable in the SERVER Cases wallet yet. This is intentional until those reward sources are migrated server-side.
