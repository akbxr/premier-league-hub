export interface Team {
  idTeam: string;
  strTeam: string;
  strAlternate?: string;
  strTeamAlternate?: string;
  strTeamShort?: string;
  intFormedYear: string;
  strSport: string;
  strBadge?: string;
  strBanner?: string;
  strLeague: string;
  strDivision?: string;
  strManager?: string;
  strStadium?: string;
  strKeywords?: string;
  strRSS?: string;
  strStadiumThumb?: string;
  strStadiumDescription?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  strDescriptionEN?: string;
  strDescriptionDE?: string;
  strDescriptionFR?: string;
  strDescriptionCN?: string;
  strDescriptionIT?: string;
  strDescriptionJP?: string;
  strGender?: string;
  strCountry?: string;
  strTeamBadge?: string;
  strTeamJersey?: string;
  strTeamLogo?: string;
  strTeamFanart1?: string;
  strTeamFanart2?: string;
  strTeamFanart3?: string;
  strTeamFanart4?: string;
  strTeamBanner?: string;
  strYoutube?: string;
  strLocked?: string;
}

export interface Event {
  idEvent: string;
  idSoccerXML?: string;
  idAPIfootball?: string;
  strEvent: string;
  strEventAlternate?: string;
  strFilename?: string;
  strSport: string;
  idLeague: string;
  strLeague: string;
  strSeason: string;
  strDescriptionEN?: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore?: string;
  intAwayScore?: string;
  intRound?: string;
  strHomeGoalDetails?: string;
  strHomeRedCards?: string;
  strHomeYellowCards?: string;
  strHomeLineupGoalkeeper?: string;
  strHomeLineupDefense?: string;
  strHomeLineupMidfield?: string;
  strHomeLineupForward?: string;
  strHomeLineupSubstitutes?: string;
  strHomeFormation?: string;
  strAwayRedCards?: string;
  strAwayYellowCards?: string;
  strAwayGoalDetails?: string;
  strAwayLineupGoalkeeper?: string;
  strAwayLineupDefense?: string;
  strAwayLineupMidfield?: string;
  strAwayLineupForward?: string;
  strAwayLineupSubstitutes?: string;
  strAwayFormation?: string;
  intHomeShots?: string;
  intAwayShots?: string;
  dateEvent: string;
  dateEventLocal?: string;
  strDate?: string;
  strTime?: string;
  strTimeLocal?: string;
  strTVStation?: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strResult?: string;
  strVenue?: string;
  strCountry?: string;
  strCity?: string;
  strPoster?: string;
  strBadge?: string;
  strLogo?: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  strSquare?: string;
  strFanart?: string;
  strThumb?: string;
  strBanner?: string;
  strMap?: string;
  strTweet1?: string;
  strTweet2?: string;
  strTweet3?: string;
  strVideo?: string;
  strStatus?: string;
  strPostponed?: string;
  strLocked?: string;
}

export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
  intDivision?: string;
  idCup?: string;
  strCurrentSeason?: string;
  intFormedYear?: string;
  dateFirstEvent?: string;
  strGender?: string;
  strCountry?: string;
  strWebsite?: string;
  strFacebook?: string;
  strInstagram?: string;
  strTwitter?: string;
  strYoutube?: string;
  strRSS?: string;
  strDescriptionEN?: string;
  strDescriptionDE?: string;
  strDescriptionFR?: string;
  strDescriptionIT?: string;
  strDescriptionCN?: string;
  strDescriptionJP?: string;
  strTvRights?: string;
  strFanart1?: string;
  strFanart2?: string;
  strFanart3?: string;
  strFanart4?: string;
  strBanner?: string;
  strBadge?: string;
  strLogo?: string;
  strPoster?: string;
  strTrophy?: string;
  strNaming?: string;
  strComplete?: string;
  strLocked?: string;
}

export interface TeamStanding {
  idStanding?: string;
  intRank: number;
  idTeam: string;
  strTeam: string;
  strBadge?: string;
  strLogo?: string;
  strTeamBadge?: string;
  idLeague: string;
  strLeague: string;
  strSeason: string;
  strForm?: string;
  strDescription?: string;
  intPlayed: number;
  intWin: number;
  intLoss: number;
  intDraw?: number;
  intGoalsFor?: number;
  intGoalsAgainst?: number;
  intGoalDifference?: number;
  intPoints: number;
  dateUpdated?: string;
}

export interface EventDetails {
  idEvent: string;
  strEvent: string;
  strSport: string;
  strStat?: string;
  intHome?: string;
  intAway?: string;
  idLeague: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  strDescriptionEN?: string;
  strLeague: string;
  strSeason: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore?: string;
  intAwayScore?: string;
  strHomeGoalDetails?: string;
  strAwayGoalDetails?: string;
  dateEvent: string;
  strTime?: string;
  strTimeLocal?: string;
  strBadge?: string;
  strLogo?: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strResult?: string;
  strVenue?: string;
  strThumb?: string;
  strVideo?: string;
  strStatus?: string;
}

export interface EventStatistic {
  idStatistic: string;
  idEvent: string;
  idApiFootball?: string;
  strEvent: string;
  strStat: string;
  intHome: string;
  intAway: string;
}

export interface ApiResponse<T> {
  teams?: T[];
  events?: T[];
  leagues?: T[];
  table?: T[];
  event?: T[];
  results?: T[];
  eventstats?: T[];
  player?: T[];
}

export interface Player {
  idPlayer: string;
  strPlayer: string;
  strPlayerAlternate?: string;
  strNationality?: string;
  strPosition?: string;
  strNumber?: string;
  strTeam?: string;
  idTeam?: string;
  strHeight?: string;
  strWeight?: string;
  strDescriptionEN?: string;
  strGender?: string;
  strSide?: string;
  strPosition2?: string;
  strCollege?: string;
  strFacebook?: string;
  strWebsite?: string;
  strTwitter?: string;
  strInstagram?: string;
  strYoutube?: string;
  strCreativeCommons?: string;
  strLocked?: string;
  dateBorn?: string;
  strBirthLocation?: string;
  strThumb?: string;
  strCutout?: string;
  strRender?: string;
  strBanner?: string;
  strFanart1?: string;
  strFanart2?: string;
  strFanart3?: string;
  strFanart4?: string;
  intLoved?: string;
  strContract?: string;
  strAgent?: string;
  strSigning?: string;
  strWage?: string;
  strOutfitter?: string;
  strKit?: string;
  strJersey?: string;
  strSport: string;
}

export interface FavoriteTeam {
  idTeam: string;
  strBadge?: string;
  strLogo?: string;
  strTeam: string;
  strTeamBadge?: string;
  dateAdded: string;
}

export interface LeagueStandings {
  idLeague: string;
  strLeague: string;
  strSeason: string;
  table: TeamStanding[];
}

export const PREMIER_LEAGUE_ID = "4328";
export const LEAGUE_NAME = "English_Primer_League";
