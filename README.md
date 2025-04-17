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

- Build a Game model based on the following tables: game: 65698 game_info: 58053
  game_summary: 58110 line_score: 58053
- Use the Game model to create a Game page that shows overall info from the
  model, as well as the detailed `play_by_play` if available.
- Link each Game to both Teams involved.
- Show a table with all the Games of a Team on its page, after its roster.

### Various issues

- Figure out why the `team_info_common` table is empty.
- Figure out why the following teams don't have details available: SAS|San
  Antonio Spurs WAS|Washington Wizards CHA|Charlotte Hornets
- Figure out what to do with the `other_stats` table.
- Why is "Kristaps Porziņģis" (BOS) shown as playing number 6 instead of 8?
