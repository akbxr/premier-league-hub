"use client";

import { useState, useEffect, useCallback } from "react";
import { FavoriteTeam, Team } from "@/types";
import {
  getFavoriteTeams,
  addToFavorites as addToFavoritesLib,
  removeFromFavorites as removeFromFavoritesLib,
  isTeamInFavorites,
} from "@/lib/favorites";

// Custom event for favorite changes
const FAVORITES_CHANGED_EVENT = "favoritesChanged";

// Dispatch custom event when favorites change
const dispatchFavoritesChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
  }
};

export function useFavorites() {
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(() => {
    const favorites = getFavoriteTeams();
    setFavoriteTeams(favorites);
    setIsLoading(false);
  }, []);

  // Add team to favorites
  const addToFavorites = useCallback(
    (team: Team) => {
      const success = addToFavoritesLib(team);
      if (success) {
        loadFavorites();
        dispatchFavoritesChanged();
      }
      return success;
    },
    [loadFavorites],
  );

  // Remove team from favorites
  const removeFromFavorites = useCallback(
    (teamId: string) => {
      const success = removeFromFavoritesLib(teamId);
      if (success) {
        loadFavorites();
        dispatchFavoritesChanged();
      }
      return success;
    },
    [loadFavorites],
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (team: Team) => {
      if (isTeamInFavorites(team.idTeam)) {
        return removeFromFavorites(team.idTeam);
      } else {
        return addToFavorites(team);
      }
    },
    [addToFavorites, removeFromFavorites],
  );

  // Check if team is favorite
  const isFavorite = useCallback(
    (teamId: string) => {
      return favoriteTeams.some((fav) => fav.idTeam === teamId);
    },
    [favoriteTeams],
  );

  useEffect(() => {
    loadFavorites();

    const handleFavoritesChanged = () => {
      loadFavorites();
    };

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "premier_league_favorite_teams") {
        loadFavorites();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        FAVORITES_CHANGED_EVENT,
        handleFavoritesChanged,
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadFavorites]);

  return {
    favoriteTeams,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    refreshFavorites: loadFavorites,
  };
}
