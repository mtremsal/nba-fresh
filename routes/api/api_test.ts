import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { afterAll, describe, it } from "jsr:@std/testing/bdd";
import { Team } from "../../models/Team.ts";
import { Player } from "../../models/Player.ts";
import { Game } from "../../models/Game.ts";
import { createHandler } from "$fresh/server.ts";
import manifest from "../../fresh.gen.ts";
import config from "../../fresh.config.ts";
import { closeDb } from "../../utils/db.ts";

const BASE_URL = "http://localhost"; // Define base URL constant

afterAll(() => {
  closeDb();
});

describe("API Endpoints", () => {
  describe("Teams API", () => {
    it("should get all teams", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request(`${BASE_URL}/api/teams`);
      const response = await handler(req);
      assertEquals(response.status, 200);

      const data = await response.json();
      assertExists(data);
      assertEquals(Array.isArray(data), true);
      assertEquals(data.length > 0, true);

      // Verify team structure more thoroughly
      const team = data[0] as Team;
      assertExists(team.id);
      assertEquals(typeof team.id, "string");
      assertExists(team.fullName);
      assertEquals(typeof team.fullName, "string");
      assertExists(team.abbreviation);
      assertEquals(typeof team.abbreviation, "string");
      assertExists(team.nickname);
      assertEquals(typeof team.nickname, "string");
      assertExists(team.city);
      assertEquals(typeof team.city, "string");
      assertExists(team.state);
      assertEquals(typeof team.state, "string");
      assertExists(team.yearFounded);
      assertEquals(typeof team.yearFounded, "number");
      if (team.arena) assertEquals(typeof team.arena, "string");
      if (team.arenaCapacity) assertEquals(typeof team.arenaCapacity, "number");
      if (team.owner) assertEquals(typeof team.owner, "string");
      if (team.generalManager) assertEquals(typeof team.generalManager, "string");
      if (team.headCoach) assertEquals(typeof team.headCoach, "string");
      if (team.dLeagueAffiliation) assertEquals(typeof team.dLeagueAffiliation, "string");
    });

    it("should get team by abbreviation", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request(`${BASE_URL}/api/teams?abbreviation=LAL`);
      const response = await handler(req);
      assertEquals(response.status, 200);

      const team = await response.json() as Team;
      assertEquals(team.abbreviation, "LAL");
      assertEquals(team.city, "Los Angeles");
      assertEquals(team.nickname, "Lakers");
      assertEquals(typeof team.id, "string");
      assertEquals(team.fullName, "Los Angeles Lakers");
      assertEquals(typeof team.yearFounded, "number");
    });

    it("should get team by ID", async () => {
      const handler = await createHandler(manifest, config);
      const teamByAbbrReq = new Request(`${BASE_URL}/api/teams?abbreviation=LAL`);
      const teamByAbbrResp = await handler(teamByAbbrReq);
      const teamData = await teamByAbbrResp.json() as Team;
      const teamId = teamData.id;
      assertExists(teamId);

      const req = new Request(`${BASE_URL}/api/teams?id=${teamId}`);
      const response = await handler(req);
      assertEquals(response.status, 200);

      const team = await response.json() as Team;
      assertEquals(team.id, teamId);
      assertEquals(team.abbreviation, "LAL");
      assertEquals(team.city, "Los Angeles");
      assertEquals(team.nickname, "Lakers");
    });

    it("should prioritize abbreviation over ID when both are provided", async () => {
      const handler = await createHandler(manifest, config);
      const teamLALReq = new Request(`${BASE_URL}/api/teams?abbreviation=LAL`);
      const teamLALResp = await handler(teamLALReq);
      const teamLAL = await teamLALResp.json() as Team;

      const teamBOSReq = new Request(`${BASE_URL}/api/teams?abbreviation=BOS`);
      const teamBOSResp = await handler(teamBOSReq);
      const teamBOS = await teamBOSResp.json() as Team;

      assertNotEquals(teamLAL.id, teamBOS.id);

      const req = new Request(`${BASE_URL}/api/teams?abbreviation=LAL&id=${teamBOS.id}`);
      const response = await handler(req);
      assertEquals(response.status, 200);

      const team = await response.json() as Team;
      assertEquals(team.id, teamLAL.id);
      assertEquals(team.abbreviation, "LAL");
    });

    it("should return 404 for non-existent team abbreviation", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request(`${BASE_URL}/api/teams?abbreviation=XXX`);
      const response = await handler(req);
      assertEquals(response.status, 404);
      await response.json();
    });

    it("should return 404 for non-existent team ID", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request(`${BASE_URL}/api/teams?id=nonexistent-id-123`);
      const response = await handler(req);
      assertEquals(response.status, 404);
      await response.json();
    });
  });

  describe("Players API", () => {
    it("should get all players", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request(`${BASE_URL}/api/players`);
      const response = await handler(req);
      assertEquals(response.status, 200);

      const data = await response.json();
      assertExists(data);
      assertEquals(Array.isArray(data), true);
      assertEquals(data.length > 0, true);

      const player = data[0] as Player;
      assertExists(player.id);
      assertEquals(typeof player.id, "string");
      assertExists(player.firstName);
      assertEquals(typeof player.firstName, "string");
      assertExists(player.lastName);
      assertEquals(typeof player.lastName, "string");
      assertExists(player.teamId);
      assertEquals(typeof player.teamId, "string");
      assertExists(player.position);
      assertEquals(typeof player.position, "string");
      assertExists(player.height);
      assertEquals(typeof player.height, "string");
      assertExists(player.weight);
      assertEquals(typeof player.weight, "string");
      assertExists(player.jersey);
      assertEquals(typeof player.jersey, "string");
    });

    it("should get players by team ID", async () => {
      const handler = await createHandler(manifest, config);
      const teamsReq = new Request(
        `${BASE_URL}/api/teams?abbreviation=LAL`,
      );
      const teamsResponse = await handler(teamsReq);
      const team = await teamsResponse.json() as Team;

      const playersReq = new Request(
        `${BASE_URL}/api/players?teamId=${team.id}`,
      );
      const response = await handler(playersReq);
      assertEquals(response.status, 200);

      const players = await response.json() as Player[];
      assertEquals(Array.isArray(players), true);
      assertEquals(players.length > 0, true);
      assertEquals(players.every((p) => p.teamId === team.id), true);

      const player = players[0];
      assertExists(player.id);
      assertEquals(typeof player.firstName, "string");
      assertEquals(typeof player.lastName, "string");
    });

    it("should get player by ID", async () => {
      const handler = await createHandler(manifest, config);
      const allPlayersReq = new Request(`${BASE_URL}/api/players`);
      const allPlayersResp = await handler(allPlayersReq);
      const allPlayers = await allPlayersResp.json() as Player[];
      const playerToFetch = allPlayers[0];
      assertExists(playerToFetch?.id);

      const req = new Request(`${BASE_URL}/api/players?id=${playerToFetch.id}`);
      const response = await handler(req);
      assertEquals(response.status, 200);

      const player = await response.json() as Player;
      assertEquals(player.id, playerToFetch.id);
      assertEquals(player.firstName, playerToFetch.firstName);
      assertEquals(player.lastName, playerToFetch.lastName);
      assertEquals(player.teamId, playerToFetch.teamId);
    });

    it("should return empty array for team ID with no players", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request(`${BASE_URL}/api/players?teamId=0`);
      const response = await handler(req);
      assertEquals(response.status, 200);
      const players = await response.json() as Player[];
      assertEquals(Array.isArray(players), true);
      assertEquals(players.length, 0);
    });

    it("should return 404 for non-existent player ID", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request(`${BASE_URL}/api/players?id=nonexistent`);
      const response = await handler(req);
      assertEquals(response.status, 404);
      await response.json();
    });
  });

  describe("Games API", () => {
    it("should get all games", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request(`${BASE_URL}/api/games`);
      const response = await handler(req);
      assertEquals(response.status, 200);

      const data = await response.json();
      assertExists(data);
      assertEquals(Array.isArray(data), true);
      assertEquals(data.length > 0, true);

      const game = data[0] as Game;
      assertExists(game.id);
      assertEquals(typeof game.id, "string");
      assertExists(game.gameDate);
      assertEquals(typeof game.gameDate, "string");
      assertExists(game.homeTeamId);
      assertEquals(typeof game.homeTeamId, "string");
      assertExists(game.visitorTeamId);
      assertEquals(typeof game.visitorTeamId, "string");
      assertExists(game.homeTeamScore);
      assertEquals(typeof game.homeTeamScore, "number");
      assertExists(game.visitorTeamScore);
      assertEquals(typeof game.visitorTeamScore, "number");
      assertExists(game.season);
      assertEquals(typeof game.season, "string");
    });

    it("should get games by team ID", async () => {
      const handler = await createHandler(manifest, config);
      const teamsReq = new Request(`${BASE_URL}/api/teams?abbreviation=LAL`);
      const teamsResponse = await handler(teamsReq);
      const team = await teamsResponse.json() as Team;

      const gamesReq = new Request(
        `${BASE_URL}/api/games?teamId=${team.id}`,
      );
      const response = await handler(gamesReq);
      assertEquals(response.status, 200);

      const games = await response.json() as Game[];
      assertEquals(Array.isArray(games), true);
      assertEquals(games.length > 0, true);
      assertEquals(
        games.some((g) => g.homeTeamId === team.id || g.visitorTeamId === team.id),
        true,
      );

      const game = games[0];
      assertExists(game.id);
      assertEquals(typeof game.gameDate, "string");
      assertEquals(typeof game.homeTeamScore, "number");
    });

    it("should get game by ID", async () => {
      const handler = await createHandler(manifest, config);
      const allGamesReq = new Request(`${BASE_URL}/api/games`);
      const allGamesResp = await handler(allGamesReq);
      const allGames = await allGamesResp.json() as Game[];
      const gameToFetch = allGames[0];
      assertExists(gameToFetch?.id);

      const req = new Request(`${BASE_URL}/api/games?id=${gameToFetch.id}`);
      const response = await handler(req);
      assertEquals(response.status, 200);

      const game = await response.json() as Game;
      assertEquals(game.id, gameToFetch.id);
      assertEquals(game.gameDate, gameToFetch.gameDate);
      assertEquals(game.homeTeamId, gameToFetch.homeTeamId);
      assertEquals(game.visitorTeamId, gameToFetch.visitorTeamId);
    });

    it("should return empty array for team ID with no games", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request(`${BASE_URL}/api/games?teamId=0`);
      const response = await handler(req);
      assertEquals(response.status, 200);
      const games = await response.json() as Game[];
      assertEquals(Array.isArray(games), true);
      assertEquals(games.length, 0);
    });

    it("should return 404 for non-existent game ID", async () => {
      const handler = await createHandler(manifest, config);
      const req = new Request(`${BASE_URL}/api/games?id=nonexistent-id-12345`);
      const response = await handler(req);
      assertEquals(response.status, 404);
      await response.json();
    });
  });
});
