import { Handlers } from "$fresh/server.ts";
import { PlayerModel } from "../../models/Player.ts";

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      const teamId = url.searchParams.get("teamId");

      let data;
      if (id) {
        data = await PlayerModel.getById(id);
        if (!data) {
          return new Response(JSON.stringify({ error: "Player not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else if (teamId) {
        data = await PlayerModel.getByTeamId(teamId);
      } else {
        data = await PlayerModel.getAll();
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
