import { Game, GameModel } from "../models/Game.ts";

export class GameController {
  static async getAllGames(): Promise<Game[]> {
    return await GameModel.getAll();
  }

  static async getGameById(id: string): Promise<Game | null> {
    return await GameModel.getById(id);
  }

  static async getGamesByTeamId(teamId: string): Promise<Game[]> {
    return await GameModel.getByTeamId(teamId);
  }

  static formatGameDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  static getGameScore(game: Game): string {
    return `${game.homeTeamScore} - ${game.visitorTeamScore}`;
  }

  static getGameDescription(game: Game): string {
    return `${game.status} at ${game.arena}, ${game.city}`;
  }
}