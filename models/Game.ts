import { getDb } from "../utils/db.ts";

export interface Game {
  id: string;
  gameDate: string;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamScore: number;
  visitorTeamId: string;
  visitorTeamName: string;
  visitorTeamScore: number;
  season: string;
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
        ht.full_name as homeTeamName,
        g.pts_home as homeTeamScore,
        g.team_id_away as visitorTeamId,
        vt.full_name as visitorTeamName,
        g.pts_away as visitorTeamScore,
        g.season_id as season,
        t.city,
        gi.attendance
      FROM game g
      LEFT JOIN team ht ON g.team_id_home = ht.id
      LEFT JOIN team vt ON g.team_id_away = vt.id
      LEFT JOIN team t ON g.team_id_home = t.id
      LEFT JOIN game_info gi ON g.game_id = gi.game_id
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
        ht.full_name as homeTeamName,
        g.pts_home as homeTeamScore,
        g.team_id_away as visitorTeamId,
        vt.full_name as visitorTeamName,
        g.pts_away as visitorTeamScore,
        g.season_id as season,
        t.city,
        gi.attendance
      FROM game g
      LEFT JOIN team ht ON g.team_id_home = ht.id
      LEFT JOIN team vt ON g.team_id_away = vt.id
      LEFT JOIN team t ON g.team_id_home = t.id
      LEFT JOIN game_info gi ON g.game_id = gi.game_id
      WHERE g.game_id = ?
    `,
      [id]
    );

    return rows.length === 0 ? null : rows[0];
  }

  static async getByTeamId(teamId: string, season?: string): Promise<Game[]> {
    const db = getDb();
    let query = `
      SELECT 
        g.game_id as id,
        g.game_date as gameDate,
        g.team_id_home as homeTeamId,
        ht.full_name as homeTeamName,
        g.pts_home as homeTeamScore,
        g.team_id_away as visitorTeamId,
        vt.full_name as visitorTeamName,
        g.pts_away as visitorTeamScore,
        g.season_id as season,
        t.city,
        gi.attendance
      FROM game g
      LEFT JOIN team ht ON g.team_id_home = ht.id
      LEFT JOIN team vt ON g.team_id_away = vt.id
      LEFT JOIN team t ON g.team_id_home = t.id
      LEFT JOIN game_info gi ON g.game_id = gi.game_id
      WHERE (g.team_id_home = ? OR g.team_id_away = ?)
    `;
    
    const params = [teamId, teamId];
    
    if (season) {
      query += ` AND g.season_id = ?`;
      params.push(season);
    }
    
    query += ` ORDER BY g.game_date DESC`;
    
    return await db.queryEntries<Game>(query, params);
  }
  
  static async getSeasons(teamId?: string): Promise<string[]> {
    const db = getDb();
    let query = `
      SELECT DISTINCT season_id as season
      FROM game
    `;
    
    const params: string[] = [];
    if (teamId) {
      query += ` WHERE team_id_home = ? OR team_id_away = ?`;
      params.push(teamId, teamId);
    }
    
    query += ` ORDER BY season_id DESC`;
    
    const rows = await db.queryEntries<{ season: string }>(query, params);
    return rows.map(row => row.season);
  }
}