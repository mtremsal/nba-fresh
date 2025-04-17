import { Game, GameModel } from "../models/Game.ts";

export class GameController {
  static async getAllGames(): Promise<Game[]> {
    return await GameModel.getAll();
  }

  static async getGameById(id: string): Promise<Game | null> {
    return await GameModel.getById(id);
  }

  static async getGamesByTeamId(teamId: string, season?: string): Promise<Game[]> {
    return await GameModel.getByTeamId(teamId, season);
  }

  static async getSeasons(teamId?: string): Promise<string[]> {
    return await GameModel.getSeasons(teamId);
  }

  static formatGameDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  static getGameScore(game: Game): string {
    return `${game.homeTeamScore} - ${game.visitorTeamScore}`;
  }

  static formatSeason(season: string): string {
    // Convert season ID (e.g. "22022" for 2022-23) to display format
    const yearStr = season.slice(-4);
    const year = parseInt(yearStr);
    return `${year}-${(year + 1).toString().slice(-2)}`;
  }

  static getSeasonStartYear(season: string): number {
    return parseInt(season.slice(-4));
  }

  static getNextSeason(season: string): string {
    const year = this.getSeasonStartYear(season);
    return `2${(year + 1).toString().padStart(4, "0")}`;
  }

  static getPreviousSeason(season: string): string {
    const year = this.getSeasonStartYear(season);
    return `2${(year - 1).toString().padStart(4, "0")}`;
  }

  static readonly DEFAULT_SEASON = "22022"; // 2022-23 season
}