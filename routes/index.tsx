import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    const headers = new Headers();
    headers.set("location", "/teams");
    return new Response(null, {
      status: 307,
      headers,
    });
  },
};
