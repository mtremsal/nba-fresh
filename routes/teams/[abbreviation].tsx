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
  currentSeason: string;
  prevSeason: string;
  nextSeason: string;
  minSeason: string;
  maxSeason: string;
  breadcrumbItems: { label: string; href?: string }[];
}

export const handler: Handlers<TeamPageData | null> = {
  async GET(req, ctx) {
    const team = await TeamController.getTeamByAbbreviation(
      ctx.params.abbreviation,
    );
    if (!team) {
      return ctx.renderNotFound();
    }

    const url = new URL(req.url);
    const seasons = await GameController.getSeasons(team.id);
    const currentSeason = url.searchParams.get("season") ||
      GameController.DEFAULT_SEASON;

    // Sort seasons by year and find the valid range
    const sortedSeasons = [...seasons].sort((a, b) =>
      GameController.getSeasonStartYear(b) -
      GameController.getSeasonStartYear(a)
    );
    const minSeason = sortedSeasons[sortedSeasons.length - 1];
    const maxSeason = sortedSeasons[0];

    const [players, games] = await Promise.all([
      PlayerController.getPlayersByTeamId(team.id),
      GameController.getGamesByTeamId(team.id, currentSeason),
    ]);

    const breadcrumbItems = [
      { label: "Teams", href: "/teams" },
      { label: TeamController.getTeamDisplayName(team) },
    ];

    return ctx.render({
      team,
      players,
      games,
      currentSeason,
      prevSeason: GameController.getPreviousSeason(currentSeason),
      nextSeason: GameController.getNextSeason(currentSeason),
      minSeason,
      maxSeason,
      breadcrumbItems,
    });
  },
};

export default function TeamPage(
  {
    data: {
      team,
      players,
      games,
    },
  }: PageProps<TeamPageData>,
) {
  return (
    <div class="min-h-screen bg-gray-50">
      <div class="p-4 mx-auto max-w-screen-xl">
        {/* Added Team Logo next to the name */}
        <div class="flex items-center mb-4">
          <img
            src={TeamController.getTeamLogoUrl(team.id)}
            alt={`${TeamController.getTeamDisplayName(team)} logo`}
            class="h-16 w-16 mr-4 object-contain" // Slightly larger logo
          />
          <h1 class="text-3xl font-bold">
            {/* Increased heading size */}
            {TeamController.getTeamDisplayName(team)}
          </h1>
        </div>

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
                    <div class="font-medium text-gray-900">
                      {player.fullName}
                    </div>
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

        <div class="flex justify-between items-center mt-8 mb-4">
          <h2 class="text-xl font-bold">Games</h2>
          {/* Season navigation removed as per request */}
        </div>

        <div class="bg-white shadow rounded-lg overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                {/* Added Logo column headers */}
                <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Home Team
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                {/* Added Logo column headers */}
                <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Away Team
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {games.map((game) => (
                <tr key={game.id} class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`/games/${game.id}`}
                      class="text-blue-600 hover:text-blue-800"
                    >
                      {GameController.formatGameDate(game.gameDate)}
                    </a>
                  </td>
                  {/* Added Home Team Logo */}
                  <td class="px-2 py-4 whitespace-nowrap text-center">
                    <img
                      src={TeamController.getTeamLogoUrl(game.homeTeamId)}
                      alt={`${game.homeTeamName} logo`}
                      class="h-6 w-6 mx-auto object-contain"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {game.homeTeamName}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap font-medium">
                    {GameController.getGameScore(game)}
                  </td>
                  {/* Added Visitor Team Logo */}
                  <td class="px-2 py-4 whitespace-nowrap text-center">
                    <img
                      src={TeamController.getTeamLogoUrl(game.visitorTeamId)}
                      alt={`${game.visitorTeamName} logo`}
                      class="h-6 w-6 mx-auto object-contain"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {game.visitorTeamName}
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
    </div>
  );
}
