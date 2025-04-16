import { Handlers, PageProps } from "$fresh/server.ts";
import { TeamController } from "../../controllers/TeamController.ts";
import { Team } from "../../models/Team.ts";

export const handler: Handlers<Team[]> = {
  async GET(_req, ctx) {
    const teams = await TeamController.getAllTeams();
    return ctx.render(teams);
  },
};

export default function TeamsPage({ data: teams }: PageProps<Team[]>) {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold mb-4">NBA Teams</h1>
      <div class="grid grid-cols-1 gap-4">
        {teams.map((team) => (
          <div key={team.id} class="border p-4 rounded-lg">
            <h2 class="text-xl font-semibold">{TeamController.getTeamDisplayName(team)}</h2>
            <p class="text-gray-600">
              {team.city}, {team.state} • Est. {team.yearFounded}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}