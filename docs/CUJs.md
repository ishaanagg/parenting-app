# Anchor — Critical User Journeys (CUJs) & Critical Review

This document records the **8 Critical User Journeys** supported by Anchor today, their automated test coverage, and a candid stress-test of where each CUJ works well vs. where it can break or be refined in real-world use.

---

## 1. Supported CUJs Today

| # | CUJ | User Flow Supported Today | Automated Coverage |
| :---: | :--- | :--- | :--- |
| **1** | **5-Second Onboarding** | Open app → enter Baby’s DOB (auto-computes week & stage) **or** tap any of the 5 stages (`0–6w` to `9–12m`). Zero login, 100% on-device. | `src/App.test.tsx`, `src/domain/stageEngine.test.ts` |
| **2** | **3 AM Emergency Bypass** | Tap **Need help right now?** on Onboarding (before DOB) or persistent **SOS** in the bottom thumb bar → land directly on bottom-aligned 2-path Distress Triage. | `src/App.test.tsx`, `src/features/sos/SosOverlay.test.tsx` |
| **3** | **3 AM *La Pause* & Cry Triage** | Between 9 PM–6 AM, Today promotes a 1-tap **Night Companion** (*La Pause* + *Breathe*) and Moments defaults to `3 AM`. Run the stage-calibrated wall-clock *La Pause* timer (`1:00`–`3:00`) with Screen Wake Lock, optional completion vibration (when supported), post-pause decision guide, stage-filtered cry cues, and pediatrician/fever thresholds. | `src/features/sos/SosOverlay.test.tsx`, `src/features/moments/MomentsView.test.tsx` |
| **4** | **Overwhelmed / Triggered Reset & Repair** | Tap **SOS → I’m overwhelmed** or tap *Touched-out* / *Triggered* in Today’s Check-In → follow live 4s-in / 6s-out dual-ring **Breathing Pacer** + Safe-Sleep crib permission → switch tabs for out-loud **Repair scripts**, **Trigger check**, and **Crisis help** (*Never Shake* + 1-tap 988 / Maternal Mental Health / PSI call links). | `src/features/sos/SosOverlay.test.tsx`, `src/features/today/TodayView.test.tsx` |
| **5** | **Guilt-Free Daily Practice** | On **Today**, read 1 stage-aware micro-practice from the 3 books → optionally expand **Why this works** or tap the book badge for a 1-screen **Framework Guide** → 1-tap **Mark practiced** (undoable, zero streaks) or cycle endlessly via **Another (`1/5`)** → view quiet *"X of Y practices tried recently"* progress. | `src/features/today/TodayView.test.tsx`, `src/domain/stageEngine.test.ts` |
| **6** | **Just-In-Time Moment Lookup** | On **Moments**, filter stage-scoped cards (`3 AM`, `Fussy`, `Sleep`, `Feeding`, `Boundaries` for 6–12m, `Triggers`, `Repair`) → read action-first **Try now** (with 1-tap jump to *La Pause* timer on sleep-transition cards) → tap any book pill to open its **Framework Guide**. | `src/features/moments/MomentsView.test.tsx`, `src/content/content.test.ts` |
| **7** | **Profile, Stage & Adaptive Day/Night Theme** | Tap the stage/settings pill on Today or Moments → set **Your name**, **Baby’s name**, **Baby’s DOB**, browse any stage (with `"Return to DOB stage"`), and switch Appearance between **Auto** (Warm Linen Paper 6 AM–9 PM / Warm Espresso 9 PM–6 AM), **Day**, and **Night**. | `src/features/shell/SettingsSheet.test.tsx`, `src/App.test.tsx` |
| **8** | **Safe Persistence, Daily Auto-Backup & Recovery** | Writes mirror automatically to a shadow `localStorage` backup (self-heals on corruption). Once per day on first open, Anchor silently saves a 7-day rolling snapshot to IndexedDB and requests persistent storage. In **Settings → Backup & recovery**, restore any daily snapshot in 1 tap, download/copy a `.json` backup, or restore from file/pasted JSON. | `src/state/useAppStore.test.ts`, `src/state/dailyBackup.test.ts`, `src/features/shell/SettingsSheet.test.tsx` |

*Fallback safety net:* `ErrorBoundary` ensures even an unexpected runtime crash renders Safe-Sleep and crisis guidance (`src/features/shell/ErrorBoundary.test.tsx`).

---

## 2. Critical Stress-Test: What Works, What Can Break, & How to Refine

### CUJ 1 — 5-Second Onboarding
- **Works:** Zero login, instant setup, private on-device.
- **Where it falls short:**
  - *Expecting parents:* `max={today}` blocks future due dates; parents preparing pre-birth can't enter an expected due date.
  - *Premature babies:* Developmental stages often track adjusted age rather than calendar DOB.
- **Refinement:** Keep DOB primary, add a subtle *"Expecting? Start with 0–6 Weeks"* hint, and note adjusted age in Settings.

### CUJ 2 — 3 AM Emergency Bypass
- **Works:** Never blocks SOS behind onboarding; bottom-aligned triage cards fit one-handed reach.
- **Where it falls short:**
  - On Onboarding, `"Need help right now?"` sits in the **top-right corner** (hardest thumb reach on large phones).
  - Pre-onboarding SOS silently defaults to `0–6 Weeks` (`1:00` pause), which may surprise a parent of an older baby.
- **Refinement:** Anchor the onboarding SOS escape button near the bottom action area (or keep it full-width below the headline).

### CUJ 3 — 3 AM *La Pause* & Cry Triage
- **Works:** Wall-clock timer survives screen lock; Wake Lock keeps screen awake; Night Companion cuts navigation to 1 tap.
- **Where it falls short:**
  - **2 taps to start from Night Companion:** Tapping `La Pause (2:00)` opens the screen, then requires a second tap on `Start La Pause`.
  - **Locked-screen haptics:** If a parent locks their phone manually, Wake Lock releases and `navigator.vibrate` won't fire in the background (and iOS Safari doesn't support `navigator.vibrate` at all).
  - **`0–6w` triage label wording:** `"Baby is crying / 3 AM wake-up"` can imply pausing on a hungry newborn cry, whereas `0–6w` La Pause is strictly for sleep grunts/stirring.
- **Refinement:** Support an `autoStart` option when launched from Night Companion's `La Pause` button, and tailor the `0–6w` triage subtitle to *"Sleep grunts & stirring (feed if truly crying)"*.

### CUJ 4 — Overwhelmed / Triggered Reset & Repair
- **Works:** Dual-ring 4s/6s breathing pacer + stepped tabs (`Repair` / `Trigger check` / `Crisis help`) eliminate mid-crisis text walls.
- **Where it falls short:**
  - **No breath-cycle milestone:** The pacer loops indefinitely without a gentle *"3 breaths done — ready for a next step?"* transition cue.
  - **US-centric hotlines:** `988` / `1-833-852-6262` / `1-800-944-4773` are US-specific (other countries rely on the generic footnote).
- **Refinement:** Add a quiet breath counter (`Breath 1 of 3` → soft prompt to view Repair scripts) without stopping the pacer.

### CUJ 5 — Guilt-Free Daily Practice
- **Works:** Anti-guilt, undoable completion, `1/5` rotation, quiet `"tried recently"` reflection.
- **Where it falls short:**
  - **Pool repetition:** 5–6 practices per 3-month stage will repeat after ~1–2 weeks of daily use.
  - **No Bookmark / Pin:** Seeing a great practice at 8 AM that you want to try at dinner has no way to stay pinned or be recalled later.
  - **No 12–24m stages yet:** Baby outgrows `9–12m` at week 53.
- **Refinement:** Expand each stage to 10–12 practices, add `12–18m` / `18–24m` toddler stages, and add a quiet 1-tap **Bookmark / Save** on practices & wisdom cards.

### CUJ 6 — Just-In-Time Moment Lookup
- **Works:** Action-first `Try now`, auto-`3 AM` at night, stage-adaptive `Boundaries` filter.
- **Where it falls short:**
  - **No instant search:** As cards grow past ~20, finding a specific issue (e.g., *teething*, *throwing food*, *biting*) via filter chips alone gets slower.
  - **No 1-tap Share:** Working parents often want to text a helpful card or script to a partner/caregiver without screenshotting.
- **Refinement:** Add a lightweight local keyword filter once content exceeds ~20 cards, plus a 1-tap **Share / Copy** icon on each card.

### CUJ 7 — Profile, Stage & Adaptive Day/Night Theme
- **Works:** Auto Day/Night (Warm Linen Paper vs. Warm Espresso), instant manual override, dynamic status-bar `theme-color`.
- **Where it falls short:**
  - **Settings discoverability:** Putting Settings on the top-right stage pill is clean, but a user specifically looking for *"Backup"* or *"Change theme"* may scan the bottom bar first.
- **Refinement:** Keep the 3-item bottom bar clean, and ensure the Settings pill clearly signals its affordance (done via sliders icon) — optionally add a tiny *"Settings"* caption or tooltip if real users miss it.

### CUJ 8 — Safe Persistence, Daily Auto-Backup & Recovery
- **Works:** `localStorage` + shadow copy + once-a-day IndexedDB 7-day rolling snapshots + `storage.persist()` + manual `.json` export/import.
- **Where it falls short:**
  - **Full browser-data wipe / lost phone:** Clearing "All site data" wipes both `localStorage` and IndexedDB together—only an exported `.json` file (saved to Drive/iCloud) survives.
  - **Startup recovery gap:** If `localStorage` is ever cleared *without* clearing IndexedDB, the app currently lands on Onboarding instead of automatically checking IndexedDB and offering *"Restore your backup from Nov 26?"*.
  - **Morning-only snapshot freshness:** Running strictly on first open captures *yesterday's* final state; changes made later in the day aren't reflected in today's snapshot until tomorrow morning.
- **Refinement (Highest-Leverage Data Fix):**
  1. On Onboarding, silently check `listDailyBackups()` — if snapshots exist, show a calm 1-tap **"Restore previous backup"** banner.
  2. Allow today's IndexedDB snapshot to refresh when profile/settings change (still keeping 1 snapshot per day, 7 days rolling).
