import { Handlers, PageProps } from "$fresh/server.ts";
import { TeamController } from "../../controllers/TeamController.ts";
import { PlayerController } from "../../controllers/PlayerController.ts";
import { GameController } from "../../controllers/GameController.ts";
import { Team } from "../../models/Team.ts";
import { Player } from "../../models/Player.ts";
import { Game } from "../../models/Game.ts";

interface TeamPageData {
  team: Team;
  players: Player[];
  games: Game[];
}

export const handler: Handlers<TeamPageData | null> = {
  async GET(_req, ctx) {
    const team = await TeamController.getTeamByAbbreviation(
      ctx.params.abbreviation,
    );
    if (!team) {
      return ctx.renderNotFound();
    }
    const [players, games] = await Promise.all([
      PlayerController.getPlayersByTeamId(team.id),
      GameController.getGamesByTeamId(team.id),
    ]);
    return ctx.render({ team, players, games });
  },
};

export default function TeamPage(
  { data: { team, players, games } }: PageProps<TeamPageData>,
) {
  return (
    <div class="p-4 mx-auto max-w-screen-xl">
      <h1 class="text-2xl font-bold mb-4">
        {TeamController.getTeamDisplayName(team)}
      </h1>
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="grid grid-cols-3 gap-4">
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
          {team.arena && (
            <div>
              <p class="text-gray-600">Arena</p>
              <p class="font-medium">
                {team.arena} {team.arenaCapacity &&
                  `(${team.arenaCapacity.toLocaleString()} capacity)`}
              </p>
            </div>
          )}
          {team.dLeagueAffiliation && (
            <div>
              <p class="text-gray-600">G League Affiliation</p>
              <p class="font-medium">{team.dLeagueAffiliation}</p>
            </div>
          )}
        </div>

        {(team.owner || team.generalManager || team.headCoach) && (
          <div class="mt-4 pt-4 border-t">
            <div class="grid grid-cols-3 gap-4">
              {team.owner && (
                <div>
                  <p class="text-gray-600">Owner</p>
                  <p class="font-medium">{team.owner}</p>
                </div>
              )}
              {team.generalManager && (
                <div>
                  <p class="text-gray-600">General Manager</p>
                  <p class="font-medium">{team.generalManager}</p>
                </div>
              )}
              {team.headCoach && (
                <div>
                  <p class="text-gray-600">Head Coach</p>
                  <p class="font-medium">{team.headCoach}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {(team.facebook || team.twitter || team.instagram) && (
          <div class="mt-4 pt-4 border-t">
            <p class="text-gray-600 mb-2">Social Media</p>
            <div class="flex gap-4">
              {team.facebook && (
                <a
                  href={team.facebook}
                  target="_blank"
                  rel="noopener"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Facebook
                </a>
              )}
              {team.twitter && (
                <a
                  href={team.twitter}
                  target="_blank"
                  rel="noopener"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Twitter
                </a>
              )}
              {team.instagram && (
                <a
                  href={team.instagram}
                  target="_blank"
                  rel="noopener"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <h2 class="text-xl font-bold mb-4">Roster</h2>
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Height
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Birthdate
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {players.map((player) => (
              <tr key={player.id} class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{player.fullName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  {player.position}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  {player.jersey}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  {PlayerController.formatPlayerHeight(player.height)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  {player.weight} lbs
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  {PlayerController.formatBirthdate(player.birthdate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 class="text-xl font-bold mb-4 mt-8">Games</h2>
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {games.map((game) => (
              <tr key={game.id} class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <a href={`/games/${game.id}`} class="text-blue-600 hover:text-blue-800">
                    {GameController.formatGameDate(game.gameDate)}
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {GameController.getGameScore(game)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {game.arena}, {game.city}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {game.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="mt-6">
        <a href="/teams" class="text-blue-600 hover:text-blue-800">
          ← Back to Teams
        </a>
      </div>
    </div>
  );
}
