export interface EventoResponseApi {
    fixture: FixureApi;
    league: LeagueApi;
    teams: TeamsApi;
    goals: GoalsApi;
    score: ScoreApi;
    events: EventosApi[];
    lineups: LineupsApi[];
    statistics: StatisticsApi[];
}

export interface HeadToHeadResponseApi {
    fixture: FixureApi;
    league: LeagueApi;
    teams: TeamsApi;
    goals: GoalsApi;
    score: ScoreApi;
}

export interface StandingsApiResponse {
    rank: number;
    team: TeamApi;
    points: number;
    goalsDiff: number;
    group: string;
    form: string;
    status: string;
    description: string;
    all: AllStandingsApiResponse;
    home: HomeStandingsApiResponse;
    away: AwayStandingsApiResponse;
    update: string;

}

export interface AllStandingsApiResponse {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: GoalStandingsApiResponse
}
export interface GoalStandingsApiResponse {
    for: number;
    against: number;
}
export interface HomeStandingsApiResponse {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: GoalStandingsApiResponse
}

export interface AwayStandingsApiResponse {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: GoalStandingsApiResponse
}


/**
 * Types for Sport API responses
 */
export interface FixureApi {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: PeriodsApi;
    venue: VenueApi;
    status: StatusApi;
}

export interface PeriodsApi {
    first: number;
    second: number;
}    

export interface VenueApi {
    id: number;
    name: string;
    city: string;   
}

export interface StatusApi {
    long: string;
    short: string;
    elapsed: number;
    extra: number;
}
//
// League
//
export interface LeagueApi {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
    standings: boolean;
}
//
// Team
//
export interface TeamApi {
    id: number;
    name: string;
    logo: string;
    winner: boolean | null;
    colors: ColorTeamLineupsApi;
}   

export interface TeamsApi {
    home: TeamApi;
    away: TeamApi;
}
//
// Goals
//
export interface GoalsApi {
    home: number;
    away: number;
}
//
// Score
//
export interface ScoreApi {
    halftime: GoalsApi;
    fulltime: GoalsApi;
    extratime: GoalsApi;
    penalty: GoalsApi;
}  
//
// Events
//
export interface EventosApi {
    time: TimeEventApi;
    team: TeamApi;
    player: PlayerEventApi;
    assist: AsistEventApi;
    type: string;
    detail: string;
    comments: boolean;

}  
export interface TimeEventApi {
    elapsed: number;
    extra: number;
}

export interface PlayerEventApi {
    id: number;
    name: string;
}
export interface AsistEventApi {
    id: number;
    name: string;
}
//
// Lineups
//
export interface LineupsApi {
    team: TeamApi;
    coach: CoachLineupsApi;
    formation: string;
    startXI: StartXIlineupsApi[];
    substitutes: SubstitutesLineupsApi[];
}

export interface ColorTeamLineupsApi {
    player: PlayerColorsTeamLineupsApi;
    goalkeeper: GoalkeeperColorsTeamLineupsApi;
    
} 
export interface PlayerColorsTeamLineupsApi {
    primary: string;
    number: string;
    border: string;
}
export interface GoalkeeperColorsTeamLineupsApi { 
    primary: string;
    number: string;
    border: string;
}
export interface CoachLineupsApi {
    id: number;
    name: string;
    photo: string;
}
export interface StartXIlineupsApi {
    player: PlayerXILineupsApi;
}
export interface PlayerXILineupsApi {
    id: number;
    name: string;
    number: number;
    pos: string;
    grid: string;
}
export interface SubstitutesLineupsApi {
    player: PlayerSubstitutesLineupsApi;
}
export interface PlayerSubstitutesLineupsApi {
    id: number;
    name: string;
    number: number;
    pos: string;
    grid: string;
}    
//
// Statistics
//
export interface StatisticsApi {
    team: TeamsApi;
    statistics: StatisticApi[];
}
export interface StatisticApi {
    type: string;
    value: number | null;
}
