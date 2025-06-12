import { FavoriteTeam, Team } from "@/types";

const FAVORITES_KEY = "premier_league_favorite_teams";

// Get all favorite teams from localStorage
export function getFavoriteTeams(): FavoriteTeam[] {
  if (typeof window === "undefined") return [];

  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error getting favorite teams:", error);
    return [];
  }
}

// Add a team to favorites
export function addToFavorites(team: Team): boolean {
  if (typeof window === "undefined") return false;

  try {
    const favorites = getFavoriteTeams();

    // Check if team is already in favorites
    if (favorites.some((fav) => fav.idTeam === team.idTeam)) {
      return false; // Already in favorites
    }

    const favoriteTeam: FavoriteTeam = {
      idTeam: team.idTeam,
      strTeam: team.strTeam,
      strTeamBadge: team.strBadge,
      dateAdded: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites, favoriteTeam];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

    return true;
  } catch (error) {
    console.error("Error adding team to favorites:", error);
    return false;
  }
}

// Remove a team from favorites
export function removeFromFavorites(teamId: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const favorites = getFavoriteTeams();
    const updatedFavorites = favorites.filter((fav) => fav.idTeam !== teamId);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error("Error removing team from favorites:", error);
    return false;
  }
}

// Check if a team is in favorites
export function isTeamInFavorites(teamId: string): boolean {
  if (typeof window === "undefined") return false;

  const favorites = getFavoriteTeams();
  return favorites.some((fav) => fav.idTeam === teamId);
}

// Clear all favorites
export function clearFavorites(): boolean {
  if (typeof window === "undefined") return false;

  try {
    localStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing favorites:", error);
    return false;
  }
}
