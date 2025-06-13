"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  MapPin,
  Calendar,
  Ruler,
  Weight,
  Star,
  Shirt,
  Flag,
} from "lucide-react";
import { Player } from "@/types";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  player: Player;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  variant = "default",
  className,
}) => {
  // Function to calculate age from birth date
  const calculateAge = (birthDate: string | undefined) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Get position color
  const getPositionColor = (position: string | undefined) => {
    if (!position) return "bg-gray-500/20 text-gray-300";
    const pos = position.toLowerCase();
    if (pos.includes("goalkeeper") || pos.includes("gk")) {
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    }
    if (
      pos.includes("defender") ||
      pos.includes("defence") ||
      pos.includes("cb") ||
      pos.includes("lb") ||
      pos.includes("rb")
    ) {
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
    if (
      pos.includes("midfielder") ||
      pos.includes("midfield") ||
      pos.includes("cm") ||
      pos.includes("dm") ||
      pos.includes("am")
    ) {
      return "bg-green-500/20 text-green-300 border-green-500/30";
    }
    if (
      pos.includes("forward") ||
      pos.includes("striker") ||
      pos.includes("winger") ||
      pos.includes("lw") ||
      pos.includes("rw")
    ) {
      return "bg-red-500/20 text-red-300 border-red-500/30";
    }
    return "bg-purple-500/20 text-purple-300 border-purple-500/30";
  };

  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer",
          className,
        )}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-slate-500/50 group-hover:border-cyan-400/50 transition-all duration-300">
                <AvatarImage
                  src={player.strCutout || player.strThumb}
                  alt={player.strPlayer}
                />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-white font-bold text-sm">
                  {player.strPlayer
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {player.strNumber && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-cyan-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {player.strNumber}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate text-white group-hover:text-cyan-400 transition-colors">
                {player.strPlayer}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {player.strPosition && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs px-2 py-0.5",
                      getPositionColor(player.strPosition),
                    )}
                  >
                    {player.strPosition}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "detailed") {
    const age = calculateAge(player.dateBorn);

    return (
      <Card
        className={cn(
          "bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 group",
          className,
        )}
      >
        <CardHeader className="relative p-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-slate-500/50 group-hover:border-purple-400/50 transition-all duration-300">
                <AvatarImage
                  src={player.strThumb || player.strCutout}
                  alt={player.strPlayer}
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-xl font-bold text-white">
                  {player.strPlayer
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {player.strNumber && (
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-purple-500 text-white font-bold rounded-full flex items-center justify-center shadow-lg">
                  {player.strNumber}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {player.strPlayer}
              </h3>
              {player.strPlayerAlternate && (
                <p className="text-sm text-slate-400 mt-1">
                  {player.strPlayerAlternate}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {player.strPosition && (
                  <Badge
                    className={cn(
                      "text-sm",
                      getPositionColor(player.strPosition),
                    )}
                  >
                    {player.strPosition}
                  </Badge>
                )}
                {player.strNationality && (
                  <Badge
                    variant="outline"
                    className="border-slate-500/50 text-slate-300"
                  >
                    {player.strNationality}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-6 pt-0">
          {player.strDescriptionEN && (
            <p className="text-sm text-slate-300 line-clamp-3">
              {player.strDescriptionEN}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {age && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span className="text-gray-300">{age} years old</span>
              </div>
            )}
            {player.strBirthLocation && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="truncate text-gray-300">
                  {player.strBirthLocation}
                </span>
              </div>
            )}
            {player.strHeight && (
              <div className="flex items-center space-x-2">
                <Ruler className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">{player.strHeight}</span>
              </div>
            )}
            {player.strWeight && (
              <div className="flex items-center space-x-2">
                <Weight className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">{player.strWeight}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={cn(
        "bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer group",
        className,
      )}
    >
      <CardHeader className="pb-3 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-14 w-14 border-2 border-slate-500/50 group-hover:border-blue-400/50 transition-all duration-300">
              <AvatarImage
                src={player.strThumb || player.strCutout}
                alt={player.strPlayer}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-white font-bold">
                {player.strPlayer
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {player.strNumber && (
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {player.strNumber}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-white truncate">
              {player.strPlayer}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {player.strPosition && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    getPositionColor(player.strPosition),
                  )}
                >
                  {player.strPosition}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 p-4">
        <div className="space-y-2">
          {player.strNationality && (
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Flag className="h-3 w-3 text-cyan-400" />
              <span className="truncate">{player.strNationality}</span>
            </div>
          )}
          {calculateAge(player.dateBorn) && (
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Calendar className="h-3 w-3 text-blue-400" />
              <span>{calculateAge(player.dateBorn)} years old</span>
            </div>
          )}
          {(player.strHeight || player.strWeight) && (
            <div className="flex items-center justify-between text-sm text-slate-400">
              {player.strHeight && (
                <div className="flex items-center space-x-1">
                  <Ruler className="h-3 w-3 text-green-400" />
                  <span>{player.strHeight}</span>
                </div>
              )}
              {player.strWeight && (
                <div className="flex items-center space-x-1">
                  <Weight className="h-3 w-3 text-purple-400" />
                  <span>{player.strWeight}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Neon accent line */}
        <div className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
