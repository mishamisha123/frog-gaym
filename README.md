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

This build includes an unmistakable yellow badge reading **v22 · 15 JUMPS** above the start button.

After uploading all files to GitHub Pages, visit:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/refresh.html`

That helper unregisters old service workers and removes stale cached game files, while preserving localStorage progress. It then redirects to the newest game.

The correct build must visibly show:

- `v22 · 15 JUMPS`
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
