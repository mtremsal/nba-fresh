import { Handlers, PageProps } from "$fresh/server.ts";
import { TeamController } from "../../controllers/TeamController.ts";
import { Team } from "../../models/Team.ts";

export const handler: Handlers<Team | null> = {
  async GET(_req, ctx) {
    const team = await TeamController.getTeamByAbbreviation(ctx.params.abbreviation);
    if (!team) {
      return ctx.renderNotFound();
    }
    return ctx.render(team);
  },
};

export default function TeamPage({ data: team }: PageProps<Team>) {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold mb-4">{TeamController.getTeamDisplayName(team)}</h1>
      <div class="bg-white shadow rounded-lg p-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-600">Full Name</p>
            <p class="font-medium">{team.fullName}</p>
          </div>
          <div>
            <p class="text-gray-600">Abbreviation</p>
            <p class="font-medium">{team.abbreviation}</p>
          </div>
          <div>
            <p class="text-gray-600">Location</p>
            <p class="font-medium">{team.city}, {team.state}</p>
          </div>
          <div>
            <p class="text-gray-600">Founded</p>
            <p class="font-medium">{team.yearFounded}</p>
          </div>
        </div>
        <div class="mt-6">
          <a href="/teams" class="text-blue-600 hover:text-blue-800">← Back to Teams</a>
        </div>
      </div>
    </div>
  );
}