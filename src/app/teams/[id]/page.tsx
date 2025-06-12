"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Heart,
  HeartOff,
  Users,
  Calendar,
  MapPin,
  Globe,
  Trophy,
  Star,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { Team, Event } from "@/types";
import {
  getTeamDetails,
  getTeamPreviousMatches,
  getTeamNextMatches,
} from "@/lib/api";
import { useFavorites } from "@/hooks/use-favorites";
import { toast } from "sonner";
import MatchCard from "@/components/match-card";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [previousMatches, setPreviousMatches] = useState<Event[]>([]);
  const [nextMatches, setNextMatches] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const { isFavorite: isTeamFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadTeamData = async () => {
      if (!teamId) return;

      try {
        setIsLoading(true);

        // Load team details and matches in parallel
        const [teamData, prevMatches, nextMatchesData] = await Promise.all([
          getTeamDetails(teamId),
          getTeamPreviousMatches(teamId),
          getTeamNextMatches(teamId),
        ]);

        console.log("prevMatches", prevMatches);
        console.log("nextMatchesData", nextMatchesData);

        setTeam(teamData);
        setPreviousMatches(prevMatches.slice(0, 10)); // Show last 10 matches
        setNextMatches(nextMatchesData.slice(0, 10)); // Show next 10 matches
      } catch (error) {
        console.error("Error loading team data:", error);
        toast.error("Failed to load team data");
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, [teamId]);

  const isFavorite = team ? isTeamFavorite(team.idTeam) : false;

  const handleFavoriteToggle = async () => {
    if (!team) return;

    setIsTogglingFavorite(true);

    try {
      const success = toggleFavorite(team);
      if (success) {
        if (isFavorite) {
          toast.success(`${team.strTeam} removed from favorites`);
        } else {
          toast.success(`${team.strTeam} added to favorites`);
        }
      } else {
        toast.error(
          isFavorite
            ? "Failed to remove from favorites"
            : "Failed to add to favorites",
        );
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const socialLinks = [
    {
      name: "Website",
      url: team?.strWebsite,
      icon: Globe,
      color: "text-blue-600",
    },
    {
      name: "Facebook",
      url: team?.strFacebook,
      icon: Facebook,
      color: "text-blue-500",
    },
    {
      name: "Twitter",
      url: team?.strTwitter,
      icon: Twitter,
      color: "text-sky-500",
    },
    {
      name: "Instagram",
      url: team?.strInstagram,
      icon: Instagram,
      color: "text-pink-500",
    },
    {
      name: "YouTube",
      url: team?.strYoutube,
      icon: Youtube,
      color: "text-red-500",
    },
  ].filter((link) => link.url);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>

        {/* Team Info Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Matches Skeleton */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Team not found</h3>
            <p className="text-muted-foreground mb-4">
              The team you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/teams">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Teams
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
      {/* Back Button */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/teams">
          <Button variant="outline" size="sm" className="gap-1 sm:gap-2">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Back</span>
          </Button>
        </Link>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-muted-foreground truncate">
          Team Details
        </h1>
      </div>

      {/* Team Header */}
      <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-600/50">
        {team.strTeamBanner && (
          <div className="relative h-32 sm:h-48 lg:h-64 rounded-t-lg overflow-hidden">
            <Image
              src={team.strTeamBanner}
              alt={`${team.strTeam} banner`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          </div>
        )}

        <CardHeader className="relative">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="relative">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-4 border-slate-500/50">
                <AvatarImage src={team.strBadge} alt={`${team.strTeam} logo`} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-lg sm:text-xl font-bold text-white">
                  {team.strTeam.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white break-words">
                    {team.strTeam}
                  </h1>
                  {team.strAlternate && (
                    <p className="text-sm sm:text-base text-slate-400 mt-1">
                      {team.strAlternate}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-3">
                    {team.strLeague && (
                      <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs sm:text-sm">
                        {team.strLeague}
                      </Badge>
                    )}
                    {team.intFormedYear && (
                      <Badge
                        variant="outline"
                        className="border-slate-500/50 text-slate-300 text-xs sm:text-sm"
                      >
                        Est. {team.intFormedYear}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleFavoriteToggle}
                  disabled={isTogglingFavorite}
                  className={`gap-2 transition-all duration-300 ${
                    isFavorite
                      ? "bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/50"
                      : "bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50"
                  }`}
                  size="sm"
                >
                  {isFavorite ? (
                    <Heart className="h-4 w-4 fill-current" />
                  ) : (
                    <HeartOff className="h-4 w-4" />
                  )}
                  <span className="text-xs sm:text-sm">
                    {isFavorite ? "Remove" : "Add"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        {team.strDescriptionEN && (
          <CardContent className="pt-0">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {team.strDescriptionEN}
            </p>
          </CardContent>
        )}
      </Card>

      {/* Team Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Basic Info */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-cyan-400" />
              Team Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {team.strStadium && (
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-400">Stadium</p>
                  <p className="text-sm sm:text-base text-white font-medium break-words">
                    {team.strStadium}
                  </p>
                </div>
              </div>
            )}

            {team.strManager && (
              <div className="flex items-start gap-2 sm:gap-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-400">Manager</p>
                  <p className="text-sm sm:text-base text-white font-medium break-words">
                    {team.strManager}
                  </p>
                </div>
              </div>
            )}

            {team.intStadiumCapacity && (
              <div className="flex items-start gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-pink-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-400">
                    Stadium Capacity
                  </p>
                  <p className="text-sm sm:text-base text-white font-medium">
                    {parseInt(team.intStadiumCapacity).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {team.strCountry && (
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-400">Country</p>
                  <p className="text-sm sm:text-base text-white font-medium">
                    {team.strCountry}
                  </p>
                </div>
              </div>
            )}

            {team.intFormedYear && (
              <div className="flex items-start gap-2 sm:gap-3">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-400">Founded</p>
                  <p className="text-sm sm:text-base text-white font-medium">
                    {team.intFormedYear}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="h-5 w-5 text-cyan-400" />
                Connect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-slate-700/30 hover:bg-slate-600/50 transition-colors group"
                  >
                    <link.icon
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${link.color} group-hover:scale-110 transition-transform`}
                    />
                    <span className="text-sm sm:text-base text-slate-300 group-hover:text-white">
                      {link.name}
                    </span>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 ml-auto group-hover:text-slate-300" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Matches Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Previous Matches */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-green-400" />
              Recent Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {previousMatches.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {previousMatches.slice(0, 5).map((match) => (
                  <MatchCard
                    key={match.idEvent}
                    match={match}
                    variant="compact"
                  />
                ))}
                {previousMatches.length > 5 && (
                  <Button
                    variant="outline"
                    className="w-full text-xs sm:text-sm"
                    asChild
                  >
                    <Link href={`/teams/${teamId}/matches`}>
                      View All Matches
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  No recent matches found
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Matches */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-blue-400" />
              Upcoming Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextMatches.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {nextMatches.slice(0, 5).map((match) => (
                  <MatchCard
                    key={match.idEvent}
                    match={match}
                    variant="compact"
                  />
                ))}
                {nextMatches.length > 5 && (
                  <Button
                    variant="outline"
                    className="w-full text-xs sm:text-sm"
                    asChild
                  >
                    <Link href={`/teams/${teamId}/fixtures`}>
                      View All Fixtures
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  No upcoming matches scheduled
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
