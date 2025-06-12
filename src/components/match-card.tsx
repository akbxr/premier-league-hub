"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Event } from "@/types";
import { convertToIndonesianTime } from "@/lib/api";
import { format } from "date-fns";

interface MatchCardProps {
  match: Event;
  variant?: "default" | "compact" | "detailed";
  showResult?: boolean;
  className?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  variant = "default",
  showResult = true,
  className,
}) => {
  const hasResult = match.intHomeScore !== null && match.intAwayScore !== null;
  const matchDate = new Date(match.dateEvent);
  const isFinished = hasResult || match.strStatus === "Match Finished";
  const indonesianTime = convertToIndonesianTime(
    match.dateEvent,
    match.strTime,
  );

  const getMatchStatus = () => {
    if (match.strStatus === "Match Finished" || hasResult) {
      return "Finished";
    }
    if (match.strStatus === "Not Started") {
      return "Upcoming";
    }
    if (match.strPostponed === "yes") {
      return "Postponed";
    }
    return match.strStatus || "Scheduled";
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Finished":
        return "default";
      case "Upcoming":
        return "secondary";
      case "Postponed":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (variant === "compact") {
    return (
      <Link href={`/matches/${match.idEvent}`}>
        <Card
          className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}
        >
          <CardContent className="px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={match.strHomeTeamBadge} />
                    <AvatarFallback className="text-xs">
                      {match.strHomeTeam.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">
                    {match.strHomeTeam}
                  </span>
                  {hasResult && showResult && (
                    <Badge variant="outline" className="text-xs">
                      {match.intHomeScore}
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">vs</div>

                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={match.strAwayTeamBadge} />
                    <AvatarFallback className="text-xs">
                      {match.strAwayTeam.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">
                    {match.strAwayTeam}
                  </span>
                  {hasResult && showResult && (
                    <Badge variant="outline" className="text-xs">
                      {match.intAwayScore}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-right">
                <Badge
                  variant={getStatusVariant(getMatchStatus())}
                  className="text-xs"
                >
                  {getMatchStatus()}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(matchDate, "MMM dd")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "detailed") {
    return (
      <Card
        className={`hover:shadow-lg transition-all duration-300 ${className}`}
      >
        {match.strThumb && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={match.strThumb}
              alt={`${match.strHomeTeam} vs ${match.strAwayTeam}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold">
                {match.strHomeTeam} vs {match.strAwayTeam}
              </h3>
              <p className="text-sm opacity-90">{match.strLeague}</p>
            </div>
          </div>
        )}

        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant={getStatusVariant(getMatchStatus())}>
              {getMatchStatus()}
            </Badge>
            {match.strSeason && (
              <Badge variant="outline">{match.strSeason}</Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={match.strHomeTeamBadge} />
                    <AvatarFallback className="text-xs">
                      {match.strHomeTeam.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{match.strHomeTeam}</span>
                </div>
                {hasResult && showResult && (
                  <div className="text-2xl font-bold">{match.intHomeScore}</div>
                )}
              </div>

              <div className="text-center px-4">
                <div className="text-muted-foreground text-sm mb-1">VS</div>
                {!hasResult && (
                  <div className="text-xs text-muted-foreground">
                    {format(matchDate, "HH:mm")}
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold">{match.strAwayTeam}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={match.strAwayTeamBadge} />
                    <AvatarFallback className="text-xs">
                      {match.strAwayTeam.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {hasResult && showResult && (
                  <div className="text-2xl font-bold">{match.intAwayScore}</div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{indonesianTime}</span>
            </div>
            {match.strVenue && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{match.strVenue}</span>
              </div>
            )}
          </div>

          {match.strDescriptionEN && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {match.strDescriptionEN}
            </p>
          )}

          <Link href={`/matches/${match.idEvent}`}>
            <Button className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Link href={`/matches/${match.idEvent}`}>
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer group ${className}`}
      >
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{match.strLeague}</span>
              </div>
              <Badge variant={getStatusVariant(getMatchStatus())}>
                {getMatchStatus()}
              </Badge>
            </div>

            {/* Teams and Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={match.strHomeTeamBadge} />
                  <AvatarFallback className="text-sm">
                    {match.strHomeTeam.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {match.strHomeTeam}
                  </p>
                  <p className="text-sm text-muted-foreground">Home</p>
                </div>
                {hasResult && showResult && (
                  <div className="text-xl font-bold">{match.intHomeScore}</div>
                )}
              </div>

              <div className="px-4 text-center">
                <div className="text-muted-foreground text-sm">VS</div>
                {!hasResult && match.strTime && (
                  <div className="text-xs text-muted-foreground">
                    {format(matchDate, "HH:mm")}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 flex-1 justify-end">
                {hasResult && showResult && (
                  <div className="text-xl font-bold">{match.intAwayScore}</div>
                )}
                <div className="flex-1 text-right">
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {match.strAwayTeam}
                  </p>
                  <p className="text-sm text-muted-foreground">Away</p>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={match.strAwayTeamBadge} />
                  <AvatarFallback className="text-sm">
                    {match.strAwayTeam.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <Separator />

            {/* Match Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3" />
                <span>{indonesianTime}</span>
              </div>
              {match.strVenue && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{match.strVenue}</span>
                </div>
              )}
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MatchCard;
