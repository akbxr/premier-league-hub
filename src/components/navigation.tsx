"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Calendar,
  Users,
  Star,
  Home,
  Menu,
  X,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
      description: "Premier League Overview",
      gradient: "from-cyan-400 to-blue-500",
      hoverGradient: "hover:from-cyan-500 hover:to-blue-600",
    },
    {
      title: "Teams",
      href: "/teams",
      icon: Users,
      description: "All Premier League Teams",
      gradient: "from-purple-400 to-pink-500",
      hoverGradient: "hover:from-purple-500 hover:to-pink-600",
    },
    {
      title: "Schedule",
      href: "/schedule",
      icon: Calendar,
      description: "Match Schedule",
      gradient: "from-green-400 to-emerald-500",
      hoverGradient: "hover:from-green-500 hover:to-emerald-600",
    },
    {
      title: "Standings",
      href: "/standings",
      icon: Trophy,
      description: "League Standings",
      gradient: "from-yellow-400 to-orange-500",
      hoverGradient: "hover:from-yellow-500 hover:to-orange-600",
    },
    {
      title: "Favorites",
      href: "/favorites",
      icon: Star,
      description: "Your Favorite Teams",
      gradient: "from-pink-400 to-red-500",
      hoverGradient: "hover:from-pink-500 hover:to-red-600",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-800/60",
        className,
      )}
    >
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 min-w-0 group">
          <div className="relative">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white flex-shrink-0 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <Trophy className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </div>
          <span className="text-sm sm:text-lg lg:text-xl font-bold truncate bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-pink-400 transition-all duration-300">
            <span className="sm:hidden">PL Hub</span>
            <span className="hidden sm:inline">Premier League Hub</span>
          </span>
          <Sparkles className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-1 pb-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} passHref>
                    <NavigationMenuLink
                      className={cn(
                        "group relative inline-flex h-10 w-max items-center justify-center rounded-xl px-4 pb-3 text-sm font-medium transition-all duration-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        active
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                          : "text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 backdrop-blur-sm",
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.title}
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-xl blur-sm"></div>
                      )}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Tablet Navigation (md-lg) */}
        <div className="hidden md:flex lg:hidden">
          <div className="flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10 rounded-xl transition-all duration-300",
                      active
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl`
                        : "text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50",
                    )}
                    title={item.title}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 sm:h-10 sm:w-10 text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 rounded-xl transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-700/50 bg-slate-800/95 backdrop-blur-xl md:hidden shadow-2xl">
          <div className="container py-3 sm:py-4 px-3 sm:px-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group relative flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 border",
                      active
                        ? `bg-gradient-to-r ${item.gradient} text-white border-transparent shadow-lg`
                        : "text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/50 hover:border-slate-500/50 backdrop-blur-sm",
                    )}
                  >
                    <div className="relative">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {active && (
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-semibold">{item.title}</span>
                      <span
                        className={cn(
                          "text-xs truncate transition-colors duration-300",
                          active
                            ? "text-white/80"
                            : "text-slate-400 group-hover:text-slate-300",
                        )}
                      >
                        {item.description}
                      </span>
                    </div>
                    {active && (
                      <div className="flex-shrink-0">
                        <Zap className="h-4 w-4 text-white/80" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Navigation Footer */}
            <div className="mt-4 pt-3 border-t border-slate-700/50">
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                <Sparkles className="h-3 w-3" />
                <span>Premier League Hub</span>
                <div className="h-1 w-1 bg-slate-500 rounded-full"></div>
                <span>Modern Design</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
