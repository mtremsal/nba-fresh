import { getDb } from "../utils/db.ts";

export interface Team {
  id: string;
  fullName: string;
  abbreviation: string;
  nickname: string;
  city: string;
  state: string;
  yearFounded: number;
  [key: string]: string | number; // Required for SQLite RowObject constraint
}

export class TeamModel {
  static async getAll(): Promise<Team[]> {
    const db = getDb();
    return await db.queryEntries<Team>(`
      SELECT 
        id,
        full_name as fullName,
        abbreviation,
        nickname,
        city,
        state,
        year_founded as yearFounded
      FROM team
      ORDER BY city, nickname
    `);
  }

  static async getById(id: string): Promise<Team | null> {
    const db = getDb();
    const rows = await db.queryEntries<Team>(`
      SELECT 
        id,
        full_name as fullName,
        abbreviation,
        nickname,
        city,
        state,
        year_founded as yearFounded
      FROM team
      WHERE id = ?
    `, [id]);
    
    return rows.length === 0 ? null : rows[0];
  }

  static async getByAbbreviation(abbreviation: string): Promise<Team | null> {
    const db = getDb();
    const rows = await db.queryEntries<Team>(`
      SELECT 
        id,
        full_name as fullName,
        abbreviation,
        nickname,
        city,
        state,
        year_founded as yearFounded
      FROM team
      WHERE abbreviation = ?
    `, [abbreviation]);
    
    return rows.length === 0 ? null : rows[0];
  }
}