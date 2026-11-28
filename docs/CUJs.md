# Anchor — Critical User Journeys (CUJs)

Anchor is designed around **peacetime preparation and 1-tap 3 AM support** for two independent-minded partners raising a resilient, emotionally grounded child (`0–3+ years`) while protecting their marriage, careers, and individual lives.

---

## Core Surfaces
- **Bottom Navigation (4 Peacetime Tabs):** `Today` · `How-To` · `By Age` · `Parents`
- **Top Utility Bar:** `[Baby / Stage · Settings]` pill on the left + `[Calm]` (daytime) / `[3 AM]` (nighttime) support pill on the right.

---

## Supported Critical User Journeys

| # | CUJ | User Flow | Automated Coverage |
| :---: | :--- | :--- | :--- |
| **1** | **5-Second Onboarding & Expecting Shortcut** | Enter Baby’s DOB (auto-computes week & stage across 8 stages from `0–6w` to `2–3y`), tap `Expecting? Start at 0–6w →`, or jump straight to any age in a compact 4×2 grid. Bottom-thumb `Need help right now?` opens SOS before setup. | `src/App.test.tsx`, `src/domain/stageEngine.test.ts` |
| **2** | **Morning Coffee / Dual Daily Habit (`Today`)** | Read 1 stage-matched **Kid Practice** + 1 **Marriage & Self Habit** with editorial un-crowded headers and bottom-thumb actions (`Mark practiced`, `Another`, `Bookmark`, `Share`). Tap any plain-English philosophy pill to view its source books & core ideas. | `src/features/today/TodayView.test.tsx` |
| **3** | **5:30 PM Work-to-Home Decompression (`Today`)** | Between 4:30–7:00 PM, `After-Work Reset` auto-expands with a 16-second guided **2 Physiological Sighs** pacer, career-guilt reframe, and 6-second partner greeting ritual. | `src/features/today/TodayView.test.tsx` |
| **4** | **9 PM Couch Debrief & Instant Lookup (`How-To`)** | Search any keyword (`colic`, `gagging`, `biting`, `bedtime`) with cross-stage fallback, filter by stage-matched situations, or open unified `Saved (N)` bookmarks (both `Today` habits and `How-To` guides). Read 3 numbered 10-second steps + exact scripts + `5% Emergency Only` guardrails, and share via SMS/WhatsApp in 1 tap. | `src/features/how-to/HowToView.test.tsx`, `src/content/content.test.ts` |
| **5** | **New Stage Orientation (`By Age`)** | Scannable 2-minute cheat sheet for all 8 stages (`0–6w` through `2–3y`): 5 domain cards × 3 crisp bullets (including the `0–4m` *Possums* biological-rhythm to `4m+` *Le Cadre* transition). | `src/features/by-age/ByAgeView.test.tsx`, `src/content/content.test.ts` |
| **6** | **Sunday Couple Check-In, House Rules & Personal Time (`Parents`)** | Run a **5-Min Weekly Check-In** (*Us first* + *Fair load* + 6-second kiss), pin/customize **Our House Rules** (collapsing unpinned suggestions once active) and share as a united front, and protect guilt-free weekly **Personal Time** blocks for both partners. | `src/features/parents/ParentsView.test.tsx` |
| **7** | **3 AM Wake-Up & Soothing Handoff (`3 AM` / `Calm`)** | Deep night (`11 PM–6 AM`) tucks daytime habits behind 1 tap so `Night Companion` owns the screen. Run the stage-calibrated *La Pause* timer with Wake Lock, or tap `Still crying? See step-by-step soothing holds →` to jump straight to `How-To` (`Crying & Gas` or `Tantrums & "No!"`). | `src/features/sos/SosOverlay.test.tsx`, `src/App.test.tsx` |
| **8** | **Overwhelmed Reset, Native Back & Safe Persistence** | Live 4s/6s breathing pacer + Safe-Sleep crib pause + Repair scripts + Crisis lines (`988`, Maternal Mental Health, PSI). Native Android Back (`popstate`) + swipe-down sheet dismissal + shadow `localStorage` + 7-day rolling IndexedDB auto-backups (`v7` schema migration). | `src/features/shell/navigation.test.tsx`, `src/state/useAppStore.test.ts`, `src/state/dailyBackup.test.ts` |
