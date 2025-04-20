import { Handlers, PageProps } from "$fresh/server.ts";
import { GameController } from "../../controllers/GameController.ts";
import { TeamController } from "../../controllers/TeamController.ts";
import { Game } from "../../models/Game.ts";
import { Team } from "../../models/Team.ts";

interface GamePageData {
  game: Game;
  homeTeam: Team;
  visitorTeam: Team;
  breadcrumbItems: { label: string; href?: string }[];
}

export const handler: Handlers<GamePageData | null> = {
  async GET(_req, ctx) {
    const game = await GameController.getGameById(ctx.params.id);
    if (!game) {
      return ctx.renderNotFound();
    }

    const [homeTeam, visitorTeam] = await Promise.all([
      TeamController.getTeamById(game.homeTeamId),
      TeamController.getTeamById(game.visitorTeamId),
    ]);

    if (!homeTeam || !visitorTeam) {
      return ctx.renderNotFound();
    }

    const breadcrumbItems = [
      { label: "Games" }, // No href makes it non-clickable
      {
        label: `${TeamController.getTeamDisplayName(homeTeam)} vs ${
          TeamController.getTeamDisplayName(visitorTeam)
        }`,
      },
    ];

    return ctx.render({
      game,
      homeTeam,
      visitorTeam,
      breadcrumbItems,
    });
  },
};

export default function GamePage(
  { data: { game, homeTeam, visitorTeam } }: PageProps<GamePageData>,
) {
  const season = `${game.season.slice(-4)}-${
    (parseInt(game.season.slice(-4)) + 1).toString().slice(-2)
  }`;

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="p-4 mx-auto max-w-screen-xl">
        <div class="mb-6">
          <div class="text-gray-600">
            {season} • {GameController.formatGameDate(game.gameDate)} •{" "}
            {game.city}
            {game.attendance &&
              ` • ${game.attendance.toLocaleString()} attendance`}
          </div>
          <h1 class="text-2xl font-bold mt-2">
            <a
              href={`/teams/${homeTeam.abbreviation}`}
              class="text-blue-600 hover:text-blue-800"
            >
              {TeamController.getTeamDisplayName(homeTeam)}
            </a>
            {" vs "}
            <a
              href={`/teams/${visitorTeam.abbreviation}`}
              class="text-blue-600 hover:text-blue-800"
            >
              {TeamController.getTeamDisplayName(visitorTeam)}
            </a>
          </h1>
        </div>

        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <div class="flex justify-around items-center text-center">
            <div class="flex flex-col items-center w-1/3">
              <img
                src={TeamController.getTeamLogoUrl(homeTeam.id)}
                alt={`${TeamController.getTeamDisplayName(homeTeam)} logo`}
                class="h-20 w-20 mb-2 object-contain"
              />
              <a
                href={`/teams/${homeTeam.abbreviation}`}
                class="text-xl font-semibold text-blue-700 hover:text-blue-900"
              >
                {TeamController.getTeamDisplayName(homeTeam)}
              </a>
              <span class="text-5xl font-bold mt-2">{game.homeTeamScore}</span>
            </div>
            <div class="text-2xl font-light text-gray-500">VS</div>
            <div class="flex flex-col items-center w-1/3">
              <img
                src={TeamController.getTeamLogoUrl(visitorTeam.id)}
                alt={`${TeamController.getTeamDisplayName(visitorTeam)} logo`}
                class="h-20 w-20 mb-2 object-contain"
              />
              <a
                href={`/teams/${visitorTeam.abbreviation}`}
                class="text-xl font-semibold text-blue-700 hover:text-blue-900"
              >
                {TeamController.getTeamDisplayName(visitorTeam)}
              </a>
              <span class="text-5xl font-bold mt-2">
                {game.visitorTeamScore}
              </span>
            </div>
          </div>
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
