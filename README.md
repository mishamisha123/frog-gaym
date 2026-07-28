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
- Hard principal cap: 1,000,000,000 F.
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

`available loan = min(1,000,000,000 F, 5,000 F + total Bank Value)`

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
- The principal hard cap remains 1,000,000,000 F.

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
