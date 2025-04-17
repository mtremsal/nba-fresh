# NBA-Fresh

This demo project relies on na NBA database.

## Architecture

* runtime: [Deno](https://docs.deno.com/runtime/)
* frontend: [Fresh](https://fresh.deno.dev/docs/getting-started)
* Database: [sqlite](https://sqlite.org/) via the [Deno SQLite Module](https://deno.land/x/sqlite@v3.9.1)

## Usage

Start the project:

```
deno task start
```

## TODO

* Figure out why the `team_info_common` table is empty.