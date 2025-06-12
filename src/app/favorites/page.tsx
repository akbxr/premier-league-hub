"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Star,
  Heart,
  Trash2,
  Search,
  Plus,
  Calendar,
  Users,
  ArrowRight,
  StarOff,
} from "lucide-react";
import { FavoriteTeam, Team } from "@/types";
import { getPLTeams } from "@/lib/api";
import {
  getFavoriteTeams,
  removeFromFavorites,
  clearFavorites,
  addToFavorites,
} from "@/lib/favorites";
import TeamCard from "@/components/team-card";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function FavoritesPage() {
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load favorite teams from localStorage
        const favorites = getFavoriteTeams();
        setFavoriteTeams(favorites);

        // Load all teams for adding new favorites
        const teamsData = await getPLTeams();
        setAllTeams(teamsData);

        // Filter out teams that are already in favorites
        const favoriteIds = favorites.map((fav) => fav.idTeam);
        const availableTeams = teamsData.filter(
          (team) => !favoriteIds.includes(team.idTeam),
        );
        setFilteredTeams(availableTeams);
      } catch (error) {
        console.error("Error loading favorites data:", error);
        toast.error("Failed to load favorites data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter available teams based on search query
  useEffect(() => {
    if (!searchQuery) {
      const favoriteIds = favoriteTeams.map((fav) => fav.idTeam);
      const availableTeams = allTeams.filter(
        (team) => !favoriteIds.includes(team.idTeam),
      );
      setFilteredTeams(availableTeams);
    } else {
      const favoriteIds = favoriteTeams.map((fav) => fav.idTeam);
      const availableTeams = allTeams.filter(
        (team) =>
          !favoriteIds.includes(team.idTeam) &&
          (team.strTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
            team.strTeamShort
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())),
      );
      setFilteredTeams(availableTeams);
    }
  }, [searchQuery, favoriteTeams, allTeams]);

  const handleRemoveFromFavorites = (teamId: string, teamName: string) => {
    const success = removeFromFavorites(teamId);
    if (success) {
      setFavoriteTeams(getFavoriteTeams());
      toast.success(`${teamName} removed from favorites`);

      // Update filtered teams to include the removed team
      const favoriteIds = getFavoriteTeams().map((fav) => fav.idTeam);
      const availableTeams = allTeams.filter(
        (team) => !favoriteIds.includes(team.idTeam),
      );
      setFilteredTeams(availableTeams);
    } else {
      toast.error("Failed to remove from favorites");
    }
  };

  const handleClearAllFavorites = () => {
    const success = clearFavorites();
    if (success) {
      setFavoriteTeams([]);
      setFilteredTeams(allTeams);
      toast.success("All favorites cleared");
    } else {
      toast.error("Failed to clear favorites");
    }
  };

  const handleAddToFavorites = (team: Team) => {
    const success = addToFavorites(team);
    if (success) {
      setFavoriteTeams(getFavoriteTeams());
      toast.success(`${team.strTeam} added to favorites`);

      // Update filtered teams to remove the added team
      const favoriteIds = getFavoriteTeams().map((fav) => fav.idTeam);
      const availableTeams = allTeams.filter(
        (team) => !favoriteIds.includes(team.idTeam),
      );
      setFilteredTeams(availableTeams);
    } else {
      toast.error("Failed to add to favorites");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Star className="h-10 w-10 text-yellow-500" />
              Favorite Teams
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your favorite Premier League teams.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="gap-2"
              disabled={filteredTeams.length === 0}
            >
              <Plus className="h-4 w-4" />
              Add Team
            </Button>
            {favoriteTeams.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all teams from your favorites list. This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllFavorites}>
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {favoriteTeams.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Favorite Teams
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {filteredTeams.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Available to Add
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {favoriteTeams.length > 0
                      ? new Date(
                          Math.max(
                            ...favoriteTeams.map((fav) =>
                              new Date(fav.dateAdded).getTime(),
                            ),
                          ),
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last Added
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Favorite Teams Display */}
      {favoriteTeams.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <StarOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No favorite teams yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start building your collection by adding your favorite Premier
              League teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Team
              </Button>
              <Link href="/teams">
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Browse All Teams
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Favorite Teams</h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {favoriteTeams.length} Teams
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteTeams.map((favoriteTeam) => {
              const fullTeam = allTeams.find(
                (team) => team.idTeam === favoriteTeam.idTeam,
              );

              if (!fullTeam) {
                return (
                  <Card key={favoriteTeam.idTeam}>
                    <CardContent className="p-6 text-center">
                      <div className="space-y-4">
                        <div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center">
                          <span className="text-sm font-bold">
                            {favoriteTeam.strTeam.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {favoriteTeam.strTeam}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Added{" "}
                            {new Date(
                              favoriteTeam.dateAdded,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRemoveFromFavorites(
                              favoriteTeam.idTeam,
                              favoriteTeam.strTeam,
                            )
                          }
                          className="gap-2 w-full"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <div key={favoriteTeam.idTeam} className="relative group">
                  <TeamCard team={fullTeam} showFavoriteButton={false} />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Remove from favorites?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {fullTeam.strTeam}{" "}
                            from your favorites?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleRemoveFromFavorites(
                                fullTeam.idTeam,
                                fullTeam.strTeam,
                              )
                            }
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="absolute bottom-1 left-2">
                    <Badge variant="secondary" className="text-xs">
                      Added{" "}
                      {new Date(favoriteTeam.dateAdded).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Links */}
          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/schedule">
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  View Schedule
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/teams">
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Browse All Teams
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Team to Favorites
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddDialog(false)}
                >
                  ×
                </Button>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-96">
              {filteredTeams.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "No teams match your search"
                      : "All teams are already in your favorites!"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeams.map((team) => (
                    <Card
                      key={team.idTeam}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        handleAddToFavorites(team);
                        setShowAddDialog(false);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Avatar>
                              <AvatarImage src={team.strBadge} />
                              <AvatarFallback className="text-sm">
                                {team.strTeam.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{team.strTeam}</h3>
                            {team.strTeamShort && (
                              <p className="text-sm text-muted-foreground">
                                {team.strTeamShort}
                              </p>
                            )}
                          </div>
                          <Heart className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
