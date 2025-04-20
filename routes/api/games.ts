import { Handlers } from "$fresh/server.ts";
import { GameModel } from "../../models/Game.ts";

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      const teamId = url.searchParams.get("teamId");

      let data;
      if (id) {
        data = await GameModel.getById(id);
        if (!data) {
          return new Response(JSON.stringify({ error: "Game not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else if (teamId) {
        data = await GameModel.getByTeamId(teamId);
      } else {
        data = await GameModel.getAll();
      }

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : "An unknown error occurred";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
