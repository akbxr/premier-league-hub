"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trophy,
  CalendarDays,
} from "lucide-react";
import { Event } from "@/types";
import {
  getPLPreviousMatches,
  getPLNextMatches,
  getPreviousSeasonMatches,
} from "@/lib/api";
import MatchCard from "@/components/match-card";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";

export default function SchedulePage() {
  const [previousMatches, setPreviousMatches] = useState<Event[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Event[]>([]);
  const [filteredPrevious, setFilteredPrevious] = useState<Event[]>([]);
  const [filteredUpcoming, setFilteredUpcoming] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [filterTeam, setFilterTeam] = useState("all");
  const [viewMode, setViewMode] = useState<"default" | "compact">("default");

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setIsLoading(true);

        const [previousData, upcomingData, previousSeasonData] =
          await Promise.all([
            getPLPreviousMatches(),
            getPLNextMatches(),
            getPreviousSeasonMatches(),
          ]);

        const AllPreviousMatches = [...previousData, ...previousSeasonData];

        setPreviousMatches(AllPreviousMatches);
        setUpcomingMatches(upcomingData);
        setFilteredPrevious(AllPreviousMatches);
        setFilteredUpcoming(upcomingData);
      } catch (error) {
        console.error("Error loading schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedule();
  }, []);

  // Filter matches by team
  useEffect(() => {
    if (filterTeam === "all") {
      setFilteredPrevious(previousMatches);
      setFilteredUpcoming(upcomingMatches);
    } else {
      setFilteredPrevious(
        previousMatches.filter(
          (match) =>
            match.strHomeTeam === filterTeam ||
            match.strAwayTeam === filterTeam,
        ),
      );
      setFilteredUpcoming(
        upcomingMatches.filter(
          (match) =>
            match.strHomeTeam === filterTeam ||
            match.strAwayTeam === filterTeam,
        ),
      );
    }
  }, [filterTeam, previousMatches, upcomingMatches]);

  // Get unique teams for filter
  const allTeams = Array.from(
    new Set([
      ...previousMatches.flatMap((match) => [
        match.strHomeTeam,
        match.strAwayTeam,
      ]),
      ...upcomingMatches.flatMap((match) => [
        match.strHomeTeam,
        match.strAwayTeam,
      ]),
    ]),
  ).sort();

  // Group matches by date
  const groupMatchesByDate = (matches: Event[]) => {
    const grouped = matches.reduce(
      (acc, match) => {
        const utcDate = new Date(
          `${match.dateEvent}T${match.strTime || "00:00:00"}Z`,
        );

        const indonesianDate = new Date(utcDate.getTime());
        indonesianDate.setHours(indonesianDate.getHours() + 7);

        const dateKey = indonesianDate.toISOString().slice(0, 10);

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(match);
        return acc;
      },
      {} as Record<string, Event[]>,
    );

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  };

  // Filter matches for current week
  const getWeekMatches = (matches: Event[]) => {
    const weekStart = startOfWeek(selectedWeek);
    const weekEnd = endOfWeek(selectedWeek);

    return matches.filter((match) => {
      const matchDate = new Date(match.dateEvent);
      return matchDate >= weekStart && matchDate <= weekEnd;
    });
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [previousData, upcomingData] = await Promise.all([
        getPLPreviousMatches(),
        getPLNextMatches(),
      ]);

      setPreviousMatches(previousData);
      setUpcomingMatches(upcomingData);
    } catch (error) {
      console.error("Error refreshing schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setSelectedWeek(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(addWeeks(selectedWeek, 1));
  };

  const handleCurrentWeek = () => {
    setSelectedWeek(new Date());
  };

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
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Schedule Skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Card key={j}>
                      <CardContent className="p-4">
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2 sm:gap-3">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary flex-shrink-0" />
              <span className="truncate">Schedule</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Complete match schedule and results
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="gap-2 self-start sm:self-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {filteredPrevious.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recent Matches
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                  <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {filteredUpcoming.length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Upcoming Matches
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {filteredPrevious.length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Recent Matches
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Team Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Select value={filterTeam} onValueChange={setFilterTeam}>
                <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
                  <SelectValue placeholder="Filter by team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {allTeams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg self-start sm:self-auto">
                <Button
                  variant={viewMode === "default" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("default")}
                  className="rounded-r-none px-3"
                >
                  <span className="hidden sm:inline">Detailed</span>
                  <span className="sm:hidden">Detail</span>
                </Button>
                <Button
                  variant={viewMode === "compact" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("compact")}
                  className="rounded-l-none px-3"
                >
                  Compact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Content */}
      <Tabs defaultValue="previous" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-cols-3">
          <TabsTrigger value="previous" className="gap-2">
            <Clock className="h-4 w-4" />
            Previous
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="week" className="gap-2">
            <Calendar className="h-4 w-4" />
            This Week
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Matches */}
        <TabsContent value="upcoming" className="space-y-6">
          {filteredUpcoming.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No upcoming matches
                </h3>
                <p className="text-muted-foreground">
                  {filterTeam !== "all"
                    ? `No upcoming matches for ${filterTeam}`
                    : "No upcoming matches scheduled"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === "compact"
                  ? "space-y-2"
                  : "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
              }
            >
              {filteredUpcoming.map((match) => (
                <MatchCard
                  key={match.idEvent}
                  match={match}
                  variant={viewMode}
                  showResult={false}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Previous Matches */}
        <TabsContent value="previous" className="space-y-6">
          {filteredPrevious.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No previous matches
                </h3>
                <p className="text-muted-foreground">
                  {filterTeam !== "all"
                    ? `No previous matches for ${filterTeam}`
                    : "No previous matches available"}
                </p>
              </CardContent>
            </Card>
          ) : (
            groupMatchesByDate(filteredPrevious).map(([date, matches]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {format(new Date(date), "EEEE, MMMM do, yyyy")}
                    <Badge variant="secondary">{matches.length} matches</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={
                      viewMode === "compact"
                        ? "space-y-2"
                        : "grid grid-cols-1 md:grid-cols-2 gap-4"
                    }
                  >
                    {matches.map((match) => (
                      <MatchCard
                        key={match.idEvent}
                        match={match}
                        variant={viewMode}
                        showResult={true}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Week View */}
        <TabsContent value="week" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Week of {format(startOfWeek(selectedWeek), "MMMM do, yyyy")}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousWeek}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCurrentWeek}
                  >
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const weekUpcoming = getWeekMatches(filteredUpcoming);
                const weekPrevious = getWeekMatches(filteredPrevious);
                const allWeekMatches = [...weekPrevious, ...weekUpcoming];

                if (allWeekMatches.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No matches scheduled for this week
                      </p>
                    </div>
                  );
                }

                return groupMatchesByDate(allWeekMatches).map(
                  ([date, matches]) => (
                    <div key={date} className="mb-6 last:mb-0">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        {format(new Date(date), "EEEE, MMMM do")}
                        <Badge variant="outline">{matches.length}</Badge>
                      </h4>
                      <div
                        className={
                          viewMode === "compact"
                            ? "space-y-2"
                            : "grid grid-cols-1 md:grid-cols-2 gap-4"
                        }
                      >
                        {matches.map((match) => (
                          <MatchCard
                            key={match.idEvent}
                            match={match}
                            variant={viewMode}
                            showResult={true}
                          />
                        ))}
                      </div>
                    </div>
                  ),
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
