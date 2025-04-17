# NBA-Fresh

This demo project relies on the [NBA database](https://www.kaggle.com/datasets/wyattowalsh/basketball/data) from 2023.

## Architecture

* Runtime: [deno](https://docs.deno.com/runtime/)
* Frontend: [fresh](https://fresh.deno.dev/docs/getting-started)
* Database: [sqlite](https://sqlite.org/) via the [Deno SQLite Module](https://deno.land/x/sqlite@v3.9.1)

## Usage

Start the project:

```
deno task start
```

## TODO

* Figure out why the `team_info_common` table is empty.
* Figure out why the following teams don't have details available:
    SAS|San Antonio Spurs
    WAS|Washington Wizards
    CHA|Charlotte Hornets
* Build a Game model based on the following tables:
    game: 65698
    game_info: 58053
    game_summary: 58110
    line_score: 58053
    play_by_play: 13592899
* Figure out what to do with the `other_stats` table.