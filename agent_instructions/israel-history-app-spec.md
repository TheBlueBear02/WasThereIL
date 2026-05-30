# Israel History Population App — Project Spec

## Overview

A mobile-first React web app that shows what percentage of people living in Israel today were physically present in Israel during key historic events. The data is based on the official CBS (Central Bureau of Statistics) 2024 population report.

**Audience & language:** The app targets Israeli users. All user-facing copy is **Hebrew**. Layout is **RTL** (`lang="he"` `dir="rtl"` on `<html>`, `direction: rtl` on `#root`). Main percentage bars use `dir="ltr"`; age-tier bars in `AgeTierChart` use `dir="rtl"`.

---

## V1 Implementation Status (current)

**Stack in repo:** Vite + React 19 + TypeScript + Tailwind CSS v4.

**Population data:** Generated from [`data/israel population (by age).csv`](../data/israel%20population%20(by%20age).csv) via `npm run build:population` → [`src/data/cbs-population.ts`](../src/data/cbs-population.ts). Regenerate after CSV changes; file is auto-generated (do not hand-edit).

- `TOTAL_POPULATION` = **9,749,800** (persons; CSV amounts × 1,000)
- Ages 0–94 plus open-ended bucket at `age: 95` for `95+`

**Reference year:** `REFERENCE_YEAR = 2025` in [`src/lib/calculations.ts`](../src/lib/calculations.ts).

**Immigration adjustments:** Not implemented in V1. Percentages use CBS age eligibility only (no `immigration.ts`).

**Events pool:** All **14** events in [`src/data/events.ts`](../src/data/events.ts) (Hebrew names). Each game picks **4** at random. `category` drives progress bar color via [`src/lib/categoryStyles.ts`](../src/lib/categoryStyles.ts).

**Built UI (game):** `HomeScreen`, `GameScreen` (`GuessPhase` + `CheckPhase`), `ResultsScreen`, `useGameSession`, [`src/lib/game.ts`](../src/lib/game.ts). Reuses `AgeTierChart` on the check phase.

**Legacy browse UI (not mounted):** `PageHeader`, `EventList`, `EventCard` remain in repo but are not used in [`App.tsx`](../src/App.tsx). Deferred: `SummaryBar`, `CategoryFilter`, `useEventFilter`.

---

## Game Mode

Three screens, no router — screen state in [`useGameSession`](../src/hooks/useGameSession.ts):

| Screen | Hebrew actions | Behavior |
|--------|----------------|----------|
| Home | **שחק** | Matzav HaUma header logo (`/images/header-logo.png`), title, description, play starts a session |
| Game | **אישור**, **הבא**, **לתוצאות**, exit (top-left) | 4 rounds; each round has **guessing** then **check**; circular back button (top-left) calls `goHome` and clears the session |
| Results | **שחק שוב**, **חזרה לדף הבית** | Total score + per-round breakdown; play again or home |

### Round flow

1. **Guessing:** Event name + year + short description (centered), then `gap-8` before the question prompt. Upper semicircle donut gauge 0–100% with percentage in the center; drag arc, arrow keys (step 1, Shift+10), or range slider under the gauge. **אישור** in the shared bottom action slot (see Mobile-First UI Notes). **אישור** submits.
2. **Check:** Same header (name, year, description) as guessing. Same half-donut gauge as guessing, read-only with two arcs (guess = muted primary, actual = category stroke color). On enter, the **answer arc and center percentage** animate from 0% to the real value over ~1.6s after a ~400ms pause (`animateCompare` on `HalfDonutGauge`, via [`useAnimatedValue`](../src/hooks/useAnimatedValue.ts); respects `prefers-reduced-motion`). Guess arc is static. Legend under gauge. Approx population count, age-tier card (`rounded-xl` border + `bg-stone-50`) with `AgeTierChart` (`animate`: ~400ms pause, then card fades/slides in and bars fill with staggered delays), round points. **הבא** (rounds 1–3) or **לתוצאות** (round 4).
3. After round 4 check → Results screen.

### Scoring

- Actual % = `getMainPercentage(eventYear) × 100`
- Round points = `max(0, round(100 − |guess% − actual%|))`
- Game total = sum of 4 round scores (max **400**)

### Game logic (`lib/game.ts`)

- `pickRandomEvents(EVENTS, 4)` — Fisher–Yates shuffle
- `getActualPercent`, `scoreRound`, `sumScores`, `formatYearRange`
- `ROUNDS_PER_GAME = 4`

### Session shape (`types/index.ts`)

```
GameSession: events[], roundIndex (0–3), phase ('guessing' | 'check'), roundResults[]
RoundResult: eventId, guessPercent, actualPercent, points
```

---

## Tech Stack

- **Framework:** React (Vite or Next.js)
- **Deployment:** Vercel
- **Database:** Supabase — optional, only needed if you want to store the CBS data remotely or allow user-submitted events in the future. For V1, all data can live as a local JSON/TS constant.
- **Styling:** Tailwind CSS (recommended for mobile-first)
- **Language:** TypeScript
- **UI language:** Hebrew (RTL)

---

## Data Model

### Population Data Source
The CBS 2024 report (`st02_03.pdf`) provides exact population counts (in thousands) broken down by **single year of age**, for the total Israeli population (~9,749,700).

This data should be stored as a typed constant or Supabase table with the following shape:

```
age: number          // 0–94, then 95+
total: number        // total population at that age (in persons, not thousands)
```

**Build:** `npm run build:population` reads the CSV and writes `src/data/cbs-population.ts`.

### Events Data
14 hardcoded events, each with:

```
id: string
name: string          // Hebrew display name
description: string   // Short Hebrew blurb shown under the year on game screens
year: number           // start year (used for age calculation)
endYear: number        // end year (display only)
category: enum         // war | conflict | founding | society | peace | operation | election
```

**The 14 events (Hebrew names in app):**
1. הכרזת העצמאות ומלחמת העצמאות (1948)
2. מבצע קדש / מלחמת סיני (1956)
3. משפט אייכמן (1961)
4. מלחמת ששת הימים (1967)
5. טבח המשחקים האולימפיים במינכן (1972)
6. מלחמת יום הכיפורים (1973)
7. מבצע אנטבה (1976)
8. מלחמת לבנון הראשונה (1982–1985)
9. הסכמי אוסלו (1993)
10. רצח יצחק רבין (1995)
11. האינתיפאדה השנייה (2000–2005)
12. הנסיגה מעזה (2005)
13. מלחמת לבנון השנייה (2006)
14. מתקפת השביעי באוקטובר ומלחמת עזה (2023–2024)

---

## Calculation Logic

This is the core of the app. All logic should live in a dedicated `lib/calculations.ts` file.

### Main Percentage (V1 — no immigration adjustment)
For a given event year, count everyone in the CBS age table who is **old enough** to have been alive in that year (i.e. current age ≥ `REFERENCE_YEAR − eventYear`):

```
eligiblePopulation = sum of CBS ages where (age >= REFERENCE_YEAR - eventYear)
percentage = eligiblePopulation / totalPopulation
```

`REFERENCE_YEAR` is **2025** (exported from `calculations.ts`).

**Future:** Immigration wave subtraction (`immigrationAdjustment(eventYear)`) is spec’d for a later version but not in V1.

### Age Tier Breakdown (shown on card expand)
The card header shows the main percentage (alive at event time, min age 0). On expand, show **4** sub-percentages with a higher minimum age at the time of the event:

| Tier | Label (Hebrew) | Min age at event time |
|---|---|---|
| 1 | מספיק גיל לזכור (5+) | 5 |
| 2 | גיל בר/בת מצווה (13+) | 13 |
| 3 | גיל הצבעה / גיוס (18+) | 18 |
| 4 | בגרות מלאה (21+) | 21 |

For each tier: a person qualifies if their **current age** is ≥ (2025 − eventYear + minAgeAtEvent).

### Number formatting (Hebrew)
- `formatCount`: millions → `X מיליון`, thousands → `X אלף`, else `he-IL` locale
- `formatPercent`: unchanged (`X.X%`)

---

## App Structure

```
/
├── public/
│   ├── favicon.svg
│   └── images/
│       └── header-logo.png        # Matzav HaUma logo on home screen
├── src/
│   ├── data/
│   │   ├── cbs-population.ts      # CBS age data as typed constant
│   │   └── events.ts              # 14 events (Hebrew names)
│   │
│   ├── lib/
│   │   ├── calculations.ts        # Percentage calculation logic
│   │   ├── game.ts                # Game scoring, random pick, year labels
│   │   └── categoryStyles.ts      # Category → Tailwind bar color
│   │
│   ├── hooks/
│   │   └── useGameSession.ts      # Screen + session state machine
│   │
│   ├── components/
│   │   ├── game/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── GameScreen.tsx
│   │   │   ├── GuessPhase.tsx
│   │   │   ├── CheckPhase.tsx
│   │   │   ├── ResultsScreen.tsx
│   │   │   ├── HalfDonutGauge.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   ├── layout/                # Legacy (not mounted)
│   │   │   └── PageHeader.tsx
│   │   │
│   │   └── events/
│   │       ├── EventList.tsx      # Legacy browse list
│   │       ├── EventCard.tsx
│   │       └── AgeTierChart.tsx   # Reused in CheckPhase
│   │
│   ├── types/
│   │   └── index.ts               # Shared types + game session types
│   │
│   └── App.tsx                    # home | game | results
```

---

## Component Breakdown

### `HomeScreen` (replaces mounted `PageHeader`)
- Matzav HaUma logo (`/images/header-logo.png`, `alt="מצב האומה"`, `h-16` / 64px tall, full content width) pinned near top (`pt-2`).
- Hebrew title **אתה זוכר?** (`text-4xl font-bold`) and description sit lower in the scroll area (`pt-14` below logo), **שחק** button.
- Footer line cites CBS 2024 population with `formatCount` (Hebrew units).

### `PageHeader` (legacy, not mounted)
- Same copy as home; kept for reference.

### `SummaryBar`
- 2×2 grid of stat cards (deferred)
- Stats: Total population / Number of events shown / FSU wave size / N.Africa wave size
- Values are static (come from data constants, not calculated)

### `CategoryFilter`
- Horizontal scrollable row of pill buttons (deferred)
- Options (Hebrew): הכל, מלחמה, סכסוך, הקמה, חברה, שלום, מבצע
- One active at a time
- Controls the filter state via `useEventFilter` hook

### `EventList`
- Receives filtered events array
- Maps each to `<EventCard>`
- Handles open/close state (only one card open at a time)

### `EventCard`
- **Collapsed state (always visible):**
  - Event name (Hebrew, start side in RTL) + year range (end side)
  - Horizontal progress bar with main percentage (`dir="ltr"` on bar)
  - Approximate count (e.g. `כ־2.3 מיליון אנשים`)
  - Chevron icon indicating expandable
- **Expanded state (tap to toggle):**
  - Smooth height animation
  - Renders `<AgeTierChart>` below the main bar

### `AgeTierChart`
- Shows 4 horizontal bars (excludes “alive” — same as card header)
- Each bar has: Hebrew label (start), colored progress bar (`dir="rtl"` — fill grows right→left), percentage (end)
- Each tier uses a distinct color
- All percentages are pre-calculated and passed as props
- **`animate` prop (check phase):** ~400ms delay, then container and rows fade/slide in; bar widths grow from 0 with ~80ms stagger between tiers (~500ms width transition). Without `animate` (e.g. `EventCard` expanded), bars render at full width immediately; root keeps `border-t` spacing for browse UI

### `useEventFilter` hook
- Holds `activeCategory` state
- Returns `filteredEvents` based on active category
- Returns `setCategory` setter

---

## Calculation File (`lib/calculations.ts`)

Should export:

```
getMainPercentage(eventYear: number): number
getAgeTiers(eventYear: number): AgeTier[]
getApproxCount(percentage: number): number
formatCount(n: number): string   // e.g. 2300000 → "2.3 מיליון"
formatPercent(ratio: number): string
```

This file should be **pure functions only** — no React, no side effects. Easy to unit test.

---

## RTL & Hebrew UI Notes

- `<html lang="he" dir="rtl">` in `index.html`; `#root { direction: rtl; }` in `index.css`
- Prefer Tailwind `text-start` / `text-end` over `text-left` / `text-right`
- Main percentage bars (e.g. `EventCard`, gauge slider): `dir="ltr"` so 0%→100% fill reads left→right
- Age-tier breakdown bars (`AgeTierChart`): `dir="rtl"` so fill aligns with RTL layout
- Body font stack includes Hebrew-friendly system fonts
- Western digits for years and percentages are acceptable for Israeli audiences

---

## Supabase (Optional — V2)
Not needed for V1. Would be useful if you later want to:
- Let users suggest new events (moderated submission)
- Store CBS data remotely and fetch on load
- Add English as a second locale (translations in DB or i18n files)

If added, create a single `events` table and a `cbs_population` table mirroring the data constants.

---

## Mobile-First UI Notes
- **Primary brand color:** `#4890FD` — defined in [`src/index.css`](../src/index.css) as Tailwind tokens `primary`, `primary-hover`, `primary-muted` (CTA buttons, guess donut arc on guessing phase, guess bar on check phase).
- **Primary CTAs:** [`PrimaryButton`](../src/components/ui/PrimaryButton.tsx) — fixed `h-11` (44px), flex-centered label; used for **שחק**, **אישור**, **הבא**, **לתוצאות**, **שחק שוב**.
- **Bottom action slot:** [`BOTTOM_ACTION_CLASS`](../src/components/layout/bottomAction.ts) — every screen uses `flex flex-1 flex-col` under [`App`](../src/App.tsx)’s `h-svh overflow-hidden` main; primary CTAs sit in this pinned footer (`shrink-0`, top border, `1.5rem` bottom padding plus safe-area inset) so they stay visible without scrolling. Scrollable panels use `flex-1 min-h-0 overflow-y-auto` above the footer (guess, check, results).
- **Game headers:** Event name, year, and short description are **centered** on guess and check phases. Event title uses **bold 2xl/3xl** (`text-2xl sm:text-3xl font-bold`); year label is `text-base text-stone-500`; description is `text-sm text-stone-600`, max width ~384px (`max-w-sm`).
- **Guess gauge:** [`HalfDonutGauge`](../src/components/game/HalfDonutGauge.tsx) — upper-half donut (`dir="ltr"`), **280×158 viewBox**, max width **300px**; filled arc uses `stroke-primary`; 0%/100% labels under the arc. Horizontal `input[type=range]` below the gauge (same state, `accent-primary`), centered at **85%** width (`w-[85%] max-w-xs`).
- **Game content panels:** Gauge section has no border or background fill. Check-phase age breakdown uses a light card (`rounded-xl border-stone-200 bg-stone-50`).
- Max content width: ~430px, centered on desktop
- All tap targets minimum 44px height
- Legacy browse cards (`EventCard`) keep subtle border + `bg-stone-50`; game screen panels do not
- Bar animations on mount: browse `EventCard` / `ProgressBar` use width transition 0.4s ease; check phase uses `useAnimatedValue` (donut answer arc) and `AgeTierChart` staggered bar fill
- Font sizes: game event title 24–30px, year label 16px, card name 14px (browse), percentages 15px, labels 11–12px

---

## What Is NOT in V1
- No user authentication
- No sharing or export
- No server-side rendering required (can be pure client-side React)
- No live data fetching (all data is local constants)
- No immigration wave adjustments
- No category filter or summary bar
