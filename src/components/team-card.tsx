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
import { Heart, HeartOff, Users, Calendar, MapPin } from "lucide-react";
import { Team } from "@/types";
import {
  addToFavorites,
  removeFromFavorites,
  isTeamInFavorites,
} from "@/lib/favorites";
import { useState, useEffect } from "react";
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(isTeamInFavorites(team.idTeam));
  }, [team.idTeam]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <Link href={`/teams/${team.idTeam}`}>
        <Card
          className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                <AvatarImage src={team.strBadge} alt={`${team.strTeam} logo`} />
                <AvatarFallback className="bg-primary/10 text-xs sm:text-sm">
                  {team.strTeam.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm truncate">
                  {team.strTeam}
                </h3>
                {team.strTeamShort && (
                  <p className="text-xs text-muted-foreground truncate">
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
                  className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 mt-0.5"
                >
                  {isFavorite ? (
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-red-500 text-red-500" />
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
        className={`hover:shadow-lg transition-all duration-300 ${className}`}
      >
        <CardHeader className="relative">
          {team.strTeamBanner && (
            <div className="absolute inset-0 rounded-t-lg overflow-hidden">
              <Image
                src={team.strTeamBanner}
                alt={`${team.strTeam} banner`}
                fill
                className="object-cover opacity-20"
              />
            </div>
          )}
          <div className="relative flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-background">
              <AvatarImage src={team.strBadge} alt={`${team.strTeam} logo`} />
              <AvatarFallback className="bg-primary/10 text-lg font-bold">
                {team.strTeam.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{team.strTeam}</h3>
              {team.strAlternate && (
                <p className="text-sm text-muted-foreground">
                  {team.strAlternate}
                </p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                {team.strLeague && (
                  <Badge variant="secondary">{team.strLeague}</Badge>
                )}
                {team.intFormedYear && (
                  <Badge variant="outline">Est. {team.intFormedYear}</Badge>
                )}
              </div>
            </div>
            {showFavoriteButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className="absolute top-2 right-2"
              >
                {isFavorite ? (
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                ) : (
                  <HeartOff className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          {team.strDescriptionEN && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
              {team.strDescriptionEN}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
            {team.strStadium && (
              <div className="flex items-center space-x-2 min-w-0">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{team.strStadium}</span>
              </div>
            )}
            {team.strManager && (
              <div className="flex items-center space-x-2 min-w-0">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{team.strManager}</span>
              </div>
            )}
            {team.intStadiumCapacity && (
              <div className="flex items-center space-x-2 min-w-0">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {parseInt(team.intStadiumCapacity).toLocaleString()} capacity
                </span>
              </div>
            )}
            {team.strCountry && (
              <div className="flex items-center space-x-2 min-w-0">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{team.strCountry}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 sm:p-6">
          <Link href={`/teams/${team.idTeam}`} className="w-full">
            <Button className="w-full text-sm">View Details</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Default variant
  return (
    <Link href={`/teams/${team.idTeam}`}>
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer group ${className}`}
      >
        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarImage src={team.strBadge} alt={`${team.strTeam} logo`} />
              <AvatarFallback className="bg-primary/10 text-xs sm:text-sm">
                {team.strTeam.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                {team.strTeam}
              </h3>
              {team.strTeamShort && (
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
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
                className="opacity-100 transition-opacity h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 mt-0.5"
              >
                {isFavorite ? (
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-red-500 text-red-500" />
                ) : (
                  <HeartOff className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 p-3 sm:p-6">
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
            {team.strLeague && (
              <span className="truncate">{team.strLeague}</span>
            )}
            {team.intFormedYear && (
              <span className="flex-shrink-0">Est. {team.intFormedYear}</span>
            )}
          </div>
          {team.strStadium && (
            <div className="flex items-center space-x-1 mt-2 text-xs sm:text-sm text-muted-foreground min-w-0">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{team.strStadium}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default TeamCard;
