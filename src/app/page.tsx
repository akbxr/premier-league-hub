"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Users,
  Calendar,
  Star,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
} from "lucide-react";
import { Team, Event, League } from "@/types";
import {
  getNBATeams,
  getNBAPreviousMatches,
  getPreviousSeasonMatches,
  getNBANextMatches,
  getNBALeague,
} from "@/lib/api";
import { getFavoriteTeams } from "@/lib/favorites";
import TeamCard from "@/components/team-card";
import MatchCard from "@/components/match-card";

export default function HomePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [recentMatches, setRecentMatches] = useState<Event[]>([]);
  const [previousSeasonMatches, setPreviousSeasonMatches] = useState<Event[]>(
    [],
  );
  const [upcomingMatches, setUpcomingMatches] = useState<Event[]>([]);
  const [league, setLeague] = useState<League | null>(null);
  const [favoriteTeams, setFavoriteTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load all data in parallel
        const [
          teamsData,
          recentMatchesData,
          previousSeasonMatchesData,
          upcomingMatchesData,
          leagueData,
        ] = await Promise.all([
          getNBATeams(),
          getNBAPreviousMatches(),
          getPreviousSeasonMatches(),
          getNBANextMatches(),
          getNBALeague(),
        ]);

        setTeams(teamsData.slice(0, 8)); // Show only first 8 teams on home page
        setRecentMatches(recentMatchesData.slice(0, 6)); // Show 6 recent matches
        setPreviousSeasonMatches(previousSeasonMatchesData.slice(0, 6)); // Show 6 previous season matches
        setUpcomingMatches(upcomingMatchesData.slice(0, 6)); // Show 6 upcoming matches
        setLeague(leagueData);

        // Load favorite teams from localStorage
        const favorites = getFavoriteTeams();
        setFavoriteTeams(favorites);
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = [
    // 10 karena limit dari apu yg gratis
    {
      title: "Total Teams",
      value: "10",
      icon: Users,
      description: "Premier League Teams",
      color: "text-blue-600",
    },
    {
      title: "Active Season",
      value: "2024-2025",
      icon: Trophy,
      description: "Current Season",
      color: "text-green-600",
    },
    {
      title: "Favorite Teams",
      value: favoriteTeams.length.toString(),
      icon: Star,
      description: "Your Favorites",
      color: "text-yellow-600",
    },
    {
      title: "Matches Today",
      value: upcomingMatches
        .filter((match) => {
          const today = new Date().toDateString();
          const matchDate = new Date(match.dateEvent).toDateString();
          return today === matchDate;
        })
        .length.toString(),
      icon: Calendar,
      description: "Games Today",
      color: "text-purple-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-8 rounded-full mb-4" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-sm">
              Welcome to Premier League Hub
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Ultimate Premier League Experience
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore teams, track schedules, view standings, and follow your
              favorite Premier League teams all in one place.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/teams">
              <Button size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                Browse Teams
              </Button>
            </Link>
            <Link href="/schedule">
              <Button variant="outline" size="lg" className="gap-2">
                <Calendar className="h-5 w-5" />
                View Schedule
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {stat.title}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Featured Teams Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Premier League Teams</h2>
              <p className="text-muted-foreground">
                Discover all Premier League teams
              </p>
            </div>
            <Link href="/teams">
              <Button variant="outline" className="gap-2">
                View All Teams
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.map((team) => (
              <TeamCard key={team.idTeam} team={team} variant="default" />
            ))}
          </div>
        </section>

        {/* Matches Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Latest Matches</h2>
            <p className="text-muted-foreground">
              Recent games and upcoming fixtures
            </p>
          </div>

          <Tabs defaultValue="recent" className="space-y-6">
            <TabsContent value="recent" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {recentMatches.length > 0 ? (
                  recentMatches.map((match) => (
                    <MatchCard
                      key={match.idEvent}
                      match={match}
                      showResult={true}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No recent matches available
                    </p>
                  </div>
                )}
              </div>
              <div className="text-center">
                <Link href="/schedule">
                  <Button variant="outline" className="gap-2">
                    View Full Schedule
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((match) => (
                    <MatchCard
                      key={match.idEvent}
                      match={match}
                      showResult={false}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No upcoming matches available
                    </p>
                  </div>
                )}
              </div>
              <div className="text-center">
                <Link href="/schedule">
                  <Button variant="outline" className="gap-2">
                    View Full Schedule
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Previous Season Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold">2024-2025 Season</h2>
            <p className="text-muted-foreground">
              Matches for the 2024-2025 season
            </p>
          </div>

          <Tabs defaultValue="recent" className="space-y-6">
            <TabsContent value="recent" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {previousSeasonMatches.length > 0 ? (
                  previousSeasonMatches.map((match) => (
                    <MatchCard
                      key={match.idEvent}
                      match={match}
                      showResult={true}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No recent matches available
                    </p>
                  </div>
                )}
              </div>
              <div className="text-center">
                <Link href="/schedule">
                  <Button variant="outline" className="gap-2">
                    View Full Schedule
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((match) => (
                    <MatchCard
                      key={match.idEvent}
                      match={match}
                      showResult={false}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No upcoming matches available
                    </p>
                  </div>
                )}
              </div>
              <div className="text-center">
                <Link href="/schedule">
                  <Button variant="outline" className="gap-2">
                    View Full Schedule
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-6 py-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ready to Dive Deeper?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore detailed team information, comprehensive match schedules,
              and league standings.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/standings">
              <Button size="lg" variant="outline" className="gap-2">
                <TrendingUp className="h-5 w-5" />
                View Standings
              </Button>
            </Link>
            <Link href="/teams">
              <Button size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                Explore Teams
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
