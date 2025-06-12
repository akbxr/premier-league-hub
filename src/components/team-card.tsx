"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  Heart,
  HeartOff,
  Users,
  Calendar,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import { Team } from "@/types";
import { useFavorites } from "@/hooks/use-favorites";
import { useState } from "react";
import { toast } from "sonner";

interface TeamCardProps {
  team: Team;
  showFavoriteButton?: boolean;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  showFavoriteButton = true,
  variant = "default",
  className,
}) => {
  const { isFavorite: isTeamFavorite, toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  const isFavorite = isTeamFavorite(team.idTeam);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <Link href={`/teams/${team.idTeam}`}>
        <Card
          className={`bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/20 group cursor-pointer ${className}`}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 border-2 border-slate-500/50 group-hover:border-cyan-400/50 transition-all duration-300">
                  <AvatarImage
                    src={team.strBadge}
                    alt={`${team.strTeam} logo`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-xs sm:text-sm text-white font-bold">
                    {team.strTeam.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm truncate text-white group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {team.strTeam}
                </h3>
                {team.strTeamShort && (
                  <p className="text-xs text-slate-400 truncate">
                    {team.strTeamShort}
                  </p>
                )}
              </div>
              {showFavoriteButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteToggle}
                  disabled={isLoading}
                  className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 mt-0.5 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-300"
                >
                  {isFavorite ? (
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-pink-500 text-pink-500" />
                  ) : (
                    <HeartOff className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "detailed") {
    return (
      <Card
        className={`bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 group ${className}`}
      >
        <CardHeader className="relative p-4 sm:p-6">
          {team.strTeamBanner && (
            <div className="absolute inset-0 rounded-t-lg overflow-hidden">
              <Image
                src={team.strTeamBanner}
                alt={`${team.strTeam} banner`}
                fill
                className="object-cover opacity-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
            </div>
          )}
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-slate-500/50 group-hover:border-purple-400/50 transition-all duration-300">
                <AvatarImage src={team.strBadge} alt={`${team.strTeam} logo`} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-lg font-bold text-white">
                  {team.strTeam.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {team.strTeam}
              </h3>
              {team.strAlternate && (
                <p className="text-sm text-slate-400">{team.strAlternate}</p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                {team.strLeague && (
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                    {team.strLeague}
                  </Badge>
                )}
                {team.intFormedYear && (
                  <Badge
                    variant="outline"
                    className="border-slate-500/50 text-slate-300 text-xs"
                  >
                    Est. {team.intFormedYear}
                  </Badge>
                )}
              </div>
            </div>
            {showFavoriteButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className="absolute top-2 right-2 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-300"
              >
                {isFavorite ? (
                  <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
                ) : (
                  <HeartOff className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          {team.strDescriptionEN && (
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3">
              {team.strDescriptionEN}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
            {team.strStadium && (
              <div className="flex items-center space-x-2 min-w-0">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400 flex-shrink-0" />
                <span className="truncate text-gray-300">
                  {team.strStadium}
                </span>
              </div>
            )}
            {team.strManager && (
              <div className="flex items-center space-x-2 min-w-0">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 flex-shrink-0" />
                <span className="truncate text-gray-300">
                  {team.strManager}
                </span>
              </div>
            )}
            {team.intStadiumCapacity && (
              <div className="flex items-center space-x-2 min-w-0">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-pink-400 flex-shrink-0" />
                <span className="truncate text-gray-300">
                  {parseInt(team.intStadiumCapacity).toLocaleString()} capacity
                </span>
              </div>
            )}
            {team.strCountry && (
              <div className="flex items-center space-x-2 min-w-0">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                <span className="truncate text-gray-300">
                  {team.strCountry}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 sm:p-6">
          <Link href={`/teams/${team.idTeam}`} className="w-full">
            <Button className="w-full text-sm bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
              <Sparkles className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Default variant
  return (
    <Link href={`/teams/${team.idTeam}`}>
      <Card
        className={`bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer group hover:scale-105 ${className}`}
      >
        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 border-2 border-slate-500/50 group-hover:border-blue-400/50 transition-all duration-300">
                <AvatarImage src={team.strBadge} alt={`${team.strTeam} logo`} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-xs sm:text-sm text-white font-bold">
                  {team.strTeam.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-sm sm:text-base truncate text-white">
                {team.strTeam}
              </h3>
              {team.strTeamShort && (
                <p className="text-xs sm:text-sm text-slate-400 truncate">
                  {team.strTeamShort}
                </p>
              )}
            </div>
            {showFavoriteButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className="opacity-100 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 mt-0.5 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10"
              >
                {isFavorite ? (
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-pink-500 text-pink-500" />
                ) : (
                  <HeartOff className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 p-3 sm:p-6">
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
            {team.strLeague && (
              <span className="truncate">{team.strLeague}</span>
            )}
            {team.intFormedYear && (
              <span className="flex-shrink-0">Est. {team.intFormedYear}</span>
            )}
          </div>
          {team.strStadium && (
            <div className="flex items-center space-x-1 mt-2 text-xs sm:text-sm text-slate-400 min-w-0">
              <MapPin className="h-3 w-3 flex-shrink-0 text-cyan-400" />
              <span className="truncate">{team.strStadium}</span>
            </div>
          )}
          <div className="hidden sm:flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-3 text-cyan-200">
            <span className="truncate text-sm font-light mr-1">details</span>
            <ChevronRight className="h-4 w-4" />
          </div>

          {/* Neon accent line */}
          <div className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TeamCard;
