import { getDb } from "../utils/db.ts";

export interface Team {
  id: string;
  fullName: string;
  abbreviation: string;
  nickname: string;
  city: string;
  state: string;
  yearFounded: number;
  arena?: string;
  arenaCapacity?: number;
  owner?: string;
  generalManager?: string;
  headCoach?: string;
  dLeagueAffiliation?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  [key: string]: string | number | undefined; // Required for SQLite RowObject constraint
}

export class TeamModel {
  static async getAll(): Promise<Team[]> {
    const db = getDb();
    return await db.queryEntries<Team>(`
      SELECT 
        t.id,
        t.full_name as fullName,
        t.abbreviation,
        t.nickname,
        t.city,
        t.state,
        t.year_founded as yearFounded,
        td.arena,
        td.arenacapacity as arenaCapacity,
        td.owner,
        td.generalmanager as generalManager,
        td.headcoach as headCoach,
        td.dleagueaffiliation as dLeagueAffiliation,
        td.facebook,
        td.instagram,
        td.twitter
      FROM team t
      LEFT JOIN team_details td ON t.id = td.team_id
      ORDER BY t.city, t.nickname
    `);
  }

  static async getById(id: string): Promise<Team | null> {
    const db = getDb();
    const rows = await db.queryEntries<Team>(
      `
      SELECT 
        t.id,
        t.full_name as fullName,
        t.abbreviation,
        t.nickname,
        t.city,
        t.state,
        t.year_founded as yearFounded,
        td.arena,
        td.arenacapacity as arenaCapacity,
        td.owner,
        td.generalmanager as generalManager,
        td.headcoach as headCoach,
        td.dleagueaffiliation as dLeagueAffiliation,
        td.facebook,
        td.instagram,
        td.twitter
      FROM team t
      LEFT JOIN team_details td ON t.id = td.team_id
      WHERE t.id = ?
    `,
      [id],
    );

    return rows.length === 0 ? null : rows[0];
  }

  static async getByAbbreviation(abbreviation: string): Promise<Team | null> {
    const db = getDb();
    const rows = await db.queryEntries<Team>(
      `
      SELECT 
        t.id,
        t.full_name as fullName,
        t.abbreviation,
        t.nickname,
        t.city,
        t.state,
        t.year_founded as yearFounded,
        td.arena,
        td.arenacapacity as arenaCapacity,
        td.owner,
        td.generalmanager as generalManager,
        td.headcoach as headCoach,
        td.dleagueaffiliation as dLeagueAffiliation,
        td.facebook,
        td.instagram,
        td.twitter
      FROM team t
      LEFT JOIN team_details td ON t.id = td.team_id
      WHERE t.abbreviation = ?
    `,
      [abbreviation],
    );

    return rows.length === 0 ? null : rows[0];
  }
}
