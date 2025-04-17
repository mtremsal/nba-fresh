import { Team, TeamModel } from "../models/Team.ts";

export class TeamController {
  static async getAllTeams(): Promise<Team[]> {
    return await TeamModel.getAll();
  }

  static async getTeamById(id: string): Promise<Team | null> {
    return await TeamModel.getById(id);
  }

  static async getTeamByAbbreviation(
    abbreviation: string,
  ): Promise<Team | null> {
    return await TeamModel.getByAbbreviation(abbreviation);
  }

  static getTeamDisplayName(team: Team): string {
    return `${team.city} ${team.nickname}`;
  }
}
