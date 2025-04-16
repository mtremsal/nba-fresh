import { getDb } from "../utils/db.ts";

export interface Team {
  id: string;
  fullName: string;
  abbreviation: string;
  nickname: string;
  city: string;
  state: string;
  yearFounded: number;
}

interface TeamRow {
  [key: string]: string | number;
  id: string;
  full_name: string;
  abbreviation: string;
  nickname: string;
  city: string;
  state: string;
  year_founded: number;
}

export class TeamModel {
  static async getAll(): Promise<Team[]> {
    const db = getDb();
    const rows = await db.queryEntries<TeamRow>(`
      SELECT 
        id,
        full_name,
        abbreviation,
        nickname,
        city,
        state,
        year_founded
      FROM team
      ORDER BY city, nickname
    `);
    return rows.map(row => ({
      id: row.id,
      fullName: row.full_name,
      abbreviation: row.abbreviation,
      nickname: row.nickname,
      city: row.city,
      state: row.state,
      yearFounded: row.year_founded,
    }));
  }

  static async getById(id: string): Promise<Team | null> {
    const db = getDb();
    const rows = await db.queryEntries<TeamRow>(`
      SELECT 
        id,
        full_name,
        abbreviation,
        nickname,
        city,
        state,
        year_founded
      FROM team
      WHERE id = ?
    `, [id]);
    
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
      id: row.id,
      fullName: row.full_name,
      abbreviation: row.abbreviation,
      nickname: row.nickname,
      city: row.city,
      state: row.state,
      yearFounded: row.year_founded,
    };
  }
}