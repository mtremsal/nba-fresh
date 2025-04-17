import { Handlers, PageProps } from "$fresh/server.ts";
import { GameController } from "../../controllers/GameController.ts";
import { TeamController } from "../../controllers/TeamController.ts";
import { Game } from "../../models/Game.ts";
import { Team } from "../../models/Team.ts";

interface GamePageData {
  game: Game;
  homeTeam: Team;
  visitorTeam: Team;
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

    return ctx.render({ game, homeTeam, visitorTeam });
  },
};

export default function GamePage(
  { data: { game, homeTeam, visitorTeam } }: PageProps<GamePageData>,
) {
  const season = `${game.season.slice(-4)}-${(parseInt(game.season.slice(-4)) + 1).toString().slice(-2)}`;
  return (
    <div class="p-4 mx-auto max-w-screen-xl">
      <div class="mb-6">
        <div class="text-gray-600">
          {season} • {GameController.formatGameDate(game.gameDate)} • {game.city}
          {game.attendance && ` • ${game.attendance.toLocaleString()} attendance`}
        </div>
        <h1 class="text-2xl font-bold mt-2">
          <a href={`/teams/${homeTeam.abbreviation}`} class="text-blue-600 hover:text-blue-800">
            {TeamController.getTeamDisplayName(homeTeam)}
          </a>
          {" vs "}
          <a href={`/teams/${visitorTeam.abbreviation}`} class="text-blue-600 hover:text-blue-800">
            {TeamController.getTeamDisplayName(visitorTeam)}
          </a>
        </h1>
      </div>
      
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-center items-center text-4xl font-bold tracking 1px space-x-4">
          <div class="flex items-center">
            <span class="w-20 text-right">{homeTeam.abbreviation}</span>
            <span class="w-16 text-right ml-2">{game.homeTeamScore}</span>
          </div>
          <span class="mx-4">-</span>
          <div class="flex items-center">
            <span class="w-16 text-left">{game.visitorTeamScore}</span>
            <span class="w-20 text-left ml-2">{visitorTeam.abbreviation}</span>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <a href="/teams" class="text-blue-600 hover:text-blue-800">
          ← Back to Teams
        </a>
      </div>
    </div>
  );
}