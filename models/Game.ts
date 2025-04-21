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
  live_period?: number; // Add live_period
  // Add line score fields
  ptsQtr1Home?: number;
  ptsQtr2Home?: number;
  ptsQtr3Home?: number;
  ptsQtr4Home?: number;
  ptsOt1Home?: number;
  ptsOt2Home?: number;
  ptsOt3Home?: number;
  ptsOt4Home?: number;
  ptsOt5Home?: number;
  ptsOt6Home?: number;
  ptsOt7Home?: number;
  ptsOt8Home?: number;
  ptsOt9Home?: number;
  ptsOt10Home?: number;
  ptsQtr1Away?: number;
  ptsQtr2Away?: number;
  ptsQtr3Away?: number;
  ptsQtr4Away?: number;
  ptsOt1Away?: number;
  ptsOt2Away?: number;
  ptsOt3Away?: number;
  ptsOt4Away?: number;
  ptsOt5Away?: number;
  ptsOt6Away?: number;
  ptsOt7Away?: number;
  ptsOt8Away?: number;
  ptsOt9Away?: number;
  ptsOt10Away?: number;
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
    // NOTE: The 'line_score' table has data integrity issues where 'team_id_home'
    // and 'team_id_away' (and their corresponding scores like 'pts_qtr1_home')
    // are sometimes swapped compared to the 'game' table.
    // We use the 'game' table as the source of truth for team IDs and total scores.
    // The CASE statements below ensure that the period scores from 'line_score'
    // are correctly assigned to the homeTeam and visitorTeam based on the
    // 'team_id_home' from the 'game' table (g.team_id_home).
    const rows = await db.queryEntries<Game>(
      `
      SELECT 
        g.game_id as id,
        g.game_date as gameDate,
        g.team_id_home as homeTeamId, -- Use game table for home team ID
        ht.full_name as homeTeamName,
        g.pts_home as homeTeamScore, -- Use game table for total home score
        g.team_id_away as visitorTeamId, -- Use game table for visitor team ID
        vt.full_name as visitorTeamName,
        g.pts_away as visitorTeamScore, -- Use game table for total visitor score
        g.season_id as season,
        t.city,
        gi.attendance,
        gs.live_period as live_period,

        -- Conditionally assign line scores based on game.team_id_home
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_qtr1_home ELSE ls.pts_qtr1_away END as ptsQtr1Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_qtr2_home ELSE ls.pts_qtr2_away END as ptsQtr2Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_qtr3_home ELSE ls.pts_qtr3_away END as ptsQtr3Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_qtr4_home ELSE ls.pts_qtr4_away END as ptsQtr4Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot1_home ELSE ls.pts_ot1_away END as ptsOt1Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot2_home ELSE ls.pts_ot2_away END as ptsOt2Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot3_home ELSE ls.pts_ot3_away END as ptsOt3Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot4_home ELSE ls.pts_ot4_away END as ptsOt4Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot5_home ELSE ls.pts_ot5_away END as ptsOt5Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot6_home ELSE ls.pts_ot6_away END as ptsOt6Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot7_home ELSE ls.pts_ot7_away END as ptsOt7Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot8_home ELSE ls.pts_ot8_away END as ptsOt8Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot9_home ELSE ls.pts_ot9_away END as ptsOt9Home,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot10_home ELSE ls.pts_ot10_away END as ptsOt10Home,

        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_qtr1_away ELSE ls.pts_qtr1_home END as ptsQtr1Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_qtr2_away ELSE ls.pts_qtr2_home END as ptsQtr2Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_qtr3_away ELSE ls.pts_qtr3_home END as ptsQtr3Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_qtr4_away ELSE ls.pts_qtr4_home END as ptsQtr4Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot1_away ELSE ls.pts_ot1_home END as ptsOt1Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot2_away ELSE ls.pts_ot2_home END as ptsOt2Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot3_away ELSE ls.pts_ot3_home END as ptsOt3Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot4_away ELSE ls.pts_ot4_home END as ptsOt4Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot5_away ELSE ls.pts_ot5_home END as ptsOt5Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot6_away ELSE ls.pts_ot6_home END as ptsOt6Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot7_away ELSE ls.pts_ot7_home END as ptsOt7Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot8_away ELSE ls.pts_ot8_home END as ptsOt8Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot9_away ELSE ls.pts_ot9_home END as ptsOt9Away,
        CASE WHEN ls.team_id_home = g.team_id_home THEN ls.pts_ot10_away ELSE ls.pts_ot10_home END as ptsOt10Away

      FROM game g
      LEFT JOIN team ht ON g.team_id_home = ht.id
      LEFT JOIN team vt ON g.team_id_away = vt.id
      LEFT JOIN team t ON g.team_id_home = t.id -- This join seems correct for getting the home team's city
      LEFT JOIN game_info gi ON g.game_id = gi.game_id
      LEFT JOIN line_score ls ON g.game_id = ls.game_id
      LEFT JOIN game_summary gs ON g.game_id = gs.game_id
      WHERE g.game_id = ?
    `,
      [id],
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
    return rows.map((row) => row.season);
  }

  static async getPlayByPlay(gameId: string): Promise<PlayByPlay[]> {
    const db = getDb();
    return await db.queryEntries<PlayByPlay>(
      `
      SELECT
        eventnum as eventNum,
        eventmsgtype as eventMsgType,
        eventmsgactiontype as eventMsgActionType,
        period,
        wctimestring as wcTimeString,
        pctimestring as pcTimeString,
        homedescription as homeDescription,
        neutraldescription as neutralDescription,
        visitordescription as visitorDescription,
        score,
        scoremargin as scoreMargin,
        person1type as person1Type,
        player1_id as player1Id,
        player1_name as player1Name,
        player1_team_id as player1TeamId,
        player1_team_abbreviation as player1TeamAbbreviation,
        person2type as person2Type,
        player2_id as player2Id,
        player2_name as player2Name,
        player2_team_id as player2TeamId,
        player2_team_abbreviation as player2TeamAbbreviation,
        person3type as person3Type,
        player3_id as player3Id,
        player3_name as player3Name,
        player3_team_id as player3TeamId,
        player3_team_abbreviation as player3TeamAbbreviation
      FROM play_by_play
      WHERE game_id = ?
      ORDER BY eventnum ASC
    `,
      [gameId],
    );
  }
}

export interface PlayByPlay {
  eventNum: number;
  eventMsgType: number;
  eventMsgActionType: number;
  period: number;
  wcTimeString: string;
  pcTimeString: string;
  homeDescription?: string;
  neutralDescription?: string;
  visitorDescription?: string;
  score?: string;
  scoreMargin?: string;
  person1Type?: number;
  player1Id?: string;
  player1Name?: string;
  player1TeamId?: string;
  player1TeamAbbreviation?: string;
  person2Type?: number;
  player2Id?: string;
  player2Name?: string;
  player2TeamId?: string;
  player2TeamAbbreviation?: string;
  person3Type?: number;
  player3Id?: string;
  player3Name?: string;
  player3TeamId?: string;
  player3TeamAbbreviation?: string;
  [key: string]: string | number | undefined;
}
