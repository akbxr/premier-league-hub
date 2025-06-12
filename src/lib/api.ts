import {
  Team,
  Event,
  League,
  TeamStanding,
  EventDetails,
  EventStatistic,
  ApiResponse,
  PREMIER_LEAGUE_ID,
} from "@/types";

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/123";

// Helper function to convert UTC time to Indonesian time
export function convertToIndonesianTime(
  dateString: string,
  timeString?: string,
): string {
  try {
    const dateTime = timeString ? `${dateString} ${timeString}` : dateString;
    const utcDate = new Date(dateTime);

    // Add 7 hours for WIB
    const indonesianDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

    return indonesianDate.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  } catch (error) {
    console.error("Error converting time:", error);
    return dateString;
  }
}

// Fetch all teams
export async function getPLTeams(): Promise<Team[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search_all_teams.php?l=English_Premier_League`,
    );
    const data: ApiResponse<Team> = await response.json();
    return data.teams || [];
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

// Fetch team details by ID
export async function getTeamDetails(teamId: string): Promise<Team | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookupteam.php?id=${teamId}`);
    const data: ApiResponse<Team> = await response.json();
    return data.teams?.[0] || null;
  } catch (error) {
    console.error("Error fetching team details:", error);
    return null;
  }
}

// Fetch previous matches for Premier league
export async function getPLPreviousMatches(): Promise<Event[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/eventspastleague.php?id=${PREMIER_LEAGUE_ID}`,
    );
    const data: ApiResponse<Event> = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Error fetching previous matches:", error);
    return [];
  }
}

export async function getPreviousSeasonMatches(): Promise<Event[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/eventsseason.php?id=4328&s=2024-2025`,
    );
    const data: ApiResponse<Event> = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Error fetching previous matches:", error);
    return [];
  }
}

// Fetch next matches for premier league
export async function getPLNextMatches(): Promise<Event[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/eventsnextleague.php?id=${PREMIER_LEAGUE_ID}`,
    );
    const data: ApiResponse<Event> = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Error fetching next matches:", error);
    return [];
  }
}

// Fetch team's previous matches
export async function getTeamPreviousMatches(teamId: string): Promise<Event[]> {
  try {
    const response = await fetch(`${BASE_URL}/eventslast.php?id=${teamId}`);
    const data: ApiResponse<Event> = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching team previous matches:", error);
    return [];
  }
}

// Fetch team's next matches
export async function getTeamNextMatches(teamId: string): Promise<Event[]> {
  try {
    const response = await fetch(`${BASE_URL}/eventsnext.php?id=${teamId}`);
    const data: ApiResponse<Event> = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Error fetching team next matches:", error);
    return [];
  }
}

// Fetch event details by ID
export async function getEventDetails(
  eventId: string,
): Promise<EventDetails | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookupevent.php?id=${eventId}`);
    const data: ApiResponse<EventDetails> = await response.json();
    return data.events?.[0] || null;
  } catch (error) {
    console.error("Error fetching event details:", error);
    return null;
  }
}

// Fetch event results by ID
export async function getEventResults(
  eventId: string,
): Promise<EventDetails | null> {
  try {
    const response = await fetch(`${BASE_URL}/eventresults.php?id=${eventId}`);
    const data: ApiResponse<EventDetails> = await response.json();
    return data.events?.[0] || null;
  } catch (error) {
    console.error("Error fetching event results:", error);
    return null;
  }
}

// Fetch event statistics by ID
export async function getEventStatistics(
  eventId: string,
): Promise<EventStatistic[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/lookupeventstats.php?id=${eventId}`,
    );
    const data: ApiResponse<EventStatistic> = await response.json();
    return data.eventstats || [];
  } catch (error) {
    console.error("Error fetching event statistics:", error);
    return [];
  }
}

// Fetch league standings
export async function getPLStandings(): Promise<TeamStanding[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/lookuptable.php?l=${PREMIER_LEAGUE_ID}&s=2024-2025`,
    );
    const data: ApiResponse<TeamStanding> = await response.json();
    return data.table || [];
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
}

// Fetch premier league information
export async function getPremierLeague(): Promise<League | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/lookupleague.php?id=${PREMIER_LEAGUE_ID}`,
    );
    const data: ApiResponse<League> = await response.json();
    return data.leagues?.[0] || null;
  } catch (error) {
    console.error("Error fetching Premier league:", error);
    return null;
  }
}
