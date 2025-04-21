import { Handlers, PageProps } from "$fresh/server.ts";
import { GameController } from "../../controllers/GameController.ts";
import { TeamController } from "../../controllers/TeamController.ts";
import { Game, PlayByPlay } from "../../models/Game.ts";
import { Team } from "../../models/Team.ts";
import { ComponentChild } from "preact";

interface GamePageData {
  game: Game;
  homeTeam: Team;
  visitorTeam: Team;
  playByPlay: PlayByPlay[];
  breadcrumbItems: { label: string; href?: string }[];
}

export const handler: Handlers<GamePageData | null> = {
  async GET(_req, ctx) {
    const gameId = ctx.params.id;
    const game = await GameController.getGameById(gameId);
    if (!game) {
      return ctx.renderNotFound();
    }

    const [homeTeam, visitorTeam, playByPlay] = await Promise.all([
      TeamController.getTeamById(game.homeTeamId),
      TeamController.getTeamById(game.visitorTeamId),
      GameController.getPlayByPlay(gameId),
    ]);

    if (!homeTeam || !visitorTeam) {
      return ctx.renderNotFound();
    }

    const breadcrumbItems = [
      { label: "Games" },
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
      playByPlay,
      breadcrumbItems,
    });
  },
};

function renderScoreTable(game: Game, homeTeamData: Team, visitorTeamData: Team) {
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const overtimes: string[] = [];

  // Use live_period to determine how many OT periods were played
  if (game.live_period && game.live_period > 4) {
    const numberOfOTs = game.live_period - 4;
    for (let i = 1; i <= numberOfOTs; i++) {
      overtimes.push(`OT${i}`);
    }
  }

  const periods = [...quarters, ...overtimes];
  const homeWon = game.homeTeamScore > game.visitorTeamScore;
  const visitorWon = game.visitorTeamScore > game.homeTeamScore;

  return (
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
            {periods.map((period) => (
              <th key={period} class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{period}</th>
            ))}
            <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {/* Home Team Row (First) */}
          <tr>
            {/* Display Home Team Name */}
            <td class="px-4 py-2 whitespace-nowrap"><a href={`/teams/${homeTeamData.abbreviation}`} class="text-blue-600 hover:text-blue-800">{TeamController.getTeamDisplayName(homeTeamData)}</a></td>
            {periods.map((period) => {
              const homeScore = game[`pts${period.replace('Q', 'Qtr')}Home`]; // Get Home Score
              const awayScore = game[`pts${period.replace('Q', 'Qtr')}Away`];
              const isHomeHigher = (homeScore ?? -Infinity) > (awayScore ?? -Infinity);
              return (
                // Display Home Score
                <td key={period} class={`px-2 py-2 text-center whitespace-nowrap ${isHomeHigher ? 'font-bold' : ''}`}>
                  {homeScore ?? '-'}
                </td>
              );
            })}
            {/* Display Home Total */}
            <td class={`px-3 py-2 text-right whitespace-nowrap ${homeWon ? 'font-bold' : ''}`}>{game.homeTeamScore}</td>
          </tr>
          {/* Visitor Team Row (Second) */}
          <tr>
            {/* Display Visitor Team Name */}
            <td class="px-4 py-2 whitespace-nowrap"><a href={`/teams/${visitorTeamData.abbreviation}`} class="text-blue-600 hover:text-blue-800">{TeamController.getTeamDisplayName(visitorTeamData)}</a></td>
            {periods.map((period) => {
              const homeScore = game[`pts${period.replace('Q', 'Qtr')}Home`];
              const awayScore = game[`pts${period.replace('Q', 'Qtr')}Away`]; // Get Away Score
              const isAwayHigher = (awayScore ?? -Infinity) > (homeScore ?? -Infinity);
              return (
                // Display Away Score
                <td key={period} class={`px-2 py-2 text-center whitespace-nowrap ${isAwayHigher ? 'font-bold' : ''}`}>
                  {awayScore ?? '-'}
                </td>
              );
            })}
            {/* Display Visitor Total */}
            <td class={`px-3 py-2 text-right whitespace-nowrap ${visitorWon ? 'font-bold' : ''}`}>{game.visitorTeamScore}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Helper function to link player names in descriptions
function linkifyDescription(description: string | undefined | null, play: PlayByPlay): string { // Return type changed to string
  if (!description) {
    return description || "N/A";
  }

  // No need to process players or create links anymore
  return description; 
}

function renderPlayByPlay(playByPlay: PlayByPlay[]) {
  if (!playByPlay || playByPlay.length === 0) {
    return <p>Play-by-play data not available for this game.</p>;
  }

  return (
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Play-by-Play</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {playByPlay.map((play) => (
              <tr key={play.eventNum}>
                <td class="px-4 py-2 whitespace-nowrap">{play.period}</td>
                <td class="px-4 py-2 whitespace-nowrap">{play.pcTimeString}</td>
                <td class="px-4 py-2 whitespace-nowrap">{play.score || "-"}</td>
                <td class="px-4 py-2">{linkifyDescription(play.homeDescription || play.visitorDescription || play.neutralDescription, play)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function GamePage(
  { data: { game, homeTeam, visitorTeam, playByPlay } }: PageProps<GamePageData>,
) {
  const season = `${game.season.slice(-4)}-${
    (parseInt(game.season.slice(-4)) + 1).toString().slice(-2)
  }`;

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="p-4 mx-auto max-w-screen-xl">
        {/* Keep metadata line */}
        <div class="mb-4 text-center text-gray-600">
          {season} • {GameController.formatGameDate(game.gameDate)} • {game.city}
          {game.attendance &&
            ` • ${game.attendance.toLocaleString()} attendance`}
        </div>

        {/* New Visual Header */}
        <div class="flex justify-around items-center text-center mb-6 bg-white shadow rounded-lg p-6">
          {/* Home Team */}
          <div class="flex flex-col items-center w-1/3">
            <img
              src={TeamController.getTeamLogoUrl(homeTeam.id)}
              alt={`${TeamController.getTeamDisplayName(homeTeam)} logo`}
              class="h-24 w-24 mb-2 object-contain" // Increased logo size
            />
            <a
              href={`/teams/${homeTeam.abbreviation}`}
              class="text-xl font-semibold text-blue-700 hover:text-blue-900 mb-1"
            >
              {TeamController.getTeamDisplayName(homeTeam)}
            </a>
            <span class="text-5xl font-bold">{game.homeTeamScore}</span>
          </div>

          {/* VS Separator */}
          <div class="text-2xl font-light text-gray-500">VS</div>

          {/* Visitor Team */}
          <div class="flex flex-col items-center w-1/3">
            <img
              src={TeamController.getTeamLogoUrl(visitorTeam.id)}
              alt={`${TeamController.getTeamDisplayName(visitorTeam)} logo`}
              class="h-24 w-24 mb-2 object-contain" // Increased logo size
            />
            <a
              href={`/teams/${visitorTeam.abbreviation}`}
              class="text-xl font-semibold text-blue-700 hover:text-blue-900 mb-1"
            >
              {TeamController.getTeamDisplayName(visitorTeam)}
            </a>
            <span class="text-5xl font-bold">{game.visitorTeamScore}</span>
          </div>
        </div>

        {/* Line Score Table */}
        <div class="mb-6">
          {renderScoreTable(game, homeTeam, visitorTeam)}
        </div>

        {/* PlayByPlay Table */}
        {renderPlayByPlay(playByPlay)}

        {/* Back Link */}
        <div class="mt-6">
          <a href="/teams" class="text-blue-600 hover:text-blue-800">
            ← Back to Teams
          </a>
        </div>
      </div>
    </div>
  );
}
