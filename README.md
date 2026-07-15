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
- Owner Frog costs **1,000,000,000 Froggy** and requires **level 20,000** unless unlocked through `unlockall`.
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

This build includes an unmistakable yellow badge reading **v17 · 15 JUMPS** above the start button.

After uploading all files to GitHub Pages, visit:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/refresh.html`

That helper unregisters old service workers and removes stale cached game files, while preserving localStorage progress. It then redirects to the newest game.

The correct build must visibly show:

- `v17 · 15 JUMPS`
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
