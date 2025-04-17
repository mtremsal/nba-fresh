import { Handlers } from "$fresh/server.ts";
import { TeamModel } from "../../models/Team.ts";

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const abbreviation = url.searchParams.get("abbreviation");
      const id = url.searchParams.get("id");

      let data;
      if (abbreviation) {
        data = await TeamModel.getByAbbreviation(abbreviation);
        if (!data) {
          return new Response(JSON.stringify({ error: "Team not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else if (id) {
        data = await TeamModel.getById(id);
        if (!data) {
          return new Response(JSON.stringify({ error: "Team not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else {
        data = await TeamModel.getAll();
      }

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};