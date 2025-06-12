"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  ArrowLeft,
  ExternalLink,
  Target,
  BarChart,
  Activity,
  VideoIcon,
  Share2,
} from "lucide-react";
import { EventDetails, Event, EventStatistic } from "@/types";
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

    const homeScore = parseInt(match.intHomeScore);
    const awayScore = parseInt(match.intAwayScore);

    if (homeScore > awayScore) return "home";
    if (awayScore > homeScore) return "away";
    return "tie";
  };

  const indonesianTime = match
    ? convertToIndonesianTime(match.dateEvent, match.strTime)
    : "";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        {/* Match Info Skeleton */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-12 mx-auto" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="space-y-2 text-right">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
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
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Match not found</h3>
            <p className="text-muted-foreground mb-4">
              The match you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/schedule">
              <Button>
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
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Navigation */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/schedule" className="hover:text-primary">
            Schedule
          </Link>
          <span>/</span>
          <span className="text-foreground">
            {match.strHomeTeam} vs {match.strAwayTeam}
          </span>
        </div>

        {/* Match Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{match.strEvent}</h1>
            <p className="text-muted-foreground">
              {match.strLeague} • {match.strSeason}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant={getStatusVariant(status)}
              className="text-lg px-4 py-2"
            >
              {status}
            </Badge>
            <Link href="/schedule">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>

        {/* Match Score Card */}
        <Card className="overflow-hidden">
          {match.strThumb && (
            <div className="relative h-48 w-full">
              <Image
                src={match.strThumb}
                alt={`${match.strHomeTeam} vs ${match.strAwayTeam}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              {/* Home Team */}
              <div className="flex items-center space-x-4 flex-1">
                <Avatar className="h-16 w-16 border-2 border-background">
                  <AvatarImage src={match.strHomeTeamBadge} />
                  <AvatarFallback className="text-lg font-bold">
                    {match.strHomeTeam.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2
                    className={`text-2xl font-bold ${winner === "home" ? "text-green-600" : ""}`}
                  >
                    {match.strHomeTeam}
                  </h2>
                  <p className="text-muted-foreground">Home</p>
                  {winner === "home" && hasResult && (
                    <Badge variant="default" className="mt-1">
                      Winner
                    </Badge>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="text-center px-8">
                {hasResult ? (
                  <div className="space-y-2">
                    <div className="text-4xl font-bold">
                      {match.intHomeScore} - {match.intAwayScore}
                    </div>
                    <Badge variant="default">Final</Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-muted-foreground">
                      VS
                    </div>
                    {match.strTime && (
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(match.dateEvent), "MMM dd, HH:mm")}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="flex items-center space-x-4 flex-1 justify-end">
                <div className="text-right">
                  <h2
                    className={`text-2xl font-bold ${winner === "away" ? "text-green-600" : ""}`}
                  >
                    {match.strAwayTeam}
                  </h2>
                  <p className="text-muted-foreground">Away</p>
                  {winner === "away" && hasResult && (
                    <Badge variant="default" className="mt-1">
                      Winner
                    </Badge>
                  )}
                </div>
                <Avatar className="h-16 w-16 border-2 border-background">
                  <AvatarImage src={match.strAwayTeamBadge} />
                  <AvatarFallback className="text-lg font-bold">
                    {match.strAwayTeam.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex text-lg items-center gap-2">
                  <Activity className="h-4 w-3" />
                  Match Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Match Score*/}
                {hasResult && (
                  <div className="space-y-8">
                    <h4 className="font-semibold flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      Match Score
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {match.intHomeScore || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {match.strHomeTeam}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground">
                          Final Score
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {match.intAwayScore || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {match.strAwayTeam}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Match Statistics */}
                    {statistics.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <BarChart className="h-4 w-4" />
                          Match Statistics
                        </h4>
                        <div className="grid gap-4">
                          {statistics.map((stat) => {
                            const homeValue = parseInt(stat.intHome) || 0;
                            const awayValue = parseInt(stat.intAway) || 0;
                            const total = homeValue + awayValue;
                            const homePercentage =
                              total > 0 ? (homeValue / total) * 100 : 50;
                            const awayPercentage =
                              total > 0 ? (awayValue / total) * 100 : 50;

                            return (
                              <div
                                key={stat.idStatistic}
                                className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <span className="font-medium text-sm">
                                    {stat.strStat}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {total} Total
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 items-center">
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">
                                      {stat.intHome}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {match.strHomeTeam}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="w-full bg-muted rounded-full h-3 relative overflow-hidden">
                                      <div
                                        className="bg-blue-500 h-3 rounded-l-full transition-all duration-300"
                                        style={{
                                          width: `${homePercentage}%`,
                                        }}
                                      ></div>
                                      <div
                                        className="bg-red-500 h-3 rounded-r-full absolute top-0 right-0 transition-all duration-300"
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
                                    <div className="text-lg font-bold text-red-600">
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
                    <h4 className="font-semibold">About This Match</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {match.strDescriptionEN}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video/Media */}
            {match.strVideo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <VideoIcon className="h-5 w-5" />
                    Match Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={match.strVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <VideoIcon className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Watch Match Highlights</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                  </a>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Match Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Match Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium text-right">
                    {indonesianTime}
                  </span>
                </div>

                {match.strVenue && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Venue</span>
                    <span className="font-medium text-right">
                      {match.strVenue}
                    </span>
                  </div>
                )}

                {match.strLeague && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">League</span>
                    <span className="font-medium">{match.strLeague}</span>
                  </div>
                )}

                {match.strSeason && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Season</span>
                    <span className="font-medium">{match.strSeason}</span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={getStatusVariant(status)}>{status}</Badge>
                </div>

                {match.strResult && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Result</span>
                    <span className="font-medium">{match.strResult}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/teams/${match.idHomeTeam}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Users className="h-4 w-4" />
                    View {match.strHomeTeam}
                  </Button>
                </Link>

                <Link href={`/teams/${match.idAwayTeam}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Users className="h-4 w-4" />
                    View {match.strAwayTeam}
                  </Button>
                </Link>

                <Link href="/schedule" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Full Schedule
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={match.strHomeTeamBadge} />
                      <AvatarFallback className="text-xs">
                        {match.strHomeTeam.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{match.strHomeTeam}</span>
                  </div>
                  <Badge variant="outline">Home</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={match.strAwayTeamBadge} />
                      <AvatarFallback className="text-xs">
                        {match.strAwayTeam.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{match.strAwayTeam}</span>
                  </div>
                  <Badge variant="outline">Away</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
