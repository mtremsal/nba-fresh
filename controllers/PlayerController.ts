import { Player, PlayerModel } from "../models/Player.ts";

export class PlayerController {
  static async getAllPlayers(): Promise<Player[]> {
    return await PlayerModel.getAll();
  }

  static async getPlayerById(id: string): Promise<Player | null> {
    return await PlayerModel.getById(id);
  }

  static async getPlayersByTeamId(teamId: string): Promise<Player[]> {
    return await PlayerModel.getByTeamId(teamId);
  }

  static getPlayerDisplayName(player: Player): string {
    return `${player.fullName} #${player.jersey}`;
  }

  static formatPlayerHeight(height: string): string {
    const [feet, inches] = height.split("-");
    return `${feet}'${inches}"`;
  }

  static formatBirthdate(birthdate: string): string {
    const date = new Date(birthdate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}
