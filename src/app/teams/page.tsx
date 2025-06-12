"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  MapPin,
  Calendar,
} from "lucide-react";
import { Team } from "@/types";
import { getPLTeams } from "@/lib/api";
import { useFavorites } from "@/hooks/use-favorites";
import TeamCard from "@/components/team-card";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { favoriteTeams, isFavorite } = useFavorites();

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setIsLoading(true);
        const teamsData = await getPLTeams();
        setTeams(teamsData);
        setFilteredTeams(teamsData);
      } catch (error) {
        console.error("Error loading teams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
  }, []);

  // Filter and sort teams
  useEffect(() => {
    let filtered = [...teams];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (team) =>
          team.strTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.strTeamShort
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          team.strAlternate?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply category filter
    if (filterBy === "favorites") {
      const favoriteIds = favoriteTeams.map((fav) => fav.idTeam);
      filtered = filtered.filter((team) => favoriteIds.includes(team.idTeam));
    }
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.strTeam.localeCompare(b.strTeam);
        case "founded":
          return (
            parseInt(a.intFormedYear || "0") - parseInt(b.intFormedYear || "0")
          );
        default:
          return 0;
      }
    });

    setFilteredTeams(filtered);
  }, [teams, searchQuery, sortBy, filterBy, favoriteTeams]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Filter Controls Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Teams Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2 sm:gap-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary flex-shrink-0" />
              <span className="truncate">Premier League Teams</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Explore all {teams.length} Premier League teams
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-sm sm:text-base lg:text-lg px-3 py-1 sm:px-4 sm:py-2 self-start sm:self-auto"
          >
            {filteredTeams.length} Teams
          </Badge>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="founded">Year Founded</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter By */}
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="favorites">Favorites Only</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg self-start sm:self-auto">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams Display */}
      {filteredTeams.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No teams found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No teams match "${searchQuery}"`
                : "No teams available with current filters"}
            </p>
            {(searchQuery || filterBy !== "all") && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setFilterBy("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
              : "space-y-2 sm:space-y-4"
          }
        >
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.idTeam}
              team={team}
              variant={viewMode === "list" ? "compact" : "default"}
              showFavoriteButton={true}
            />
          ))}
        </div>
      )}

      {/* Load More Button for Large Datasets */}
      {filteredTeams.length > 20 && (
        <div className="text-center pt-4">
          <Button variant="outline" size="default" className="w-full sm:w-auto">
            Load More Teams
          </Button>
        </div>
      )}
    </div>
  );
}
