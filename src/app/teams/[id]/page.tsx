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
  Heart,
  HeartOff,
  MapPin,
  Calendar,
  Users,
  Trophy,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowLeft,
  ExternalLink,
  Clock,
  Building,
} from "lucide-react";
import { Team, Event } from "@/types";
import {
  getTeamDetails,
  getTeamPreviousMatches,
  getTeamNextMatches,
} from "@/lib/api";
import {
  addToFavorites,
  removeFromFavorites,
  isTeamInFavorites,
} from "@/lib/favorites";
import { toast } from "sonner";
import MatchCard from "@/components/match-card";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [previousMatches, setPreviousMatches] = useState<Event[]>([]);
  const [nextMatches, setNextMatches] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

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

        // Check if team is in favorites
        if (teamData) {
          setIsFavorite(isTeamInFavorites(teamId));
        }
      } catch (error) {
        console.error("Error loading team data:", error);
        toast.error("Failed to load team data");
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, [teamId]);

  const handleFavoriteToggle = async () => {
    if (!team) return;

    setIsTogglingFavorite(true);

    try {
      if (isFavorite) {
        const success = removeFromFavorites(team.idTeam);
        if (success) {
          setIsFavorite(false);
          toast.success(`${team.strTeam} removed from favorites`);
        } else {
          toast.error("Failed to remove from favorites");
        }
      } else {
        const success = addToFavorites(team);
        if (success) {
          setIsFavorite(true);
          toast.success(`${team.strTeam} added to favorites`);
        } else {
          toast.error("Failed to add to favorites");
        }
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
      color: "text-blue-700",
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
      color: "text-pink-600",
    },
    {
      name: "YouTube",
      url: team?.strYoutube,
      icon: Youtube,
      color: "text-red-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </div>

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
              <Button>
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Navigation */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/teams" className="hover:text-primary">
            Teams
          </Link>
          <span>/</span>
          <span className="text-foreground">{team.strTeam}</span>
        </div>

        {/* Team Header */}
        <div className="relative">
          {/* Banner Background */}
          {team.strBanner && (
            <div className="absolute inset-0 h-48 rounded-lg overflow-hidden">
              <Image
                src={team.strBanner}
                alt={`${team.strTeam} banner`}
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20" />
            </div>
          )}

          <div className="relative pt-8 pb-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-4 m-4 border-background shadow-lg">
                <AvatarImage src={team.strBadge} alt={`${team.strTeam} logo`} />
                <AvatarFallback className="text-2xl font-bold">
                  {team.strTeam.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-4xl font-bold">{team.strTeam}</h1>
                  {team.strTeamAlternate && (
                    <p className="text-lg text-muted-foreground">
                      {team.strTeamAlternate}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {team.strLeague && (
                    <Badge variant="default">{team.strLeague}</Badge>
                  )}
                  {team.strDivision && (
                    <Badge variant="secondary">{team.strDivision}</Badge>
                  )}
                  {team.intFormedYear && (
                    <Badge variant="outline">Est. {team.intFormedYear}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleFavoriteToggle}
                    disabled={isTogglingFavorite}
                    variant={isFavorite ? "default" : "outline"}
                    className="gap-2"
                  >
                    {isFavorite ? (
                      <Heart className="h-4 w-4 fill-current" />
                    ) : (
                      <HeartOff className="h-4 w-4" />
                    )}
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>

                  <Link href="/teams">
                    <Button variant="ghost" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Teams
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {team.strDescriptionEN && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    About {team.strTeam}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {team.strDescriptionEN}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Matches Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="previous" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="previous" className="gap-2">
                      <Clock className="h-4 w-4" />
                      Previous Matches
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Upcoming
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="previous" className="space-y-4 mt-6">
                    {previousMatches.length > 0 ? (
                      <div className="space-y-4">
                        {previousMatches.map((match) => (
                          <MatchCard
                            key={match.idEvent}
                            match={match}
                            variant="compact"
                            showResult={true}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No previous matches available
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="upcoming" className="space-y-4 mt-6">
                    {nextMatches.length > 0 ? (
                      <div className="space-y-4">
                        {nextMatches.map((match) => (
                          <MatchCard
                            key={match.idEvent}
                            match={match}
                            variant="compact"
                            showResult={false}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No upcoming matches scheduled
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Team Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Team Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.strManager && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Manager</span>
                    <span className="font-medium">{team.strManager}</span>
                  </div>
                )}

                {team.intFormedYear && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Founded</span>
                    <span className="font-medium">{team.intFormedYear}</span>
                  </div>
                )}

                {team.strLeague && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">League</span>
                    <span className="font-medium">{team.strLeague}</span>
                  </div>
                )}

                {team.strDivision && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Division</span>
                    <span className="font-medium">{team.strDivision}</span>
                  </div>
                )}

                {team.strCountry && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-medium">{team.strCountry}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stadium Info */}
            {(team.strStadium ||
              team.strStadiumLocation ||
              team.intStadiumCapacity) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Stadium
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {team.strStadium && (
                    <div>
                      <h4 className="font-semibold">{team.strStadium}</h4>
                    </div>
                  )}

                  {team.strStadiumLocation && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{team.strStadiumLocation}</span>
                    </div>
                  )}

                  {team.intStadiumCapacity && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">
                        {parseInt(team.intStadiumCapacity).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {team.strStadiumDescription && (
                    <p className="text-sm text-muted-foreground">
                      {team.strStadiumDescription}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Follow {team.strTeam}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks
                    .filter((link) => link.url)
                    .map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.name}
                          href={
                            link.url?.startsWith("http")
                              ? link.url
                              : `https://${link.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                        >
                          <Icon className={`h-4 w-4 ${link.color}`} />
                          <span className="text-sm font-medium">
                            {link.name}
                          </span>
                          <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                        </a>
                      );
                    })}
                </div>

                {socialLinks.filter((link) => link.url).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No social media links available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
