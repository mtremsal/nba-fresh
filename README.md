# NBA 2022-23

This demo project relies on the
[NBA database](https://www.kaggle.com/datasets/wyattowalsh/basketball/data)
from 2023, to display information from season 2022-23.

## Architecture

- Runtime: [deno](https://docs.deno.com/runtime/)
- Frontend: [fresh](https://fresh.deno.dev/docs/getting-started)
- Database: [sqlite](https://sqlite.org/) via the
  [Deno SQLite Module](https://deno.land/x/sqlite@v3.9.1)

## Vibe Coding Instructions

- Follow the MVC approach. Always ensure that routes for the UI have a corresponding API route. These API routes should have extensive tests, ensuring that our models work as expected.
- Always read the README and analyze the codebase before planning how to tackle a new feature.
- If I ask to think or plan, then do not code. Only suggest an approach.
- If we're implementing a feature, then don't suggest code changes, simply implement them directly.
- Always run `deno fmt` before committing changes.

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

### Games page

- Create a main Games page with all games in the season.
- Implement filters and pagination to make it easy to find a game.

### Player page

- Create a dedicated player page to show additional information, and link to it
  from the team's roster.
- On the Player page, show their stats (aka "splits") per season.

### Various issues

- Figure out why the `team_info_common` table is empty.
- Figure out why home-away information is sometimes inconsistent or wrong in some tables.
- Figure out why the following teams don't have details available: 
  SAS|San Antonio Spurs WAS|Washington Wizards CHA|Charlotte Hornets
- Figure out what to do with the `other_stats` table.
- Why is "Kristaps Porziņģis" (BOS) shown as playing number 6 instead of 8?
