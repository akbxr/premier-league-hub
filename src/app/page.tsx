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
  Zap,
  Sparkles,
  Target,
} from "lucide-react";
import { Team, Event, League } from "@/types";
import {
  getPLTeams,
  getPLPreviousMatches,
  getPreviousSeasonMatches,
  getPLNextMatches,
  getPremierLeague,
} from "@/lib/api";
import { useFavorites } from "@/hooks/use-favorites";
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
  const { favoriteTeams } = useFavorites();
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
          getPLTeams(),
          getPLPreviousMatches(),
          getPreviousSeasonMatches(),
          getPLNextMatches(),
          getPremierLeague(),
        ]);

        setTeams(teamsData.slice(0, 9)); // Show only first 9 teams on home page
        setRecentMatches(recentMatchesData.slice(0, 6)); // Show 6 recent matches
        setPreviousSeasonMatches(previousSeasonMatchesData.slice(0, 6)); // Show 6 previous season matches
        setUpcomingMatches(upcomingMatchesData.slice(0, 6)); // Show 6 upcoming matches
        setLeague(leagueData);

        // Favorites are loaded automatically by the hook
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = [
    {
      title: "Total Teams",
      value: "20",
      icon: Users,
      description: "Premier League Teams",
      gradient: "from-cyan-400 via-blue-500 to-purple-600",
      glowColor: "shadow-cyan-500/25",
    },
    {
      title: "Active Season",
      value: "2024-2025",
      icon: Trophy,
      description: "Current Season",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      glowColor: "shadow-yellow-500/25",
    },
    {
      title: "Favorite Teams",
      value: favoriteTeams.length.toString(),
      icon: Star,
      description: "Your Favorites",
      gradient: "from-pink-400 via-purple-500 to-indigo-600",
      glowColor: "shadow-pink-500/25",
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
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      glowColor: "shadow-green-500/25",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-8">
          {/* Hero Section Skeleton */}
          <div className="text-center space-y-4">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48 mx-auto bg-slate-700" />
              <Skeleton className="h-12 sm:h-16 w-3/4 mx-auto bg-slate-700" />
              <Skeleton className="h-6 w-1/2 mx-auto bg-slate-700" />
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Skeleton className="h-10 w-32 bg-slate-700" />
              <Skeleton className="h-10 w-32 bg-slate-700" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-3 sm:p-4">
                  <Skeleton className="h-8 w-8 rounded-full mb-4 bg-slate-700" />
                  <Skeleton className="h-8 w-16 mb-2 bg-slate-700" />
                  <Skeleton className="h-4 w-24 bg-slate-700" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 bg-slate-700" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-slate-800/50 border-slate-600">
                  <CardContent className="p-4">
                    <Skeleton className="h-12 w-12 rounded-full mb-4 bg-slate-700" />
                    <Skeleton className="h-6 w-32 mb-2 bg-slate-700" />
                    <Skeleton className="h-4 w-24 bg-slate-700" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-8 sm:space-y-12 lg:space-y-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center space-y-6 sm:space-y-8 pt-8 sm:pt-12">
          <div className="space-y-4 sm:space-y-6">
            <Badge
              variant="secondary"
              className="text-xs sm:text-sm bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border-purple-500/30 backdrop-blur-sm px-4 py-2"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Welcome to Premier League Hub
            </Badge>

            <div className="relative">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
                Your Ultimate Premier League Experience
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent blur-sm opacity-50 -z-10">
                Your Ultimate Premier League Experience
              </div>
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
              Explore teams, track schedules, view standings, and follow your
              favorite Premier League teams all in one place with cutting-edge
              design.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
            <Link href="/teams" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="gap-3 w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-3 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 border-0"
              >
                <Users className="h-5 w-5" />
                Browse Teams
                <Zap className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/schedule" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="gap-3 w-full sm:w-auto bg-transparent border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 font-semibold px-8 py-3 backdrop-blur-sm transition-all duration-300"
              >
                <Calendar className="h-5 w-5" />
                View Schedule
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 hover:border-slate-500/50 transition-all duration-500 hover:shadow-2xl ${stat.glowColor} group hover:scale-105`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 font-medium">
                        {stat.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Featured Teams Section */}
        <section className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Premier League Teams
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mt-2">
                Discover all Premier League teams with enhanced visuals
              </p>
            </div>
            <Link href="/teams" className="self-start sm:self-auto">
              <Button
                variant="outline"
                className="gap-2 text-sm bg-transparent border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 backdrop-blur-sm transition-all duration-300"
              >
                View All Teams
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teams.map((team) => (
              <TeamCard key={team.idTeam} team={team} variant="default" />
            ))}
          </div>
        </section>

        {/* Matches Section */}
        <section className="space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
              Latest Matches
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-2">
              Recent games and upcoming fixtures with live updates
            </p>
          </div>

          <Tabs defaultValue="recent" className="space-y-6">
            <TabsContent value="recent" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {recentMatches.length > 0 ? (
                  recentMatches.map((match) => (
                    <MatchCard
                      key={match.idEvent}
                      match={match}
                      showResult={true}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-8">
                      <Calendar className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">
                        No season matches available
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <Link href="/schedule">
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 backdrop-blur-sm px-8 py-3 transition-all duration-300"
                  >
                    View Full Schedule
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Previous Season Section */}
        <section className="space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              2024-2025 Season
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-2">
              Comprehensive season coverage and statistics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {previousSeasonMatches.length > 0 ? (
              previousSeasonMatches.map((match) => (
                <MatchCard
                  key={match.idEvent}
                  match={match}
                  showResult={true}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-8">
                  <Calendar className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">
                    No upcoming matches available
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/schedule">
              <Button
                variant="outline"
                className="gap-2 bg-transparent border-orange-500/50 text-orange-300 hover:bg-orange-500/10 hover:border-orange-400 backdrop-blur-sm px-8 py-3 transition-all duration-300"
              >
                View Full Schedule
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-6 sm:space-y-8 py-12 sm:py-16">
          <div className="bg-gradient-to-r from-purple-800/30 via-pink-800/30 to-cyan-800/30 backdrop-blur-xl rounded-3xl border border-slate-600/50 p-8 sm:p-12">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-2xl shadow-purple-500/25">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                Ready to Dive Deeper?
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Explore detailed team information, comprehensive match
                schedules, and interactive league standings with our modern
                interface.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8">
              <Link href="/standings" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-3 w-full sm:w-auto bg-transparent border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 font-semibold px-8 py-3 backdrop-blur-sm transition-all duration-300"
                >
                  <TrendingUp className="h-5 w-5" />
                  View Standings
                </Button>
              </Link>
              <Link href="/teams" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="gap-3 w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-8 py-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 border-0"
                >
                  <Users className="h-5 w-5" />
                  Explore Teams
                  <Sparkles className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
