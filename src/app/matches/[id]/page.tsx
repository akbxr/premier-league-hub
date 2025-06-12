"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Users,
  Trophy,
  ArrowLeft,
  ExternalLink,
  BarChart,
  Activity,
  VideoIcon,
  Share2,
} from "lucide-react";
import type { EventDetails, EventStatistic } from "@/types";
import {
  getEventDetails,
  getEventStatistics,
  convertToIndonesianTime,
} from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;

  const [match, setMatch] = useState<EventDetails | null>(null);
  const [statistics, setStatistics] = useState<EventStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMatchDetails = async () => {
      if (!matchId) return;

      try {
        setIsLoading(true);
        const [matchData, statisticsData] = await Promise.all([
          getEventDetails(matchId),
          getEventStatistics(matchId),
        ]);
        setMatch(matchData);
        setStatistics(statisticsData);
      } catch (error) {
        console.error("Error loading match details:", error);
        toast.error("Failed to load match details");
      } finally {
        setIsLoading(false);
      }
    };

    loadMatchDetails();
  }, [matchId]);

  const getMatchStatus = () => {
    if (!match) return "Unknown";

    const hasResult =
      match.intHomeScore !== null && match.intAwayScore !== null;
    if (match.strStatus === "Match Finished" || hasResult) {
      return "Finished";
    }
    if (match.strStatus === "Not Started") {
      return "Upcoming";
    }
    return match.strStatus || "Scheduled";
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Finished":
        return "default";
      case "Upcoming":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getWinner = () => {
    if (!match || !match.intHomeScore || !match.intAwayScore) return null;

    const homeScore = Number.parseInt(match.intHomeScore);
    const awayScore = Number.parseInt(match.intAwayScore);

    if (homeScore > awayScore) return "home";
    if (awayScore > homeScore) return "away";
    return "tie";
  };

  const indonesianTime = match
    ? convertToIndonesianTime(match.dateEvent, match.strTime)
    : "";

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        {/* Match Info Skeleton */}
        <Card>
          <CardContent className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 sm:h-6 w-24 sm:w-32" />
                  <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mx-auto" />
                <Skeleton className="h-3 sm:h-4 w-8 sm:w-12 mx-auto" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="space-y-2 text-right">
                  <Skeleton className="h-4 sm:h-6 w-24 sm:w-32" />
                  <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                </div>
                <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Card>
          <CardContent className="p-6 sm:p-12 text-center">
            <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Match not found
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              The match you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/schedule">
              <Button className="text-sm sm:text-base">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Schedule
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const winner = getWinner();
  const status = getMatchStatus();
  const hasResult = match.intHomeScore !== null && match.intAwayScore !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Navigation */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
          <Link href="/schedule" className="hover:text-primary">
            Schedule
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">
            {match.strHomeTeam} vs {match.strAwayTeam}
          </span>
        </div>

        {/* Match Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-3xl font-bold leading-tight">
              {match.strEvent}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {match.strLeague} • {match.strSeason}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Badge
              variant={getStatusVariant(status)}
              className="text-sm sm:text-lg px-2 sm:px-4 py-1 sm:py-2"
            >
              {status}
            </Badge>
            <Link href="/schedule">
              <Button variant="ghost" className="gap-2 text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Match Score Card */}
        <Card className="overflow-hidden">
          {match.strThumb && (
            <div className="relative h-32 sm:h-48 w-full">
              <Image
                src={match.strThumb}
                alt={`${match.strHomeTeam} vs ${match.strAwayTeam}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          <CardContent className="p-4 sm:p-8">
            {/* Mobile Layout */}
            <div className="flex sm:hidden items-center justify-between gap-2">
              {/* Home Team - Mobile */}
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <Avatar className="h-10 w-10 border-2 border-background flex-shrink-0">
                  <AvatarImage src={match.strHomeTeamBadge} />
                  <AvatarFallback className="text-sm font-bold">
                    {match.strHomeTeam.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2
                    className={`text-base font-bold truncate ${winner === "home" ? "text-green-600" : ""}`}
                  >
                    {match.strHomeTeam}
                  </h2>
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      Home
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Score - Mobile */}
              <div className="text-center px-3 flex-shrink-0">
                {hasResult ? (
                  <div className="space-y-1">
                    <div className="text-xl font-bold">
                      {match.intHomeScore} - {match.intAwayScore}
                    </div>
                    <Badge variant="default" className="text-xs">
                      Final
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-muted-foreground">
                      VS
                    </div>
                    {match.strTime && (
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(match.dateEvent), "MMM dd, HH:mm")}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Away Team - Mobile */}
              <div className="flex items-center space-x-2 flex-1 justify-end min-w-0">
                <div className="text-right min-w-0 flex-1">
                  <h2
                    className={`text-base font-bold truncate ${winner === "away" ? "text-green-600" : ""}`}
                  >
                    {match.strAwayTeam}
                  </h2>
                  <div className="flex gap-1 justify-end flex-wrap">
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      Away
                    </Badge>
                  </div>
                </div>
                <Avatar className="h-10 w-10 border-2 border-background flex-shrink-0">
                  <AvatarImage
                    src={match.strAwayTeamBadge || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-sm font-bold">
                    {match.strAwayTeam.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Home Team - Desktop */}
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-background flex-shrink-0">
                  <AvatarImage
                    src={match.strHomeTeamBadge || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-sm sm:text-lg font-bold">
                    {match.strHomeTeam.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2
                    className={`text-lg sm:text-2xl font-bold truncate ${winner === "home" ? "text-green-600" : ""}`}
                  >
                    {match.strHomeTeam}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Home
                  </p>
                </div>
              </div>

              {/* Score - Desktop */}
              <div className="text-center px-4 sm:px-8 flex-shrink-0">
                {hasResult ? (
                  <div className="space-y-2">
                    <div className="text-2xl sm:text-4xl font-bold">
                      {match.intHomeScore} - {match.intAwayScore}
                    </div>
                    <Badge variant="default" className="text-xs sm:text-sm">
                      Final
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xl sm:text-2xl font-bold text-muted-foreground">
                      VS
                    </div>
                  </div>
                )}
              </div>

              {/* Away Team - Desktop */}
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 justify-end min-w-0">
                <div className="text-right min-w-0 flex-1">
                  <h2
                    className={`text-lg sm:text-2xl font-bold truncate ${winner === "away" ? "text-green-600" : ""}`}
                  >
                    {match.strAwayTeam}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Away
                  </p>
                </div>
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-background flex-shrink-0">
                  <AvatarImage
                    src={match.strAwayTeamBadge || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-sm sm:text-lg font-bold">
                    {match.strAwayTeam.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Match Details */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex text-base sm:text-lg items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Match Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Match Score*/}
                {hasResult && (
                  <div className="space-y-4 sm:space-y-8">
                    <h4 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                      <BarChart className="h-4 w-4" />
                      Match Score
                    </h4>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          {match.intHomeScore || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground truncate">
                          {match.strHomeTeam}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Final Score
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-red-600">
                          {match.intAwayScore || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground truncate">
                          {match.strAwayTeam}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Match Statistics */}
                    {statistics.length > 0 && (
                      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                        <h4 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                          <BarChart className="h-4 w-4" />
                          Match Statistics
                        </h4>
                        <div className="grid gap-3 sm:gap-4">
                          {statistics.map((stat) => {
                            const homeValue =
                              Number.parseInt(stat.intHome) || 0;
                            const awayValue =
                              Number.parseInt(stat.intAway) || 0;
                            const total = homeValue + awayValue;
                            const homePercentage =
                              total > 0 ? (homeValue / total) * 100 : 50;
                            const awayPercentage =
                              total > 0 ? (awayValue / total) * 100 : 50;

                            return (
                              <div
                                key={stat.idStatistic}
                                className="bg-muted/30 rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex justify-between items-center mb-2 sm:mb-3">
                                  <span className="font-medium text-xs sm:text-sm">
                                    {stat.strStat}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {total} Total
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                                  <div className="text-center">
                                    <div className="text-sm sm:text-lg font-bold text-blue-600">
                                      {stat.intHome}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {match.strHomeTeam}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="w-full bg-muted rounded-full h-2 sm:h-3 relative overflow-hidden">
                                      <div
                                        className="bg-blue-500 h-2 sm:h-3 rounded-l-full transition-all duration-300"
                                        style={{
                                          width: `${homePercentage}%`,
                                        }}
                                      ></div>
                                      <div
                                        className="bg-red-500 h-2 sm:h-3 rounded-r-full absolute top-0 right-0 transition-all duration-300"
                                        style={{
                                          width: `${awayPercentage}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {homePercentage.toFixed(0)}% -{" "}
                                      {awayPercentage.toFixed(0)}%
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm sm:text-lg font-bold text-red-600">
                                      {stat.intAway}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {match.strAwayTeam}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Match Description */}
                {match.strDescriptionEN && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm sm:text-base">
                      About This Match
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {match.strDescriptionEN}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video/Media */}
            {match.strVideo && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <VideoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    Match Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={match.strVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 sm:p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <VideoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">
                      Watch Match Highlights
                    </span>
                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground flex-shrink-0" />
                  </a>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Match Details */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  Match Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Date & Time
                  </span>
                  <span className="font-medium text-right text-xs sm:text-sm">
                    {indonesianTime}
                  </span>
                </div>

                {match.strVenue && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Venue
                    </span>
                    <span className="font-medium text-right text-xs sm:text-sm">
                      {match.strVenue}
                    </span>
                  </div>
                )}

                {match.strLeague && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      League
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {match.strLeague}
                    </span>
                  </div>
                )}

                {match.strSeason && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Season
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {match.strSeason}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Status
                  </span>
                  <Badge variant={getStatusVariant(status)} className="text-xs">
                    {status}
                  </Badge>
                </div>

                {match.strResult && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Result
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {match.strResult}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Link href={`/teams/${match.idHomeTeam}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-xs sm:text-sm h-9 sm:h-10"
                  >
                    <Users className="h-4 w-4" />
                    <span className="truncate">View {match.strHomeTeam}</span>
                  </Button>
                </Link>

                <Link href={`/teams/${match.idAwayTeam}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-xs sm:text-sm h-9 sm:h-10"
                  >
                    <Users className="h-4 w-4" />
                    <span className="truncate">View {match.strAwayTeam}</span>
                  </Button>
                </Link>

                <Link href="/schedule" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-xs sm:text-sm h-9 sm:h-10"
                  >
                    <Calendar className="h-4 w-4" />
                    Full Schedule
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-xs sm:text-sm h-9 sm:h-10"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: match.strEvent,
                        text: `Check out this Premier League match: ${match.strHomeTeam} vs ${match.strAwayTeam}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share Match
                </Button>
              </CardContent>
            </Card>

            {/* Teams Head-to-Head */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                  Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                      <AvatarImage
                        src={match.strHomeTeamBadge || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {match.strHomeTeam.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-xs sm:text-sm truncate">
                      {match.strHomeTeam}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    Home
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                      <AvatarImage
                        src={match.strAwayTeamBadge || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {match.strAwayTeam.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-xs sm:text-sm truncate">
                      {match.strAwayTeam}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    Away
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
