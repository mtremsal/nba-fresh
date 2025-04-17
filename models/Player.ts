import { getDb } from "../utils/db.ts";

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  jersey: string;
  height: string;
  weight: string;
  teamId: string;
  birthdate: string;
  [key: string]: string | number; // Required for SQLite RowObject constraint
}

export class PlayerModel {
  static async getAll(): Promise<Player[]> {
    const db = getDb();
    return await db.queryEntries<Player>(`
      SELECT 
        person_id as id,
        first_name as firstName,
        last_name as lastName,
        display_first_last as fullName,
        position,
        jersey,
        height,
        weight,
        team_id as teamId,
        birthdate
      FROM common_player_info
      WHERE rosterstatus = 'Active'
      ORDER BY CAST(jersey AS INTEGER)
    `);
  }

  static async getByTeamId(teamId: string): Promise<Player[]> {
    const db = getDb();
    return await db.queryEntries<Player>(`
      SELECT 
        person_id as id,
        first_name as firstName,
        last_name as lastName,
        display_first_last as fullName,
        position,
        jersey,
        height,
        weight,
        team_id as teamId,
        birthdate
      FROM common_player_info
      WHERE team_id = ? AND rosterstatus = 'Active'
      ORDER BY CAST(jersey AS INTEGER)
    `, [teamId]);
  }

  static async getById(id: string): Promise<Player | null> {
    const db = getDb();
    const rows = await db.queryEntries<Player>(`
      SELECT 
        person_id as id,
        first_name as firstName,
        last_name as lastName,
        display_first_last as fullName,
        position,
        jersey,
        height,
        weight,
        team_id as teamId,
        birthdate
      FROM common_player_info
      WHERE person_id = ?
    `, [id]);
    
    return rows.length === 0 ? null : rows[0];
  }
}