import { assertEquals, assertExists } from "jsr:@std/assert";
import { afterAll, describe, it } from "jsr:@std/testing/bdd";
import { Team } from "../../models/Team.ts";
import { Player } from "../../models/Player.ts";
import { Game } from "../../models/Game.ts";
import { createHandler } from "$fresh/server.ts";
import manifest from "../../fresh.gen.ts";
import config from "../../fresh.config.ts";
import { closeDb } from "../../utils/db.ts";

afterAll(() => {
  closeDb();
});

describe("API Endpoints", () => {
  describe("Teams API", () => {
    it("should get all teams", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request("http://localhost/api/teams");
      const response = await handler(req);
      assertEquals(response.status, 200);

      const data = await response.json();
      assertExists(data);
      assertEquals(Array.isArray(data), true);
      assertEquals(data.length > 0, true);

      // Verify team structure
      const team = data[0] as Team;
      assertExists(team.id);
      assertExists(team.fullName);
      assertExists(team.abbreviation);
    });

    it("should get team by abbreviation", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request("http://localhost/api/teams?abbreviation=LAL");
      const response = await handler(req);
      assertEquals(response.status, 200);

      const team = await response.json() as Team;
      assertEquals(team.abbreviation, "LAL");
      assertEquals(team.city, "Los Angeles");
      assertEquals(team.nickname, "Lakers");
    });

    it("should return 404 for non-existent team", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request("http://localhost/api/teams?abbreviation=XXX");
      const response = await handler(req);
      assertEquals(response.status, 404);
      await response.json();
    });
  });

  describe("Players API", () => {
    it("should get all players", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request("http://localhost/api/players");
      const response = await handler(req);
      assertEquals(response.status, 200);

      const data = await response.json();
      assertExists(data);
      assertEquals(Array.isArray(data), true);
      assertEquals(data.length > 0, true);

      // Verify player structure
      const player = data[0] as Player;
      assertExists(player.id);
      assertExists(player.firstName);
      assertExists(player.lastName);
      assertExists(player.teamId);
    });

    it("should get players by team ID", async () => {
      // First get a valid team ID
      const handler = await createHandler(manifest, config);
      const teamsReq = new Request(
        "http://localhost/api/teams?abbreviation=LAL",
      );
      const teamsResponse = await handler(teamsReq);
      const team = await teamsResponse.json() as Team;

      const playersReq = new Request(
        `http://localhost/api/players?teamId=${team.id}`,
      );
      const response = await handler(playersReq);
      assertEquals(response.status, 200);

      const players = await response.json() as Player[];
      assertEquals(Array.isArray(players), true);
      assertEquals(players.length > 0, true);
      assertEquals(players.every((p) => p.teamId === team.id), true);
    });

    it("should return 404 for non-existent player", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request("http://localhost/api/players?id=nonexistent");
      const response = await handler(req);
      assertEquals(response.status, 404);
      await response.json();
    });
  });

  describe("Games API", () => {
    it("should get all games", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request("http://localhost/api/games");
      const response = await handler(req);
      assertEquals(response.status, 200);

      const data = await response.json();
      assertExists(data);
      assertEquals(Array.isArray(data), true);
      assertEquals(data.length > 0, true);

      // Verify game structure
      const game = data[0] as Game;
      assertExists(game.id);
      assertExists(game.gameDate);
      assertExists(game.homeTeamId);
      assertExists(game.visitorTeamId);
    });

    it("should get games by team ID", async () => {
      // First get a valid team ID
      const handler = await createHandler(manifest, config);
      const teamsReq = new Request("http://localhost/api/teams?abbreviation=LAL");
      const teamsResponse = await handler(teamsReq);
      const team = await teamsResponse.json() as Team;

      const gamesReq = new Request(
        `http://localhost/api/games?teamId=${team.id}`,
      );
      const response = await handler(gamesReq);
      assertEquals(response.status, 200);

      const games = await response.json() as Game[];
      assertEquals(Array.isArray(games), true);
      assertEquals(games.length > 0, true);
      // Check that at least one game has the team as either home or visitor
      assertEquals(
        games.some((g) => g.homeTeamId === team.id || g.visitorTeamId === team.id),
        true,
      );
    });

    it("should return 404 for non-existent game", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request("http://localhost/api/games?id=nonexistent");
      const response = await handler(req);
      assertEquals(response.status, 404);
      await response.json();
    });
  });
});
