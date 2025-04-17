import { getDb } from "../utils/db.ts";

export interface Game {
  id: string;
  gameDate: string;
  homeTeamId: string;
  homeTeamScore: number;
  visitorTeamId: string;
  visitorTeamScore: number;
  season: string;
  status: string;
  city: string;
  attendance?: number;
  [key: string]: string | number | undefined;
}

export class GameModel {
  static async getAll(): Promise<Game[]> {
    const db = getDb();
    return await db.queryEntries<Game>(`
      SELECT 
        g.game_id as id,
        g.game_date as gameDate,
        g.team_id_home as homeTeamId,
        g.pts_home as homeTeamScore,
        g.team_id_away as visitorTeamId,
        g.pts_away as visitorTeamScore,
        g.season_id as season,
        COALESCE(gs.game_status_text, 'Final') as status,
        t.city,
        gi.attendance
      FROM game g
      LEFT JOIN game_summary gs ON g.game_id = gs.game_id
      LEFT JOIN game_info gi ON g.game_id = gi.game_id
      LEFT JOIN team t ON g.team_id_home = t.id
      ORDER BY g.game_date DESC
    `);
  }

  static async getById(id: string): Promise<Game | null> {
    const db = getDb();
    const rows = await db.queryEntries<Game>(
      `
      SELECT 
        g.game_id as id,
        g.game_date as gameDate,
        g.team_id_home as homeTeamId,
        g.pts_home as homeTeamScore,
        g.team_id_away as visitorTeamId,
        g.pts_away as visitorTeamScore,
        g.season_id as season,
        COALESCE(gs.game_status_text, 'Final') as status,
        t.city,
        gi.attendance
      FROM game g
      LEFT JOIN game_summary gs ON g.game_id = gs.game_id
      LEFT JOIN game_info gi ON g.game_id = gi.game_id
      LEFT JOIN team t ON g.team_id_home = t.id
      WHERE g.game_id = ?
    `,
      [id]
    );

    return rows.length === 0 ? null : rows[0];
  }

  static async getByTeamId(teamId: string): Promise<Game[]> {
    const db = getDb();
    return await db.queryEntries<Game>(
      `
      SELECT 
        g.game_id as id,
        g.game_date as gameDate,
        g.team_id_home as homeTeamId,
        g.pts_home as homeTeamScore,
        g.team_id_away as visitorTeamId,
        g.pts_away as visitorTeamScore,
        g.season_id as season,
        COALESCE(gs.game_status_text, 'Final') as status,
        t.city,
        gi.attendance
      FROM game g
      LEFT JOIN game_summary gs ON g.game_id = gs.game_id
      LEFT JOIN game_info gi ON g.game_id = gi.game_id
      LEFT JOIN team t ON g.team_id_home = t.id
      WHERE g.team_id_home = ? OR g.team_id_away = ?
      ORDER BY g.game_date DESC
    `,
      [teamId, teamId]
    );
  }
}