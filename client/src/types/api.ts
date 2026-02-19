// API Response Types
export interface ApiResponse<T> {
  [key: string]: T;
}

export interface StatsResponse {
  stats: {
    activeCases: number;
    volunteers: number;
    donationsRaised: string;
    livesHelped: number;
  };
}

export interface RequestsResponse {
  requests: any[];
}

export interface VolunteersResponse {
  volunteers: any[];
}

export interface DonationsResponse {
  donations: any[];
}

export interface CampaignsResponse {
  campaigns: any[];
}

// Individual data types
export type Stats = {
  activeCases: number;
  volunteers: number;
  donationsRaised: string;
  livesHelped: number;
};

export type Request = any;
export type Volunteer = any;
export type Donation = any;
export type Campaign = any;
