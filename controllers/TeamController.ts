import { Team, TeamModel } from "../models/Team.ts";

// Define Conference and Division Structure
export interface TeamsByDivision {
  [division: string]: Team[];
}

export interface TeamsByConference {
  [conference: string]: TeamsByDivision;
}

const teamDivisionMapping: {
  [abbreviation: string]: { conference: string; division: string };
} = {
  // Eastern Conference
  // Atlantic
  "BOS": { conference: "Eastern", division: "Atlantic" },
  "BKN": { conference: "Eastern", division: "Atlantic" },
  "NYK": { conference: "Eastern", division: "Atlantic" },
  "PHI": { conference: "Eastern", division: "Atlantic" },
  "TOR": { conference: "Eastern", division: "Atlantic" },
  // Central
  "CHI": { conference: "Eastern", division: "Central" },
  "CLE": { conference: "Eastern", division: "Central" },
  "DET": { conference: "Eastern", division: "Central" },
  "IND": { conference: "Eastern", division: "Central" },
  "MIL": { conference: "Eastern", division: "Central" },
  // Southeast
  "ATL": { conference: "Eastern", division: "Southeast" },
  "CHA": { conference: "Eastern", division: "Southeast" }, // Note: Abbreviation might be 'CHO' in some datasets
  "MIA": { conference: "Eastern", division: "Southeast" },
  "ORL": { conference: "Eastern", division: "Southeast" },
  "WAS": { conference: "Eastern", division: "Southeast" },

  // Western Conference
  // Northwest
  "DEN": { conference: "Western", division: "Northwest" },
  "MIN": { conference: "Western", division: "Northwest" },
  "OKC": { conference: "Western", division: "Northwest" },
  "POR": { conference: "Western", division: "Northwest" },
  "UTA": { conference: "Western", division: "Northwest" },
  // Pacific
  "GSW": { conference: "Western", division: "Pacific" },
  "LAC": { conference: "Western", division: "Pacific" },
  "LAL": { conference: "Western", division: "Pacific" },
  "PHX": { conference: "Western", division: "Pacific" }, // Note: Abbreviation might be 'PHO' in some datasets
  "SAC": { conference: "Western", division: "Pacific" },
  // Southwest
  "DAL": { conference: "Western", division: "Southwest" },
  "HOU": { conference: "Western", division: "Southwest" },
  "MEM": { conference: "Western", division: "Southwest" },
  "NOP": { conference: "Western", division: "Southwest" },
  "SAS": { conference: "Western", division: "Southwest" },
};

// Export these constants
export const conferenceOrder = ["Eastern", "Western"];
export const divisionOrder: { [conference: string]: string[] } = {
  "Eastern": ["Atlantic", "Central", "Southeast"],
  "Western": ["Northwest", "Pacific", "Southwest"],
};

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

  static getTeamLogoUrl(teamId: string): string {
    return `https://cdn.nba.com/logos/nba/${teamId}/global/L/logo.svg`;
  }

  static getTeamConferenceDivision(abbreviation: string) {
    return teamDivisionMapping[abbreviation];
  }

  // New method to get teams grouped by division
  static async getAllTeamsGrouped(): Promise<TeamsByConference> {
    const allTeams = await TeamModel.getAll(); // Fetch the flat list first
    const groupedTeams: TeamsByConference = {};

    // Initialize the structure using the exported constants
    for (const conf of conferenceOrder) {
      groupedTeams[conf] = {};
      for (const div of divisionOrder[conf]) {
        groupedTeams[conf][div] = [];
      }
    }

    // Populate the structure
    for (const team of allTeams) {
      const mapping = teamDivisionMapping[team.abbreviation];
      if (mapping) {
        // Ensure conference and division exist (handles potential missing teams in mapping)
        if (!groupedTeams[mapping.conference]) {
          groupedTeams[mapping.conference] = {};
        }
        if (!groupedTeams[mapping.conference][mapping.division]) {
          groupedTeams[mapping.conference][mapping.division] = [];
        }
        groupedTeams[mapping.conference][mapping.division].push(team);
      } else {
        // Handle teams not found in the mapping (optional: log or place in an 'Unknown' group)
        console.warn(
          `Team with abbreviation ${team.abbreviation} not found in division mapping.`,
        );
        // Example: Add to an 'Unknown' group
        // if (!groupedTeams["Unknown"]) groupedTeams["Unknown"] = { "Unknown": [] };
        // groupedTeams["Unknown"]["Unknown"].push(team);
      }
    }

    // Sort teams within each division alphabetically by city/nickname
    for (const conf of conferenceOrder) {
      for (const div of divisionOrder[conf]) {
        if (groupedTeams[conf] && groupedTeams[conf][div]) {
          groupedTeams[conf][div].sort((a, b) => {
            const nameA = `${a.city} ${a.nickname}`;
            const nameB = `${b.city} ${b.nickname}`;
            return nameA.localeCompare(nameB);
          });
        }
      }
    }

    return groupedTeams;
  }
}
