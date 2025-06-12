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
  Sparkles,
  Zap,
  Target,
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
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30";
      case "Upcoming":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "Postponed":
        return "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-500/30";
    }
  };

  if (variant === "compact") {
    return (
      <Link href={`/matches/${match.idEvent}`}>
        <Card
          className={`bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer group ${className}`}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1 sm:space-x-3 flex-1 min-w-0">
                <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 border border-slate-500/50 group-hover:border-cyan-400/50 transition-all duration-300">
                    <AvatarImage src={match.strHomeTeamBadge} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-white">
                      {match.strHomeTeam.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium truncate text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {match.strHomeTeam}
                  </span>
                  {hasResult && showResult && (
                    <Badge className="text-xs px-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30">
                      {match.intHomeScore}
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-slate-400 px-1 font-bold">vs</div>

                <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 border border-slate-500/50 group-hover:border-purple-400/50 transition-all duration-300">
                    <AvatarImage src={match.strAwayTeamBadge} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white">
                      {match.strAwayTeam.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium truncate text-white group-hover:text-purple-300 transition-colors duration-300">
                    {match.strAwayTeam}
                  </span>
                  {hasResult && showResult && (
                    <Badge className="text-xs px-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30">
                      {match.intAwayScore}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <Badge
                  className={`text-xs ${getStatusVariant(getMatchStatus())}`}
                >
                  {getMatchStatus()}
                </Badge>
                <p className="text-xs text-slate-400 mt-1">
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
        className={`bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 hover:border-gradient-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 group ${className}`}
      >
        {match.strThumb && (
          <div className="relative h-32 sm:h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={match.strThumb}
              alt={`${match.strHomeTeam} vs ${match.strAwayTeam}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
              <h3 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {match.strHomeTeam} vs {match.strAwayTeam}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {match.strLeague}
              </p>
            </div>
            <div className="absolute top-2 right-2">
              <Badge
                className={`text-xs ${getStatusVariant(getMatchStatus())}`}
              >
                {getMatchStatus()}
              </Badge>
            </div>
          </div>
        )}

        <CardHeader className="space-y-3 sm:space-y-4 p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <Badge className={`text-xs ${getStatusVariant(getMatchStatus())}`}>
              {getMatchStatus()}
            </Badge>
            {match.strSeason && (
              <Badge className="text-xs bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-300 border-slate-500/30">
                {match.strSeason}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-center">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full">
              <div className="text-center flex-1">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border border-slate-500/50 group-hover:border-cyan-400/50 transition-all duration-300">
                    <AvatarImage src={match.strHomeTeamBadge} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-white">
                      {match.strHomeTeam.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none text-white">
                    {match.strHomeTeam}
                  </span>
                </div>
                {hasResult && showResult && (
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                    {match.intHomeScore}
                  </div>
                )}
              </div>

              <div className="text-center px-2 sm:px-4">
                <div className="text-slate-400 text-sm mb-1 font-bold">VS</div>
                {!hasResult && (
                  <div className="text-xs text-gray-500">
                    {format(matchDate, "HH:mm")}
                  </div>
                )}
              </div>

              <div className="text-center flex-1">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                  <span className="font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none order-2 sm:order-1 text-white">
                    {match.strAwayTeam}
                  </span>
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 order-1 sm:order-2 border border-slate-500/50 group-hover:border-purple-400/50 transition-all duration-300">
                    <AvatarImage src={match.strAwayTeamBadge} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white">
                      {match.strAwayTeam.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {hasResult && showResult && (
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">
                    {match.intAwayScore}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400 flex-shrink-0" />
              <span className="truncate text-slate-300">{indonesianTime}</span>
            </div>
            {match.strVenue && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 flex-shrink-0" />
                <span className="truncate text-slate-300">
                  {match.strVenue}
                </span>
              </div>
            )}
          </div>

          {match.strDescriptionEN && (
            <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
              {match.strDescriptionEN}
            </p>
          )}

          <Link href={`/matches/${match.idEvent}`}>
            <Button className="w-full text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
              <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              View Details
              <Sparkles className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
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
        className={`bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer group hover:scale-[1.02] ${className}`}
      >
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate text-slate-300 group-hover:text-yellow-300 transition-colors duration-300">
                  {match.strLeague}
                </span>
              </div>
              <Badge
                className={`text-xs flex-shrink-0 ${getStatusVariant(getMatchStatus())}`}
              >
                {getMatchStatus()}
              </Badge>
            </div>

            {/* Teams and Score */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="relative">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 border border-slate-500/50 group-hover:border-cyan-400/50 transition-all duration-300">
                    <AvatarImage src={match.strHomeTeamBadge} />
                    <AvatarFallback className="text-xs sm:text-sm bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-white">
                      {match.strHomeTeam.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-xs sm:text-sm lg:text-base truncate text-white">
                    {match.strHomeTeam}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">Home</p>
                </div>
                {hasResult && showResult && (
                  <div className="text-lg sm:text-xl font-bold flex-shrink-0 text-cyan-400">
                    {match.intHomeScore}
                  </div>
                )}
              </div>

              <div className="px-2 sm:px-4 text-center flex-shrink-0">
                <div className="text-slate-400 text-xs sm:text-sm font-bold">
                  VS
                </div>
                {!hasResult && match.strTime && (
                  <div className="text-xs text-gray-500">
                    {format(matchDate, "HH:mm")}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 justify-end min-w-0">
                {hasResult && showResult && (
                  <div className="text-lg sm:text-xl font-bold flex-shrink-0 text-purple-400">
                    {match.intAwayScore}
                  </div>
                )}
                <div className="flex-1 text-right min-w-0">
                  <p className="font-semibold group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-xs sm:text-sm lg:text-base truncate text-white">
                    {match.strAwayTeam}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">Away</p>
                </div>
                <div className="relative">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 border border-slate-500/50 group-hover:border-purple-400/50 transition-all duration-300">
                    <AvatarImage src={match.strAwayTeamBadge} />
                    <AvatarFallback className="text-xs sm:text-sm bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white">
                      {match.strAwayTeam.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-600/50" />

            {/* Match Info */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 gap-2">
              <div className="flex items-center space-x-2 min-w-0">
                <Calendar className="h-3 w-3 flex-shrink-0 text-cyan-400" />
                <span className="truncate">{indonesianTime}</span>
              </div>
              {match.strVenue && (
                <div className="flex items-center space-x-2 min-w-0 flex-1 justify-center">
                  <MapPin className="h-3 w-3 flex-shrink-0 text-purple-400" />
                  <span className="truncate">{match.strVenue}</span>
                </div>
              )}
              <div className="hidden sm:flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-cyan-300">
                <span>details</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            {/* Neon accent line */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MatchCard;
