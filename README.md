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
