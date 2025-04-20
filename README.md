# NBA-Fresh

This demo project relies on the
[NBA database](https://www.kaggle.com/datasets/wyattowalsh/basketball/data)
from 2023.

## Architecture

- Runtime: [deno](https://docs.deno.com/runtime/)
- Frontend: [fresh](https://fresh.deno.dev/docs/getting-started)
- Database: [sqlite](https://sqlite.org/) via the
  [Deno SQLite Module](https://deno.land/x/sqlite@v3.9.1)

## Usage

List of existing tasks:

```
- check
    deno fmt --check && deno lint && deno check **/*.ts && deno check **/*.tsx
- cli
    echo "import '\$fresh/src/dev/cli.ts'" | deno run --unstable -A -
- manifest
    deno task cli manifest $(pwd)
- start
    deno run -A --watch=static/,routes/ dev.ts
- build
    deno run -A dev.ts build
- preview
    deno run -A main.ts
- update
    deno run -A -r https://fresh.deno.dev/update .
- test
    deno test --allow-env --allow-read --allow-write
```

## TODO

### Improve robustness without exposing PII

- Use www.synthesized.io to create a masked database that doesn't contain any
  PII, then check that all the tests still pass.

### UI improvements

- Display teams in 6 divisions of 5 teams each.
- Write a script to scrape team logos from https://www.nba.com/teams

### Player page

- Create a dedicated player page to show additional information, and link to it
  from the team's roster.
- On the Player page, show their stats (aka "splits") per season.

### Game page

- Improve the Game model with the game_summary and line_score tables.
- Show the Game's detailed `play_by_play` if available.

### Various issues

- Figure out why the `team_info_common` table is empty.
- Figure out why the following teams don't have details available: SAS|San
  Antonio Spurs WAS|Washington Wizards CHA|Charlotte Hornets
- Figure out what to do with the `other_stats` table.
- Why is "Kristaps Porziņģis" (BOS) shown as playing number 6 instead of 8?

# NBA Fresh UI Improvement TODO List

Based on review and comparison with nba.com:

- [ ] **Visual Appeal & Branding:**
  - [ ] Add team logos to Teams list page (`/teams`)
  - [ ] Add team logos to Team detail page (`/teams/[abbreviation]`)
  - [ ] Add team logos to Game detail page (`/games/[id]`)
  - [ ] Incorporate team colors on team pages
  - [ ] Add player headshots to roster table on team page

- [ ] **Navigation:**
  - [ ] Implement a persistent navigation bar (`_app.tsx`)
  - [ ] Add breadcrumbs for navigation context

- [ ] **Team Page (`/teams/[abbreviation].tsx`):**
  - [ ] Improve layout (e.g., multi-column)
  - [ ] Make roster table sortable
  - [ ] Enhance game list presentation (logos, home/away indication, win/loss)

- [ ] **Game Page (`/games/[id].tsx`):**
  - [ ] Improve score display prominence (larger font, logos)
  - [ ] Ensure clear display of game context (date, season, etc.)
  - [ ] Add box score data (if available)

- [ ] **Teams List Page (`/teams/index.tsx`):**
  - [ ] Implement a grid layout with team logos

- [ ] **General Styling:**
  - [ ] Refine Tailwind usage for more polished components (buttons, cards, tables)
  - [ ] Add hover effects and clear visual cues for interactive elements
