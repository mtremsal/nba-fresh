import { Handlers, PageProps } from "$fresh/server.ts";
// Import the controller AND the exported constants
import { 
  TeamController, 
  TeamsByConference, 
  conferenceOrder, // Import directly
  divisionOrder    // Import directly
} from "../../controllers/TeamController.ts"; 
import { Team } from "../../models/Team.ts";

interface TeamsPageData {
  groupedTeams: TeamsByConference;
  conferenceOrder: string[];
  divisionOrder: { [conference: string]: string[] };
}

export const handler: Handlers<TeamsPageData> = {
  async GET(_req, ctx) {
    const groupedTeams = await TeamController.getAllTeamsGrouped();
    // Pass the imported constants directly
    return ctx.render({ groupedTeams, conferenceOrder, divisionOrder });
  },
};

export default function TeamsPage({ data: { groupedTeams, conferenceOrder, divisionOrder } }: PageProps<TeamsPageData>) {
  const displayOrder = [...conferenceOrder].reverse();
  
  return (
    <div class="min-h-screen bg-gray-50 px-4 py-8 md:px-6 md:py-12">
      <div class="mx-auto max-w-7xl">
        <h1 class="text-3xl font-bold mb-8 text-center text-gray-900">NBA Teams</h1>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayOrder.map((conference) => (
            <div key={conference} class="flex flex-col">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">
                {conference} Conference
              </h2>
              
              <div class="flex-1 grid grid-rows-3 gap-6">
                {divisionOrder[conference].map((division) => (
                  <div key={division} class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 h-full">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">
                      {division} Division
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 auto-rows-fr">
                      {groupedTeams[conference]?.[division]?.map((team: Team) => (
                        <a
                          key={team.id}
                          href={`/teams/${team.abbreviation}`}
                          class="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group h-[160px] justify-between"
                        >
                          <div class="flex-shrink-0 w-16 h-16 mb-4 transform group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                            <img
                              src={TeamController.getTeamLogoUrl(team.id)}
                              alt={`${TeamController.getTeamDisplayName(team)} logo`}
                              class="w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                          <div class="text-center flex-1 flex flex-col justify-center min-h-[48px]">
                            <div class="font-medium text-gray-900 text-base leading-tight whitespace-nowrap">
                              {team.city}
                            </div>
                            <div class="text-gray-700 text-base leading-tight whitespace-nowrap font-medium">
                              {team.nickname}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
