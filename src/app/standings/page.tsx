"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Users,
  Target,
  Award,
} from "lucide-react";
import { Team, TeamStanding } from "@/types";
import { getPLTeams, getPLStandings } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

export default function StandingsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Create mock standings from teams data since the free API might not have standings
  const createMockStandings = (teams: Team[]): TeamStanding[] => {
    return teams
      .map((team, index) => {
        const played = Math.floor(Math.random() * 82) + 1;
        const winPercentage = 0.3 + Math.random() * 0.4; // 30-70% win rate
        const wins = Math.floor(played * winPercentage);
        const losses = played - wins;
        const points = wins * 2 + losses;

        return {
          idStanding: `standing_${team.idTeam}`,
          intRank: index + 1,
          idTeam: team.idTeam,
          strTeam: team.strTeam,
          strTeamBadge: team.strBadge,
          idLeague: "4387",
          strLeague: "Premier League",
          strSeason: "2024-2025",
          intPlayed: played,
          intWin: wins,
          intLoss: losses,
          intPoints: points,
          intGoalsFor: Math.floor(Math.random() * 2500) + 2000,
          intGoalsAgainst: Math.floor(Math.random() * 2500) + 2000,
          intGoalDifference: 0,
          strForm: generateForm(),
          dateUpdated: new Date().toISOString(),
        };
      })
      .sort((a, b) => {
        // Sort by win percentage, then by wins
        const aWinPct = a.intWin / a.intPlayed;
        const bWinPct = b.intWin / b.intPlayed;
        if (Math.abs(aWinPct - bWinPct) < 0.001) {
          return b.intWin - a.intWin;
        }
        return bWinPct - aWinPct;
      })
      .map((team, index) => ({ ...team, intRank: index + 1 }));
  };

  const generateForm = (): string => {
    const results = ["W", "L"];
    const form = [];
    for (let i = 0; i < 5; i++) {
      form.push(results[Math.floor(Math.random() * results.length)]);
    }
    return form.join("");
  };

  useEffect(() => {
    const loadStandings = async () => {
      try {
        setIsLoading(true);

        // Load teams first
        const teamsData = await getPLTeams();
        setTeams(teamsData);

        // Try to get real standings, fallback to mock data
        try {
          const standingsData = await getPLStandings();
          if (standingsData && standingsData.length > 0) {
            setStandings(standingsData);
          } else {
            // Create mock standings from teams data
            const mockStandings = createMockStandings(teamsData);
            setStandings(mockStandings);
          }
        } catch (error) {
          console.log("Real standings not available, using mock data");
          const mockStandings = createMockStandings(teamsData);
          setStandings(mockStandings);
        }

        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error loading standings:", error);
        toast.error("Failed to load standings");
      } finally {
        setIsLoading(false);
      }
    };

    loadStandings();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const teamsData = await getPLTeams();
      const mockStandings = createMockStandings(teamsData);
      setStandings(mockStandings);
      setLastUpdated(new Date());
      toast.success("Standings refreshed");
    } catch (error) {
      console.error("Error refreshing standings:", error);
      toast.error("Failed to refresh standings");
    } finally {
      setIsLoading(false);
    }
  };

  const getFormIcon = (result: string) => {
    switch (result) {
      case "W":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "L":
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  const getPositionBadge = (position: number) => {
    if (position <= 8) {
      return (
        <Badge className="bg-green-100 text-green-800 text-xs">Playoffs</Badge>
      );
    } else if (position <= 10) {
      return (
        <Badge variant="secondary" className="text-xs">
          Play-In
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-xs">
          Lottery
        </Badge>
      );
    }
  };

  const calculateWinPercentage = (wins: number, played: number): string => {
    if (played === 0) return "0.000";
    return (wins / played).toFixed(3);
  };

  // Split teams into conferences (simplified)
  const easternConference = standings.slice(0, Math.ceil(standings.length / 2));
  const westernConference = standings.slice(Math.ceil(standings.length / 2));

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 sm:h-12 w-48 sm:w-64" />
          <Skeleton className="h-4 sm:h-6 w-64 sm:w-96" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3 sm:p-4">
                <Skeleton className="h-12 sm:h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <Skeleton className="h-5 sm:h-6 w-24 sm:w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-10 sm:h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-2 sm:gap-3">
              <Trophy className="h-6 w-6 sm:h-10 sm:w-10 text-primary flex-shrink-0" />
              <span className="leading-tight">Premier League Standings</span>
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground">
              Current season standings and team rankings
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {lastUpdated && (
              <span className="text-xs sm:text-sm text-muted-foreground">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="gap-2 text-sm sm:text-base h-8 sm:h-10"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Update</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-bold truncate">
                    {standings.length > 0
                      ? standings[0]?.strTeam.split(" ").pop()
                      : "TBD"}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    League Leader
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-bold">16</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Playoff Spots
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-purple-100 text-purple-600 flex-shrink-0">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-bold">
                    {standings.length > 0
                      ? Math.max(...standings.map((s) => s.intWin))
                      : 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Most Wins
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-orange-100 text-orange-600 flex-shrink-0">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-bold">2024-2025</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Season
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Standings Table */}
      <div className="space-y-4 sm:space-y-8">
        {/* Full League Standings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              League Standings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Mobile View - Card Layout */}
            <div className="block sm:hidden">
              <div className="space-y-2">
                {standings.map((team, index) => (
                  <div
                    key={team.idTeam}
                    className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-sm font-medium w-6">
                          {team.intRank}
                        </span>
                        {index < 3 && (
                          <Trophy className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={team.strBadge} />
                        <AvatarFallback className="text-xs">
                          {team.strTeam.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/teams/${encodeURIComponent(team.strTeam)}`}
                          className="hover:text-primary transition-colors"
                        >
                          <div className="font-medium text-sm truncate">
                            {team.strTeam}
                          </div>
                        </Link>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span className="text-green-600 font-semibold">
                            {team.intWin}W
                          </span>
                          <span className="text-red-600 font-semibold">
                            {team.intLoss}L
                          </span>
                          <span className="font-mono">
                            {calculateWinPercentage(
                              team.intWin,
                              team.intPlayed,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {getPositionBadge(team.intRank)}
                      <div className="flex items-center space-x-1">
                        {team.strForm
                          ?.split("")
                          .slice(0, 3)
                          .map((result, i) => (
                            <div key={i} className="flex items-center">
                              {getFormIcon(result)}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-center">W</TableHead>
                    <TableHead className="text-center">L</TableHead>
                    <TableHead className="text-center">PCT</TableHead>
                    <TableHead className="text-center">PTS</TableHead>
                    <TableHead className="text-center">Form</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((team, index) => (
                    <TableRow key={team.idTeam} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {team.intRank}
                          {index < 3 && (
                            <Trophy className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/teams/${encodeURIComponent(team.strTeam)}`}
                          className="flex items-center space-x-3 hover:text-primary transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={team.strBadge} />
                            <AvatarFallback className="text-xs">
                              {team.strTeam.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{team.strTeam}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-green-600">
                        {team.intWin}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-red-600">
                        {team.intLoss}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {calculateWinPercentage(team.intWin, team.intPlayed)}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {team.intPoints}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {team.strForm?.split("").map((result, i) => (
                            <div key={i} className="flex items-center">
                              {getFormIcon(result)}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getPositionBadge(team.intRank)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Conference Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Eastern Conference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Eastern Conference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {easternConference.slice(0, 15).map((team, index) => (
                <div
                  key={team.idTeam}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-medium w-4 sm:w-6 flex-shrink-0">
                      {index + 1}
                    </span>
                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
                      <AvatarImage src={team.strBadge} />
                      <AvatarFallback className="text-xs">
                        {team.strTeam.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/teams/${encodeURIComponent(team.strTeam)}`}
                      className="hover:text-primary transition-colors min-w-0 flex-1"
                    >
                      <span className="font-medium text-xs sm:text-sm truncate block">
                        {team.strTeam}
                      </span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm flex-shrink-0">
                    <span className="text-green-600 font-semibold">
                      {team.intWin}
                    </span>
                    <span className="text-red-600 font-semibold">
                      {team.intLoss}
                    </span>
                    <span className="font-mono hidden sm:inline">
                      {calculateWinPercentage(team.intWin, team.intPlayed)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Western Conference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                Western Conference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {westernConference.slice(0, 15).map((team, index) => (
                <div
                  key={team.idTeam}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-medium w-4 sm:w-6 flex-shrink-0">
                      {index + 1}
                    </span>
                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
                      <AvatarImage src={team.strBadge} />
                      <AvatarFallback className="text-xs">
                        {team.strTeam.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/teams/${encodeURIComponent(team.strTeam)}`}
                      className="hover:text-primary transition-colors min-w-0 flex-1"
                    >
                      <span className="font-medium text-xs sm:text-sm truncate block">
                        {team.strTeam}
                      </span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm flex-shrink-0">
                    <span className="text-green-600 font-semibold">
                      {team.intWin}
                    </span>
                    <span className="text-red-600 font-semibold">
                      {team.intLoss}
                    </span>
                    <span className="font-mono hidden sm:inline">
                      {calculateWinPercentage(team.intWin, team.intPlayed)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Playoffs
                </Badge>
                <span>Positions 1-8: Guaranteed playoff spot</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  Play-In
                </Badge>
                <span>Positions 9-10: Play-in tournament</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  Lottery
                </Badge>
                <span>Positions 11+: Draft lottery</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <span>W = Wins</span>
              <span>L = Losses</span>
              <span className="hidden sm:inline">PCT = Win Percentage</span>
              <span className="hidden sm:inline">PTS = Points</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
