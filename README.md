# Froggy Leap v64

> **Current-behavior note:** The v64 code and this latest release section are authoritative. Older entries below are retained as historical release notes and may describe mechanics that no longer apply.











## v64 — The Hill Frog portrait polish

- Replaced the rough cutout-looking Collection portrait with a smooth, fully rendered pond/lily-pad scene.
- The Hill Frog now uses separate Collection art and gameplay art, so the shop can look premium without putting a rectangular scene into Lily Leap or Sky Crash.
- Removed harsh white/jagged cutout edges from the Collection presentation by no longer using the transparent gameplay sprite as the shop portrait.
- Preserved The Hill Frog's legacy `gigachad` save ID, price, perks, ownership, and equipped state.
- PWA asset URLs, refresh helper, service-worker cache, and build label bumped to **v64**.

## v63 — More basic frogs + The Hill Frog rename

- Added six early-game frog skins: **Meadow Frog**, **River Frog**, **Moss Frog**, **Sand Frog**, **Blue Dart Frog**, and **Sunset Frog**.
- New basic frogs use clean transparent sprites, modest 1–2% perks, and prices from **500 F to 12,000 F**.
- The frog shop remains sorted strictly cheapest to most expensive, with rarity never decreasing as price rises.
- Renamed the existing Ultra reference skin to **The Hill Frog** while preserving its legacy internal ID so existing owners/saves keep the skin and its perks.
- The Hill Frog remains **750,000,000 F** with **+10% Job F**, **+10% Job XP**, and **+1.5 seconds Job start time**.
- PWA asset URLs, refresh helper, service-worker cache, and build label bumped to **v63**.

## v62 — Real transparent The Hill Frog art + rarity header fix

- Replaced the previous The Hill Frog PNG, which still contained a baked starry background and ULTRA badge, with a genuinely transparent full-body character sprite.
- Frog Collection rarity badges now live in a dedicated normal-flow header row above each portrait instead of being absolutely overlaid on the card.
- The Hill Frog portrait sizing now shows the full character with breathing room and no destructive crop.
- Frog shop remains strictly sorted cheapest to most expensive with monotonic rarity progression.
- PWA asset URLs, refresh helper, service-worker cache, and build label bumped to v62.

## v61 — Frog shop portrait + rarity/order cleanup

- The Hill Frog no longer uses the old baked Collection card image with an `ULTRA` label inside the artwork. Collection now uses the clean transparent character sprite over the premium Ultra frame.
- Frog rarity badges now live in a dedicated strip above the portrait instead of overlapping or disappearing behind the image frame.
- Frog shop order is enforced from cheapest to most expensive.
- Frog rarities now rise monotonically with price: Common → Rare → Epic → Legendary → Mythic → Ultra → One of One.
- Updated early/mid frog rarity assignments to match that progression without changing their prices, level requirements, ownership, saves, or gameplay stats.
- Added a Rare portrait-frame treatment and v61 regression checks for price order, rarity progression, and clean The Hill Frog shop art.
- Removed the obsolete baked The Hill Frog card image from the shipped assets.
- PWA asset URLs, refresh helper, and service-worker cache were bumped to v61.

## v60 — Rewards tab removed

- Removed the Rewards tab from the main navigation.
- Removed the daily reward wheel, streak panel, reward result modal, and their live UI/event hooks.
- Removed free-spin and unlimited-spin controls from the private owner console.
- Old reward-wheel save fields are discarded on load so they cannot leave stale UI state behind.
- Preserves the v59 gameplay/shop skin-art separation, rarity frames, existing economy, saves, Crash balance, Piggy rates, Job behavior, and premium blue redesign.
- PWA asset URLs, refresh helper, and service-worker cache were bumped to v60.

## v59 — Proper gameplay sprites + Collection rarity frames

- The Hill Frog now uses separate art for gameplay and Collection.
- Lily Leap, Sky Crash, and profile views use a transparent character cutout instead of pasting the rectangular shop card into the game world.
- Collection keeps the polished framed The Hill Frog card art.
- Every frog rarity now has a stronger premium portrait-frame treatment in Collection (Common, Royal, Epic, Legendary, Mythic, Ultra, and One of One).
- Gameplay sprite drawing preserves image aspect ratio.
- Existing saves and all v58 gameplay/economy behavior are preserved.
- PWA asset URLs, refresh helper, and service-worker cache were bumped to v59.

## v58 — Keep only the reference-based Ultra skin

- Removed the other 11 v56 Ultra skins from the live frog catalog, leaving only **The Hill Frog**, the skin based on the user-supplied reference image.
- The Hill Frog keeps its existing **750,000,000 F** price and equipped perks: **+10% Job F**, **+10% Job XP**, and **+1.5 seconds Job start time**.
- Old saves are normalized so removed Ultra IDs cannot remain equipped, owned, or pledged; an invalid removed selection falls back safely to Classic Frog.
- Replaced the old 12-skin sprite sheet with a dedicated The Hill Frog asset so the removed skins are no longer shipped in the build.
- Preserved the v57 premium-blue redesign and all existing v55/v54 gameplay/economy changes.
- PWA asset URLs, refresh helper, and service-worker cache were bumped to v58.

## v57 — Premium blue arcade redesign

- Rebuilt the visual shell around the supplied glossy blue Collection reference: navy/cobalt panels, cyan outlines, 3D mobile-game buttons, bright rarity framing, upgraded HUDs, and a blue floating navigation dock.
- Restyled Lily Leap, Sky Crash, Job, Collection, Rewards, Bank/Piggy, Profile, modals, and the refresh helper while preserving existing gameplay math and save data.
- Collection now uses a denser premium card grid with stronger selected/Ultra treatments and a more reference-like tab bar.
- Existing v56 Ultra frog skins and perks remain intact. No case-opening system was added in this visual-only release.
- PWA asset URLs and service-worker cache were bumped to v57.

## v56 — Ultra frog skins and equipped perks

- Added 12 expensive **ULTRA** frog skins based on the approved visual concept: The Hill Frog, Shrek Frog, Messi Frog, HeisenFrog, Doge Frog, Elon Frog, Trump Frog, McFroggy CEO, Snoop Frog, Naruto Frog, Rick Frog, and PewDiePog Frog.
- Prices range from **450,000,000 F to 800,000,000 F** and each Ultra skin has visible perks that are active only while that frog is equipped.
- Perks cover Job money/XP/start time, Lily Leap XP, Crash XP, Piggy interest-rate bonuses, level-up F bonuses, and a flight-refund chance. No skin changes Sky Crash crash odds or payout math.
- Ultra skin art uses the approved concept sheet as an in-game sprite source, including the reference-based face skin, so the expensive skins are visually recognizable in Collection and game views.
- Existing saves remain compatible. The PWA asset URLs, refresh helper, and service-worker cache were bumped to v56 and the new Ultra skin sheet is precached.
- Frog cases are intentionally **not included yet**; this build isolates the skins first.

## v55 — Early Sky Crash risk

- Sky Crash can now crash as early as **1.01×** instead of being protected by a **1.10×** minimum.
- This removes the guaranteed-profit strategy at very low cash-out targets such as 1.07× while keeping the existing Crash distribution and 3% full-return payout edge.
- The built-in self-test now checks the 1.01× Crash minimum.
- App asset URLs, the refresh helper, and the service-worker cache were bumped so website and installed-PWA copies receive the new Crash behavior.

## v54 — Piggy interest update

- Piggy savings now earn **1% per existing 20-minute cycle while the app is open**.
- Trusted closed-time Piggy interest is now **0.3% per existing 20-minute cycle**.
- The trusted-time warning still explains that closed-time interest pauses while trusted time is unavailable, but the final phone-clock sentence was removed as requested.
- The existing trusted-time / tamper-resistant clock logic and save format remain unchanged.
- App asset URLs, the refresh helper, built-in Piggy rate checks, and the service-worker cache were bumped for the new release.

## v53 — Restartable, softer Shift Over screen

- Closing the Shift Over screen by tapping outside it or pressing × now restores the Job start panel immediately, so **START SHIFT** is always available again.
- **WORK AGAIN** still starts the next shift directly without showing the start panel first.
- The result dialog has a softer glass backdrop, larger rounded corners, cleaner spacing, a gentler summary card, and a more polished close control.
- App asset URLs and the service-worker cache were bumped so installed copies receive the fix.

## v52 — Installed-app alert visibility and reliable Shift Over closing

- The no-flights shortcut now lives inside the top of the Sky Crash play area, so it remains visible in the installed Home Screen/PWA layout instead of being pushed below the viewport.
- The alert is intentionally compact: **NO FLIGHTS · VEHICLES →**. Tapping any part opens the Vehicles collection.
- The Shift Over screen now closes by tapping its dark backdrop on touch devices, and it also includes a small × close control.
- CSS and JavaScript asset URLs and the service-worker cache were bumped so installed apps do not keep the older hidden-alert layout.

## v51 — Dismissible Shift Over screen

- Tapping the dark backdrop outside the Shift Over card now closes the result screen.
- Taps inside the result card, including **WORK AGAIN**, continue to behave normally.
- This uses pointer input so it works with mouse, touch, and stylus controls.

## v50 — Timed Job shifts, exact automatic installments, and selling

- A Job shift now begins with **15 seconds** and every successfully bagged non-bomb fry adds **2 seconds**.
- Running out of time ends the shift as a loss. Missing the bag or catching a bomb still ends the shift immediately.
- The entire completed shift counts as **one gameplay round**. Individual fries no longer advance Bank payment countdowns.
- When an installment reaches its due round, the Bank automatically deducts only that exact installment directly from Piggy savings. The remaining Piggy balance stays inside Piggy and the five-round countdown resets immediately.
- Piggy is used first. A pledged asset is used only to cover a remaining shortage. Piggy is not drained when it cannot complete a payment and no pledged asset is available.
- Owned frogs, lakes, and vehicle models now include **Sell** controls. Paid items sell for 50% of their original price; pledged and default items cannot be sold. Selling a vehicle also removes its remaining consumable flights.
- The visible two-round and one-round Bank reminders and the clickable no-flights vehicle shortcut remain included.

## v49 — Clear flight and payment reminders

- When the selected Crash vehicle has no flights, a compact **NO FLIGHTS LEFT** panel appears with one **OPEN VEHICLES** button.
- The panel uses short copy and opens Collection directly on the Vehicles section for refills or purchases.
- Active loans now show short reminders when a payment is due in two rounds and again when it is due next round.
- The due-now notice is also shortened to one clear line.
- An overdue payment debits only the exact current installment directly from Piggy savings; it never routes that money through the wallet, and the remaining Piggy balance stays untouched.
- Old oversized due amounts are clamped to the current installment during save migration.
- Sky Crash once again applies its 3% edge to the full return, including a 97 F return on a 100 F cash-out at 1.00×.
- The 2.5-billion-Froggy loan cap and existing save compatibility remain unchanged.

## v46 — Maintenance and interface refinement

- Preserves the v45 Job reward balance, fry rarity, premium lake previews, full-screen game layouts, and save compatibility.
- Includes internal stability and validation refinements without changing public navigation or gameplay balance.
- Owner Frog continues to unlock at Level 3,000.

## v45 — Fairer Job rewards and scene-accurate lake previews

- Job work now starts at **15 F and 5 XP per standard fry**, with much slower growth at high Job Levels.
- At Job Level 2,000, a standard fry pays about **193 F and 10 XP** before temporary boosts.
- Fry-type rarity is unchanged from v44.
- Lake cards now use polished miniature captures of the actual seven playable environments rather than abstract CSS thumbnails.
- Existing saves, Job levels, lake ownership, boost stacking, Bank behavior, and gameplay systems remain compatible.
- Owner Frog now unlocks at **Level 3,000** instead of Level 20,000; its price and Bank Value are unchanged.

## v44 — Premium lakes and rarer Job boosts

- Rebuilt all seven Lily Leap lake themes as distinct premium environments rather than simple palette swaps.
- Added lake-specific scenery, atmosphere, reflections, water treatments, environmental particles, themed pads, and stronger visual depth.
- Replaced simple lake emoji art in Collection with sophisticated miniature environment previews for every lake.
- Preserved gameplay clarity: the frog, landing pads, NEXT marker, payout HUD, and active controls remain visually dominant.
- Green money and yellow XP boosts remain fully stackable: collecting the same boost again before expiry doubles it and resets its 20-second timer.
- Boost fries are now much rarer—**2.5% green and 2.5% yellow**, down from a combined 15%—so high stacked multipliers require considerably more luck.
- Bomb fries remain at 5%; ordinary fries now make up 90% of spawns.
- Standard Job XP keeps the slower logarithmic v43 progression, while Job pay remains uncapped.

# Froggy Leap Deluxe — Visual Upgrade

A mobile-first, installable HTML5 game for GitHub Pages. It uses only HTML, CSS, JavaScript, Canvas, Web Audio, and generated PNG icons—there are no external libraries or paid assets.

## What is included

- Start with **1,000 Froggy** virtual currency.
- Choose bets of 50, 100, 250, 500, or MAX.
- The redesigned frog crouches, launches in an arc, spins, blinks, and squash-stretches on landing.
- Organic lily pads now use a **bright yellow NEXT arrow** and glowing destination ring instead of number blocks.
- Twenty increasingly risky jumps use a **96% base RTP** curve, rising from about **1.01×** to **112.07×**.
- Cash out after any successful jump, or risk the next lily pad.
- Failed pads crack, sink, splash, shake the screen, and end the round.
- Procedural water, flowers, particles, ripples, glows, confetti, haptics, and generated sound effects.
- XP, levels, statistics, virtual balance saving, six illustrated frog skins, and seven lake themes.
- **Every level awards Froggy coins.** The bonus grows with the level.
- A stable, touch-safe daily reward wheel with every prize printed on its slice.
- The daily wheel has ten equal slices, including a clearly marked **50,000 Froggy jackpot** slice—a 1-in-10 chance on normal daily spins.
- Daily streaks, lucky charms, and guaranteed eligible frog skins on seven-day streaks.
- Installable PWA with offline caching and faster update behavior.
- Responsive support for iPhone, Android, tablets, and desktop browsers.

Froggy is fictional in-game currency only. The project contains no payment system and offers no real-money prizes.

## Update your existing GitHub repository

1. Extract the ZIP.
2. Open your repository and choose **Add file → Upload files**.
3. Drag everything from the extracted folder into the uploader.
4. GitHub will show the existing files as changed; commit the changes.
5. Make sure the complete `icons` folder is uploaded too.
6. GitHub Pages will redeploy automatically.

The repository root should contain:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `.nojekyll`
- `README.md`
- `icons/icon-192.png`
- `icons/icon-512.png`

## Publish on GitHub Pages

1. Open repository **Settings**.
2. Open **Pages** under “Code and automation.”
3. Set **Source** to “Deploy from a branch.”
4. Select `main` and `/ (root)`, then save.
5. Wait for GitHub Pages to show the published address.

The address normally looks like:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

## See the update on iPhone

After GitHub finishes deploying, open the Pages link in Safari and refresh. If the Home Screen version still shows the old design, fully close it, open the Pages link once in Safari while online, then reopen the Home Screen app. The v9 service worker replaces the old cached files.


## Promo Code Tab

The v5 build adds a dedicated promo tab with one-time codes stored in local progress:

- `imtheowner` — protects one complete round while the visible risk percentages remain unchanged.
- `50000` — adds 50,000 virtual Froggy.
- `unlockall` — unlocks all frog characters.
- `spinall` — permanently enables unlimited reward-wheel spins for that save.

Uploading this version over an older GitHub Pages build preserves existing progress because it retains the same local save key.


## v6 additions

- Promo code `10` adds 10 free reward-wheel spins.
- The Rewards screen shows a live free-spin counter.
- Promo code `spinall` changes that counter to the exact label `unlimintos`.
- The final collection character is **Owner Frog**, a stylized photo-inspired deadpan frog priced at **1,000,000,000 Froggy**.


## v7 character overhaul

- Rebuilt all frog characters as ten separate premium SVG illustrations shared by the collection, profile and live game canvas.
- Added Classic, King, Robo, Ghost, Dragon, Dino, Ninja, Alien, Rockstar and Owner Frog.
- Owner Frog is photo-inspired: short dark hair, thick brows, heavy-lidded brown eyes, subtle stubble, a deadpan expression and a black shirt, while remaining unmistakably a frog.
- In the original v7 release, Owner Frog required **level 20,000**. The current v46 requirement is **Level 3,000**.
- Promo code `5` multiplies the current level by five once per saved game.
- Improved collection-card framing, rarity glow, portrait lighting, spacing and selected-character presentation.
- The service worker now caches every character asset for offline play.


## Bet controls added in v8

- Fixed quick bets: 50, 100, 250, and 500 Froggy.
- **÷2** halves the current bet.
- **×2** doubles the current bet without exceeding the available balance.
- **Custom** accepts any whole-number amount from 50 Froggy up to the current balance.
- **MAX** sets the bet to the full available balance.

## Twenty-jump curve

The path contains twenty jumps. Per-jump failure risk rises from 5% to 52%. Multipliers are calculated from cumulative survival probability using a 96% target RTP, so ordinary cash-out points have the same long-run return before integer payout rounding. Lucky charms, reward spins, level bonuses, and protected promo rounds remain additional bonuses.

## v9 balanced base-game economy

The normal jump game now targets **96% RTP** at every cash-out step:

| Jump | Pad failure risk | Chance of reaching this jump | Cash-out multiplier |
|---:|---:|---:|---:|
| 1 | 5% | 95.000% | 1.01× |
| 2 | 6% | 89.300% | 1.08× |
| 3 | 7% | 83.049% | 1.16× |
| 4 | 8% | 76.405% | 1.26× |
| 5 | 9% | 69.529% | 1.38× |
| 6 | 10% | 62.576% | 1.53× |
| 7 | 11% | 55.692% | 1.72× |
| 8 | 12% | 49.009% | 1.96× |
| 9 | 13% | 42.638% | 2.25× |
| 10 | 14% | 36.669% | 2.62× |
| 11 | 16% | 30.802% | 3.12× |
| 12 | 18% | 25.257% | 3.80× |
| 13 | 20% | 20.206% | 4.75× |
| 14 | 23% | 15.559% | 6.17× |
| 15 | 26% | 11.513% | 8.34× |
| 16 | 30% | 8.059% | 11.91× |
| 17 | 34% | 5.319% | 18.05× |
| 18 | 39% | 3.245% | 29.59× |
| 19 | 45% | 1.785% | 53.79× |
| 20 | 52% | 0.857% | 112.07× |

Formula: `multiplier = 0.96 ÷ cumulative survival probability`.

Because payouts are credited as whole Froggy, small bets may produce a slightly lower realized RTP due to rounding down.


## v10 engaging but fair progression

This update adds stronger game feel without using deceptive gambling dark patterns:

- Four visible round milestones at jumps 5, 10, 15, and 20.
- Three permanent, deterministic Pond Goals with fixed Froggy and XP rewards.
- Session rounds, wins, net Froggy, elapsed time, and Pond Rank.
- Five permanent achievement badges.
- Deeper visual intensity after jump 10 and milestone celebration effects.
- Optional 15-minute play reminders and a neutral message after three consecutive losses.
- No fake near-misses, hidden odds changes, expiring missions, or loss-chasing prompts.


## Consolidated v11 deployment check

This build includes an unmistakable yellow badge reading **v28 · FROGGY ARCADE** above the start button.

After uploading all files to GitHub Pages, visit:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/refresh.html`

That helper unregisters old service workers and removes stale cached game files, while preserving localStorage progress. It then redirects to the newest game.

The correct build must visibly show:

- `v28 · FROGGY ARCADE`
- Jump display `0 / 20`
- Fixed bets: 50, 100, 250, 500
- Bet tools: ÷2, ×2, CUSTOM, MAX
- A custom amount input after tapping CUSTOM


## v12 promo pack

Promo codes are case-insensitive.

### Reusable codes

- `50000` — adds 50,000 Froggy every use
- `10` — adds 10 free reward-wheel spins every use
- `5` — multiplies the current level by five every use, capped at level 1,000,000,000

### One-time codes

- `imtheowner` — one protected round with the normal displayed risk curve
- `unlockall` — unlocks every frog character
- `iwannaswim` — unlocks every lake theme
- `spinall` — enables unlimited wheel spins and displays `unlimintos`
- `luckylily` — adds 25 lucky reduced-risk jumps
- `pondparty` — adds 2,500 Froggy and 3 free spins
- `xpfrog` — adds 1,000 XP and any resulting level bonuses
- `lifeguard` — adds 3 protected rounds

To force GitHub Pages to replace an older cached build, visit `refresh.html` after deployment.


## v13 fixes and promo updates

- Removed the green Owner Frog halo that appeared as a rectangular block in Mobile Safari.
- `lifeguard` is now reusable and adds three protected rounds per use.
- `qoostommoney` is reusable. Enter it in the Promo tab, then type a positive whole-number Froggy amount into the prompt.
- `5` now pays the cumulative coin reward for every level skipped by the multiplier.
- Normal XP level-ups now use the same cumulative reward system, ensuring every gained level credits its Froggy bonus exactly once.
- The balance uses a safe technical maximum of 9,000,000,000,000,000 Froggy to prevent JavaScript number corruption.


## v14 fictional debt system

The debt system only uses fictional Froggy currency.

- Borrow 1,000, 5,000, 10,000, or 50,000 Froggy from the Profile tab.
- Total debt is capped at 1,000,000 Froggy.
- There is no interest.
- Every five **completed rounds**, an installment equal to 10% of the current debt is due.
- The installment is deducted automatically from the balance.
- If the balance is too low, all available Froggy is paid and one level is removed.
- The level cannot fall below level 1.
- Unpaid debt remains outstanding.
- Players may manually pay the next 10% installment or repay as much of the debt as their balance allows.
- The Play screen shows the current debt and the number of rounds until the next installment.

After deployment, use `refresh.html` once to remove the previous cached build.


## v15 manual debt rules

Debt uses fictional Froggy currency only.

- Credit limit: `max(10,000, 10 × biggest cash-out)`.
- A player with no meaningful cash-out history may still borrow up to 10,000 Froggy.
- There is no additional gameplay cap; a technical JavaScript safe-number ceiling remains to protect save data.
- After five completed rounds, a payment equal to 10% of the current debt becomes due.
- The game does **not** deduct the payment automatically.
- A red exclamation mark appears on the Profile navigation button and debt panel while payment is due.
- The player must manually use **PAY DUE** or **REPAY ALL**.
- Every additional completed round while the payment remains overdue removes one level.
- At level 1, another missed-payment penalty resets the entire save to a fresh level-1, 1,000-Froggy start.
- The overdue debt itself is unchanged until a manual payment is made or the save resets.
- Custom loans may be entered up to the currently available credit limit.

After deploying v15, visit `refresh.html` once to remove the older cached version.


## v16 mobile cockpit and character cleanup

### One-screen mobile play layout

- The Play screen sits between a compact header and navigation bar.
- Before a round, the lake and all eight bet controls fit in the same phone viewport:
  - 50, 100, 250, 500
  - ÷2, ×2, CUSTOM, MAX
- The custom amount opens in a bottom sheet and never pushes the lake or Start button away.
- During a live round, setup controls disappear and the lower deck becomes a large Jump/Cash dock.
- The lake expands into the space recovered from the hidden betting controls.
- Milestone cards no longer displace mobile controls.
- Short iPhones use a denser version without removing any betting option.

### Clean character art

- Removed every SVG halo.
- Removed SVG blur and drop-shadow filters that could become rectangular blocks in Mobile Safari.
- Removed the forehead shine overlay.
- Removed CSS portrait glow and drop-shadow effects.
- Collection, Profile, header, and gameplay portraits now use clean flat shading.

After deployment, visit `refresh.html` once to clear the older cached build.


## v17 economy, debt and art update

### Fifteen-jump 95% curve

Every ordinary cash-out point targets 95% RTP before whole-Froggy rounding. Early rewards are tighter than v16, while the final jump pays strongly.

| Jump | Failure risk | Cash-out multiplier |
|---:|---:|---:|
| 1 | 8% | 1.03× |
| 2 | 10% | 1.15× |
| 3 | 12% | 1.30× |
| 4 | 14% | 1.52× |
| 5 | 16% | 1.80× |
| 6 | 18% | 2.20× |
| 7 | 21% | 2.79× |
| 8 | 24% | 3.67× |
| 9 | 28% | 5.09× |
| 10 | 32% | 7.49× |
| 11 | 37% | 11.88× |
| 12 | 43% | 20.85× |
| 13 | 49% | 40.88× |
| 14 | 56% | 92.92× |
| 15 | 64% | 258.10× |

Final survival probability is approximately 0.368%, with a 258.10× final cash-out.

### Level-based fictional credit

- Credit limit is `max(10,000, current level × 100)`.
- Level 1 through level 100 receive the 10,000-Froggy minimum.
- Level 250 receives 25,000 Froggy of total credit.
- Level 10,000 receives 1,000,000 Froggy of total credit.
- Existing debt counts against the available credit.
- There is no separate gameplay cap beyond the JavaScript safe-number protection.
- The existing manual-payment deadline and overdue-level rules remain unchanged.

### Character rendering fix

- All remaining body gradients and artificial face highlights were flattened.
- Portrait card spotlights and pseudo-element shines were disabled.
- The game now loads new 512px transparent PNG sprites from `characters-flat-v17/`.
- The new filenames prevent Mobile Safari from reusing previously cached shiny SVG files.


## v18 character repair

v17 could show a crude malformed fallback frog when its new character folder was not uploaded.
It also flattened the artwork too aggressively.

v18:

- Restores the original textured gradients, shadows, colors and accessories.
- Removes only the artificial halo and forehead-shine layers.
- Corrects Owner Frog's hairline and eyebrows so the eyes stay unobstructed.
- Embeds all ten 512×512 transparent PNG portraits directly inside `app.js`.
- Uses the same embedded source in gameplay, Profile, Collection and the header.
- Requires no `characters` folder.
- Replaces the crude emergency frog with a neutral `LOADING` marker.
- Adds strict aspect-ratio and containment rules to prevent stretching or clipping.


## v19 trust-based fictional credit

The old level-based limit has been removed.

### Repayment tiers

| On-time payments | Tier | Maximum |
|---:|---|---:|
| 0 | Starter | 5,000 F |
| 3 | Reliable | 10,000 F |
| 8 | Established | 25,000 F |
| 20 | Trusted | 50,000 F |
| 40 | Prime | 100,000 F |
| 75 | Pond Elite | 250,000 F |

Three missed deadlines reduce the effective tier by one step. Every additional group of
three missed deadlines applies another step of penalty.

### Verified affordability

Only ordinary paid rounds without protected-round insurance are counted.

`affordability = max(5,000, min(20 × median recent bet, 6 × median recent cash-out, 25% × verified gameplay earnings))`

The histories retain the latest 20 qualifying bets and latest 20 qualifying positive cash-outs.

These never directly increase credit eligibility:

- Promo codes and custom promo money
- Free reward-wheel spins
- Protected rounds
- Daily rewards
- Level rewards and level-multiplier codes
- Collection unlocks or owner/admin rewards

### Final limit and borrowing controls

`total credit limit = min(effective repayment tier, affordability limit)`

- Outstanding debt is subtracted from available credit.
- A single new loan is capped at 50% of currently available credit.
- Only one new loan may be taken per five completed rounds.
- No new loan is allowed while a payment is due.
- One missed deadline freezes credit increases.
- A freeze requires three later on-time payments to clear.
- Three missed deadlines reduce the repayment tier by one step.
- Manual 10% installments, overdue level penalties and the level-1 reset remain unchanged.


## v20 full-payoff credit tiers

Tier progress is no longer based on installment payments.

### What counts

A tier credit is awarded only when all of the following are true:

- The player selects **PAY OFF DEBT**, not **PAY DUE**.
- That payment completely clears the outstanding debt.
- The debt cycle included at least 500 Froggy of borrowing.
- At least one completed round occurred after the debt cycle began.
- A single debt cycle can award no more than one full-payoff credit.

Paying the 10% amount due keeps the account current, but gives no tier progress.
Repeatedly clicking either payment button after debt is cleared cannot add more progress.

### Fast tier ladder

| Qualified full payoffs | Tier | Tier ceiling |
|---:|---|---:|
| 0 | Starter | 5,000 F |
| 1 | Bronze | 10,000 F |
| 2 | Copper | 20,000 F |
| 3 | Silver | 50,000 F |
| 4 | Gold | 100,000 F |
| 5 | Platinum | 250,000 F |
| 6 | Emerald | 500,000 F |
| 7 | Sapphire | 1,000,000 F |
| 8 | Ruby | 2,000,000 F |
| 9 | Diamond | 5,000,000 F |
| 10 | Master | 10,000,000 F |
| 11 | Grandmaster | 20,000,000 F |
| 12 | Elite | 50,000,000 F |
| 13 | Champion | 100,000,000 F |
| 15 | Hero | 200,000,000 F |
| 17 | Legend | 350,000,000 F |
| 19 | Mythic | 500,000,000 F |
| 22 | Sovereign | 750,000,000 F |
| 25 | Pond Billionaire | 1,000,000,000 F |

The effective credit limit remains the smaller of the tier ceiling and verified affordability.
Outstanding debt, the 50% single-loan cap, five-round borrowing cooldown, overdue locks,
credit freezes and missed-deadline tier penalties remain active.

A credit freeze now requires two qualified full payoffs to recover. PAY DUE payments do not
remove the freeze or advance the tier.


## v21 fixed-payment loan schedule

Froggy uses a simplified fictional installment loan rather than an APR-based calendar loan.

### New-loan terms

- Principal: the Froggy amount received by the player.
- Total finance charge: 8% of principal, rounded up to a whole Froggy.
- Scheduled balance: principal plus the 8% finance charge.
- Term: ten fixed scheduled payments.
- Fixed payment: `ceil(scheduled balance ÷ 10)`.
- A payment becomes due every five completed rounds.
- The final scheduled payment is reduced only when less than the normal fixed amount remains.
- Only one loan may be active at a time.

Example: a 10,000-Froggy loan has 800 Froggy of scheduled interest, a scheduled
balance of 10,800 Froggy, and a fixed payment of 1,080 Froggy.

### Early payoff

Froggy charges no prepayment penalty.

Interest is earned gradually over the 50-round scheduled term. PAY OFF EARLY charges:

`remaining principal + earned but unpaid interest − prepaid unearned interest`

All unearned future interest is removed. The debt screen displays the current payoff amount
and the interest saved by paying immediately.

Example: after three scheduled payments on a 10,000-Froggy loan, the remaining principal is
7,000 Froggy. Paying off then costs 7,000 Froggy and saves the remaining 560 Froggy of
scheduled interest.

### Tier progression

- PAY FIXED AMOUNT never advances the credit tier.
- A qualified PAY OFF EARLY action can add one full-payoff credit.
- The existing minimum debt-cycle amount, completed-round qualification, affordability limit,
  one-loan cooldown, overdue level penalty, freeze system and billion-Froggy tier ladder remain.

### Existing v20 loans

An active v20 debt is migrated into ten fixed payments without adding retroactive interest.
Only loans created in v21 receive the new 8% finance charge.


## v22 dedicated Bank

### Separate Bank tab

The full credit system has moved out of Profile and into a dedicated Bank screen.
The Bank navigation button owns the red payment-due alert. The live-game debt badge also
opens the Bank directly.

### Two-step loan redemption

1. **GET A LOAN** opens an interactive quote.
2. A slider and exact amount field select the principal.
3. Before any warning, the quote displays:
   - 8% total finance charge
   - 50-completed-round duration
   - ten fixed payments
   - one payment every five rounds
   - total interest
   - scheduled total
   - fixed payment amount
   - first due point
   - immediate early-payoff amount
   - tier qualification
4. **REVIEW FINAL WARNING** opens a second screen.
5. The warning briefly explains manual payments, overdue level penalties, level-1 reset,
   early-payoff savings, tier rules and the fictional-currency status.
6. The player chooses **CANCEL** or **REDEEM MONEY**.

Only one active loan remains allowed. The quote is calculated by the same `loanQuote()`
function used when the loan is actually created.

### Piggy Bank

- Players may deposit wallet Froggy or withdraw savings at any time outside an active round.
- No deposit or withdrawal fee.
- Savings earn 0.1% every 20 completed rounds while money is stored.
- Accrual is calculated a little each round from the balance actually stored during that round.
- This prevents depositing only on round 20 from earning a full cycle on money that was not stored earlier.
- Whole Froggy interest is credited at the end of each 20-round cycle.
- Fractional interest carries forward instead of being discarded.
- Credited interest compounds in later cycles.
- The Bank displays savings, wallet funds, estimated next interest, rounds remaining,
  lifetime interest, cycle count and progress.
- Piggy savings are not available for betting or debt payments until withdrawn.


## v23 simplified Bank and credit tiers

### One credit rule

The previous affordability calculation, recent-bet medians, verified earnings, credit freezes,
50% single-loan cap and borrowing cooldown have been removed.

The maximum new loan is determined only by the current repayment tier.

Tier progress is the total Froggy actually repaid on time:

- **PAY AMOUNT DUE** counts only when a payment is genuinely due and the loan has not missed a deadline.
- The button cannot be repeatedly used before a due date.
- **PAY OFF EARLY** counts the payoff amount after at least one completed round, provided the loan has not missed a deadline.
- Payments made after a missed deadline clear debt but do not increase the tier.
- Missed deadlines retain the overdue level penalty, but no longer reduce or freeze the tier.
- Only one loan may be active.
- The maximum selected loan amount is the full tier ceiling rather than 50% of it.

### Amount-based tier ladder

| On-time Froggy repaid | Tier | Maximum loan |
|---:|---|---:|
| 0 | Starter | 5,000 F |
| 5,000 | Bronze | 10,000 F |
| 15,000 | Copper | 20,000 F |
| 35,000 | Silver | 50,000 F |
| 75,000 | Gold | 100,000 F |
| 175,000 | Platinum | 250,000 F |
| 425,000 | Emerald | 500,000 F |
| 925,000 | Sapphire | 1,000,000 F |
| 1,900,000 | Ruby | 2,000,000 F |
| 3,900,000 | Diamond | 5,000,000 F |
| 8,900,000 | Master | 10,000,000 F |
| 18,900,000 | Grandmaster | 20,000,000 F |
| 38,900,000 | Elite | 50,000,000 F |
| 88,900,000 | Champion | 100,000,000 F |
| 188,900,000 | Hero | 200,000,000 F |
| 388,900,000 | Legend | 350,000,000 F |
| 738,900,000 | Mythic | 500,000,000 F |
| 1,238,900,000 | Sovereign | 750,000,000 F |
| 1,988,900,000 | Pond Billionaire | 1,000,000,000 F |

Existing v22 full-payoff progress migrates to the equivalent v23 tier.

### Compact Bank design

- Loans appear first when Bank opens.
- Loans and Piggy Bank are separate tabs, so neither pushes the other down the page.
- A bright Bank shortcut is added to the top bar.
- The bottom Bank navigation item is visually emphasized.
- The credit screen shows only the current tier, maximum loan, total repaid on time,
  progress to the next tier and active-loan essentials.
- The scheduled payment action is renamed **PAY AMOUNT DUE**.
- Piggy Bank keeps its balance, next-interest estimate, rounds remaining and transfer controls.


## v24 Bank controls, XP and collateral

### Piggy transfer repair

The Piggy transfer action was remaining disabled after the slider, exact field or quick buttons
changed the amount. v24 synchronizes the button state immediately after every amount change.

- Debt does not block deposits or withdrawals.
- Only an active gameplay round temporarily locks transfers.
- Slider, exact input, 25%, 50% and MAX all enable the transfer action correctly.
- Both input and change events are handled for stronger mobile-browser compatibility.

### Paying scheduled amounts early

The scheduled-payment button is now:

- **PAY AMOUNT DUE** when the deadline has arrived.
- **PAY NEXT PAYMENT EARLY** before the deadline.

An early scheduled payment:

- Uses the same fixed payment amount.
- Reduces the loan normally.
- Resets the five-completed-round countdown.
- Counts toward the repayment tier when the loan has not missed a deadline.
- Does not waive future interest; only PAY OFF EARLY waives unearned future interest.

### Exact maximum loan

The range input now uses one-Froggy slider resolution internally, so every tier ceiling is
reachable—including exactly 100,000 rather than stopping at 95,500. A dedicated MAX button
also selects the exact current tier maximum.

### Bet-scaled XP

Successful gameplay XP now includes:

`wager XP bonus = floor(4 × sqrt(bet ÷ 50))`, capped at 2,000 XP per landing.

- Every successful landing receives the wager bonus.
- Cash-out XP receives twice the wager bonus.
- Clearing all fifteen jumps receives three times the wager bonus.
- Higher bets therefore grant more XP without using an uncapped linear formula.
- The current per-landing wager XP boost appears on the START ROUND button.

### Skin values and overdue collateral

Paid frog skins have increased shop values:

| Skin | New shop value | Bank collateral value |
|---|---:|---:|
| King Frog | 5,000 F | 4,000 F |
| Robo Frog | 15,000 F | 12,000 F |
| Ghost Frog | 35,000 F | 28,000 F |
| Dragon Frog | 80,000 F | 64,000 F |
| Dino Frog | 150,000 F | 120,000 F |
| Ninja Frog | 300,000 F | 240,000 F |
| Alien Frog | 750,000 F | 600,000 F |
| Rockstar Frog | 2,500,000 F | 2,000,000 F |
| Owner Frog | 2,000,000,000 F | 1,600,000,000 F |

Collateral rules:

1. On the first completed round while overdue, the Bank liquidates the cheapest owned paid skin.
2. The Classic Frog is free and can never be seized.
3. The Bank applies 80% of the skin's shop value to the loan.
4. Any proceeds beyond the remaining debt are returned to the wallet.
5. A collateral seizure never increases repayment-tier progress because it happened after default.
6. Levels are removed only after no paid skin remains.
7. If the seized skin was equipped, Classic Frog is equipped automatically.

The loan warning now discloses this order before money is redeemed.


## v25 uncapped rolling-median wager XP

The 2,000-XP wager-bonus ceiling has been removed.

XP now uses the median of the latest 20 completed wagers. While a round is active, its locked
wager is included in the median calculation. Before a round begins, the currently selected bet
is included as the prospective wager.

`landing bonus = floor(4 × sqrt(median wager ÷ 50))`

There is no game-defined maximum. JavaScript's safe-number boundary remains the only technical
limit inherited from the rest of the game's fictional currency system.

Why median instead of average:

- One unusually large wager cannot distort XP for many rounds.
- Consistently larger wagers steadily raise the bonus.
- Lowering wagers consistently also lowers the rolling bonus.
- The latest 20 completed wagers are retained; older wagers fall out automatically.

The existing multipliers remain:

- Each successful landing receives one wager-XP bonus.
- A normal cash-out receives two additional wager-XP bonuses.
- Clearing all fifteen jumps receives three additional wager-XP bonuses.

The Start Round button now shows the rolling median wager and resulting XP per landing.
Existing saves migrate with an empty history and begin learning from the next completed wagers.


## v26 always-visible loan actions

The loan amount sheet no longer requires scrolling to find the next action.

- Quote details scroll independently inside the modal.
- **REVIEW FINAL WARNING** stays fixed at the bottom of the quote sheet.
- The button immediately displays the currently selected principal.
- The footer remains visible on short phone screens and respects the device safe area.
- Validation errors appear directly above the fixed review button.
- The final warning also has a fixed footer.
- **CANCEL** and **REDEEM MONEY** remain visible while the warning text scrolls.
- No loan calculations, warnings, repayment rules, XP rules, Piggy rules or collateral rules were changed.


## v27 always-visible repayment controls

When an active loan exists and the Loans pane is open, a repayment dock remains fixed directly
above the bottom navigation.

The dock contains:

- **PAY AMOUNT DUE** when a payment is due.
- **PAY NEXT PAYMENT EARLY** before the deadline.
- **PAY OFF EARLY** at all times when the wallet can cover the payoff.
- The current scheduled amount and countdown or due status.

The dock disappears immediately after the loan is cleared. It is also automatically hidden
outside the Bank Loans pane and does not appear over Piggy Bank.

Additional layout behavior:

- Bank content receives extra bottom spacing while the dock is present, so no information is
  permanently covered.
- The dock respects the device safe area.
- Compact phone layouts reduce button height and type size.
- Very narrow screens stack the two actions vertically.
- No loan calculations, deadlines, interest, collateral, tier, XP or Piggy rules changed.


## v28 Froggy Arcade — major expansion

### Arcade game system

The Play screen is now Froggy Arcade with game tabs and persistent game licenses. Lily Leap remains free. Sky Crash costs 25,000,000 F in owned wallet funds and includes five starter Training Glider flights. The game-license architecture is designed so future games can be added without rebuilding navigation or save data.

### Sky Crash

- The selected frog visibly climbs through the sky inside the selected plane, rocket, or starship.
- A multiplier grows in real time from 1.00×.
- The player may eject manually or set an auto-eject multiplier.
- The hidden crash point is generated at launch with a 3% house edge.
- Each vehicle has a multiplier ceiling. Reaching it triggers an automatic safe eject.
- One vehicle flight is consumed per launch.

### Consumable flight vehicles

| Vehicle | Pack price | Flights | Max multiplier |
|---|---:|---:|---:|
| Training Glider | 500,000 F | 10 | 2.50× |
| Pond Prop Plane | 2,500,000 F | 25 | 8.00× |
| Lily Rocket | 12,000,000 F | 50 | 25.00× |
| Cosmic Starship | 75,000,000 F | 100 | 100.00× |

Vehicles are bought and selected in Collection → Vehicles. Loan-tagged money cannot purchase licenses, vehicles, frogs, lakes, or Piggy deposits.

### Credit score and risk pricing

Loan tiers still grow from Froggy repaid on time, but the amount available today is now adjusted by a 0–100 credit score. On-time payments raise the score; missed deadlines and leveraged losses lower it. The total finance charge starts around 8% and rises with limit utilization and weak credit, capped at 18%.

### Optional loan leverage

New loan principal is tagged separately inside the wallet. The player may keep leverage off and risk owned money only, or turn it on in the Arcade.

- At most 35% of the original loan may be used in one round.
- Borrowed funds are used first when leverage is on.
- Losing borrowed stake adds a 12% risk charge to debt and moves the due clock one round closer.
- Winning with borrowed stake automatically sends 25% of profit to debt.
- Scheduled payments require owned funds.
- Early payoff returns unused tagged loan funds first, then charges only the remaining owned-cash requirement.
- Existing v27 loans migrate with zero tagged loan funds because old saves did not record which wallet coins remained borrowed.


## v29 unified laptop and phone game layout

The Play screen is now a centered vertical container. Lily Leap and Sky Crash own matching responsive layouts.

### Laptop and desktop
- Lily Leap: large lake on the left, betting controls on the right.
- Sky Crash: large flight scene on the left, launch controls on the right.
- Both games are centered and use the available content width.
- Arcade selection and leverage controls stay above the game instead of becoming side columns.
- Content maximum increased from 1,180 px to 1,320 px.

### Phone
- Both games use a matching scene-above-controls layout.
- The Arcade selector becomes a compact two-button bar.
- Lily Leap Start, Jump and Cash Out stay inside the viewport.
- Sky Crash Launch and Eject stay directly below the flight scene.
- Short phone screens receive tighter scene and control sizing.

## v29 vehicle economy

| Vehicle | New price | New maximum |
|---|---:|---:|
| Training Glider | 750,000 F | 7.50× |
| Pond Prop Plane | 4,000,000 F | 24.00× |
| Lily Rocket | 20,000,000 F | 75.00× |
| Cosmic Starship | 120,000,000 F | 300.00× |


## v30 asset-backed bank

The v28 credit-score and separate leverage system has been removed. Loan money now enters the
normal wallet and behaves like every other Froggy balance.

Loan maximum:

- 5,000 F starter allowance.
- Plus 50% of total bank-appraised collateral.
- Hard principal cap: 2,500,000,000 F.
- Fixed 8% total interest.
- One active loan, ten fixed payments, one payment every five completed rounds.

Appraisals:

- Paid skins: 80% of shop value.
- Paid lakes: 70% of shop value.
- Owned vehicle models: 50% of pack price.
- Paid arcade licenses: 60% of license price.
- Piggy savings: 90% of the saved balance.

Piggy savings present when a loan begins are pledged. New Piggy deposits and interest above the
pledged amount remain withdrawable. When overdue, the bank seizes pledged Piggy first, followed
by vehicle models, lakes, skins and paid game licenses. Levels are reduced only when no asset
collateral remains.

Repayment history is still recorded for stats but no longer increases the borrowing limit.

## v30 manual Sky Crash

- Auto-eject amount and all automatic cash-out logic were removed.
- The player must press **PULL OUT NOW** before the hidden failure point.
- Vehicle redlines are dangerous limits, not automatic safe cash-outs.
- A short launch countdown gives the player time to prepare.
- Multiplier growth was reduced from `exp(time × 0.32)` to `exp(time × 0.12)`.
- Canvas altitude uses eased interpolation so the frog vehicle climbs smoothly rather than
  snapping upward.
- The displayed payout already includes the 3% flight fee.
- Bet controls now include **MIN**, **÷2**, **×2**, and **MAX**.
- Exact typing remains available but is no longer required.
- All four vehicle models were redrawn with layered vector shapes, metallic gradients, cockpit
  glass, wings/fins, propulsion trails, lighting and frog cockpit placement.


## v31 clear flight view and safe shop

### Sky Crash

- Starting a flight hides the entire betting and vehicle setup panel.
- The sky animation expands across the available game area.
- PULL OUT NOW sits in a separate dock below the animation, never over the aircraft.
- On phones, the Arcade selector hides while a flight is active.
- The four-card HUD collapses to one small redline indicator.
- The status message becomes a small corner chip.
- The multiplier remains visible without covering the plane.

### Compact balances

Narrow balance displays use compact values such as 1.24K, 1.24M, 1B and 1.25T. The exact amount remains in title and accessibility metadata. Detailed bank and transaction text still uses full values.

### Shop button safety

- Green always means a purchase will spend Froggy.
- Grey means locked, selected or already owned.
- Owned vehicles have a separate grey SELECT VEHICLE button.
- Buying flights has its own green BUY FLIGHTS button.
- Selecting a vehicle never purchases flights.
- Every flight refill shows a native confirmation with price, current flights and resulting flights before charging the wallet.


## v32 direct pledged-asset loans

The former appraisal percentages and 50% bank advance were removed.

`available loan = min(2,500,000,000 F, 5,000 F + total Bank Value)`

Every eligible asset contributes its full displayed Bank Value:

- Paid characters: purchase price.
- Paid lakes: purchase price.
- Owned vehicle models: model purchase price.
- Every unused purchased flight: vehicle bundle price divided by flights in the bundle.
- Paid game licenses: purchase price.
- Piggy savings: 1 F of Bank Value per 1 F stored.

The loan builder now contains a collateral picker.

- AUTO-PLEDGE selects enough collateral for the chosen principal.
- CLEAR removes the selection for manual choosing.
- Characters, lakes, vehicle models and licenses are full-value toggles.
- Piggy savings and flights can be pledged in exact quantities.
- The first 5,000 F is unsecured.
- Only assets explicitly listed in the final warning may be seized.
- Pledged flights are reserved and cannot be used until payoff.
- New flights purchased during an active loan remain unpledged and usable.
- Paying the loan off releases all remaining collateral.
- The principal hard cap is 2,500,000,000 F.

Existing active v31 loans migrate by pledging the assets that were already exposed under the
older all-assets collateral rule.

## v32 Sky Crash result

A successful manual pullout now shows two separate amounts:

- Total Froggy returned.
- Profit after subtracting the original wager.

## v32 Piggy Bank

Piggy interest remains 0.1%, but the cycle was shortened from twenty completed rounds to ten.
This gives more frequent saving feedback while preserving the same small individual interest rate.


## v33 clickable vehicle warning

When Sky Crash has no usable flights, its warning banner is now an interactive shortcut.

- The warning appears automatically when every vehicle has zero usable flights.
- It also appears when **START FLIGHT** is pressed without a usable flight.
- Clicking or tapping the banner opens **Collection → Vehicles** directly.
- Keyboard users can activate it with Enter or Space.
- The Vehicles collection tab is selected automatically.
- The first available purchase or refill action is scrolled into view and briefly highlighted.
- The warning distinguishes between consumed flights and flights reserved as Bank collateral.
- The shortcut cannot activate while a game round is active.


## v34 vehicle economy

Permanent vehicle models and consumable flights are now completely separate.

| Vehicle | Model price | Refill pack | Redline | Suggested pullout |
|---|---:|---:|---:|---:|
| Training Glider | 750,000 F | 10 flights / 25,000 F | 5× | 1.30×–2.50× |
| Pond Prop Plane | 4,000,000 F | 25 flights / 150,000 F | 12× | 1.50×–4.00× |
| Lily Rocket | 20,000,000 F | 50 flights / 750,000 F | 30× | 2.00×–8.00× |
| Cosmic Starship | 120,000,000 F | 100 flights / 4,000,000 F | 100× | 3.00×–15.00× |

Vehicle perks:

- Training Glider has the slowest, easiest-to-read multiplier animation.
- Pond Prop Plane awards 5% additional Sky Crash XP on successful pullout.
- Lily Rocket awards 10% additional XP and one free flight every ten completed flights.
- Cosmic Starship awards 15% additional XP and two free flights every ten completed flights.
- Completing a flight means either pulling out or crashing; milestone progress is never lost.

Flights are no longer part of Bank Value.

- Flights cannot be selected as collateral.
- Flights cannot be reserved.
- Flights cannot be seized after default.
- Existing v32/v33 flight pledges are automatically released.
- Permanent vehicle models retain their full purchase-price Bank Value.

## v34 time-based Piggy Bank

Round-based Piggy interest was removed.

- While the app is running: 0.2% per completed 20-minute cycle.
- While the app is closed: 0.1% per completed 20-minute cycle.
- Closing the app means no game page is running. No interaction timer is used.
- Partial time carries across closing and reopening.
- A mixed cycle receives proportional interest. For example, ten open minutes and ten closed minutes produce approximately 0.15%.
- Interest compounds whenever a 20-minute cycle finishes.
- The Piggy screen shows the live time remaining, expected next interest and current open-app rate.
- If savings reach zero, the timer restarts when a new deposit is made.

The browser stores a timestamp every few seconds and on normal page close. On the next launch,
the elapsed closed-app time is processed at the 0.1% rate.

## v35 fair Sky Crash unlock and Piggy promo rates

Sky Crash now has two independent unlock paths. The player chooses either path; they are never combined.

- Pay **500,000 F** to unlock Sky Crash early.
- Reach **Level 35** to unlock Sky Crash free.
- Either unlock path includes five starter Training Glider flights.
- Reaching Level 35 automatically grants the license if it is still locked.
- The Sky Crash license Bank Value now follows the new 500,000 F license price.

Two reusable Piggy Bank promo codes were added:

- `+1` — adds one percentage point to both Piggy rates, changing open time from 0.2% to 1.2% and closed time from 0.1% to 1.1% per 20-minute cycle.
- `reset` — restores the normal 0.2% open and 0.1% closed rates.

The promo changes affect future elapsed time. Already credited Piggy interest is never removed.



## v36 navigation cleanup

- Removed the public Promo tab and Promo screen. Legacy public promo-code redemption is no longer available.
- Preserved the v35 Sky Crash unlock, vehicle economy, Bank rules, saves, and time-based Piggy behavior.


## v37 protected loan reserve and trusted Piggy clock

- While a loan is active, the exact current early-payoff amount is reserved in the wallet and cannot be deposited into the Piggy Bank.
- The deposit limit updates after every completed round because earned loan interest changes the early-payoff amount.
- Denied deposits explain the reserved payoff amount, the remaining depositable surplus, and why the reserve can rise.
- Open-app Piggy time now uses the browser's monotonic session timer, so changing the device clock while playing has no effect.
- Closed-time Piggy interest is calculated only from a same-origin trusted server timestamp. When trusted time is unavailable, closed interest pauses while open-app interest continues.
- If the Piggy balance changes before trusted time is available, any unverified closed-time gap is discarded instead of being applied retroactively to the new balance.
- The first v37 online launch establishes the trusted-clock baseline; unverified pre-upgrade closed time is not credited.
- The service worker bypasses its cache for trusted-time checks.


## v39 gameplay reliability and Sky Crash update

- Restored resilient Web Audio initialization across touch, mouse, keyboard and app resume.
- Sky Crash acceleration now increases during the climb.
- Reaching a vehicle redline safely triggers an automatic pullout instead of a loss.
- Protected rounds now apply consistently across arcade gameplay.

## v38 audio and Sky Crash update

- Restored Web Audio startup across touch, mouse, and keyboard interactions, including suspended-context recovery on mobile browsers.
- Sky Crash now accelerates more strongly as the multiplier rises.
- Reaching a vehicle's redline automatically secures the payout instead of causing a loss.
- Protected rounds now apply to Sky Crash. When active, the flight displays “PROTECTED ROUND”; a would-be crash becomes an automatic protected payout.
- Protected-round wording appears in the game only while protection is active.


## v40 fry-drop physics and illustrated Job update

- Uses the supplied illustrated fry and paper-bag artwork.
- The Job game is the first content shown on the Job tab; job progression appears below it.
- Fries can move freely only above the drop line. Releasing starts a fast gravity-driven drop.
- The moving bag has rim collision physics: edge hits can deflect a fry inward or outward.
- Successful drops show the exact Froggy and regular XP earned.
- Red fries are bombs. They may be dropped away safely or expire on their own; catching one triggers an explosion and ends the shift with “YOU CAUGHT A BOMB.”
- Removed the Tung Tung Tung Sahur event.
- Main navigation remains on one line across phone widths.



## v42 Job and Sky Crash polish

- Job HUD cards use light surfaces with crisp black outlines instead of dark filled tiles and heavy shadows.
- The compact boost readout shows only the active multiplier, such as `2×F`, `4×F`, or `2×XP`. Catching another matching special fry before its 20-second boost expires doubles the matching boost and resets its timer.
- Job pay no longer stops at 250 F per fry. Pay and base XP continue increasing with Job Level using diminishing growth so high levels remain rewarding without rising linearly out of control; active XP boosts multiply the scaled XP reward.
- Grabbing a fry immediately prepares the next fry above the line, keeping the shift fast while the released fry falls.
- Every resolved Job attempt counts as a completed gameplay round, including successful catches, misses, caught bombs, and deliberately discarded bombs. This advances Bank payment timing and other round-based systems.
- The illustrated bag asset was cleaned of stray low-alpha pixels, and its moving render avoids filtered transparent layers that can leave texture trails on some mobile browsers.
- Sky Crash fills the available game viewport without page scrolling. Before launch, the compact status clearly states whether the next flight is protected; during flight, the top-left badge appears only for an active protected round.
- The Sky Crash fee applies only to profit. Pulling out at 1.00× returns the complete stake instead of returning less than the amount wagered.

## v41 full-screen Job and collision fairness

- Renames the current product presentation to Froggy Leap.
- Makes the Job game fill the available screen between the top bar and navigation, with all Job information in the fixed HUD.
- Expands the bag opening to match the visible artwork and uses swept collision checks so fast fries cannot skip through it between frames.
- Adds physical rim and outer-side reactions while slowing bag movement during a falling fry for fairer catches.
- Changes shift earnings to green with a dark outline for readability on the white result card.


## v47 — Piggy-first overdue installments and 2.5B cap

- Increased the hard loan-principal cap to **2,500,000,000 F**.
- An overdue penalty now collects only the **current payment due**, never the entire remaining loan balance.
- Piggy savings are used first. If Piggy cannot fully cover the installment, the cheapest eligible pledged permanent asset is liquidated for only the remaining amount. Any unused liquidation value returns to the wallet.
- Once the overdue installment is covered, the next payment is scheduled five completed rounds later.
