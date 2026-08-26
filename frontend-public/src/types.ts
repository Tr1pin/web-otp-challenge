export interface CollaboratorSummary {
  id: number;
  name: string;
  photoUrl: string | null;
}

export type SocialPlatform = 'TWITCH' | 'X' | 'YOUTUBE' | 'INSTAGRAM' | 'TIKTOK' | 'KICK';

export interface CollaboratorSocial {
  id: number;
  platform: SocialPlatform;
  url: string;
}

export interface Collaborator {
  id: number;
  name: string;
  photoUrl: string | null;
  bio: string | null;
  socials: CollaboratorSocial[];
}

export type ChampionStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';

export interface Champion {
  id: number;
  name: string;
  championKey: string;
  photoUrl: string | null;
  winRatio: number | null;
  wins: number;
  losses: number;
  notes: string | null;
  orderIndex: number;
  status: ChampionStatus;
  voteCount: number;
  collaborator: CollaboratorSummary | null;
}

export interface Video {
  id: number;
  youtubeId: string;
  title: string;
  orderIndex: number;
  thumbnailUrl: string | null;
  watchUrl: string | null;
}

export interface User {
  id: number;
  email: string;
  displayName: string;
  role: string;
}

export interface VoteButtonProps {
  championId: number;
  championName: string;
  initialCount: number;
  winRatio: number;
}

export interface MyVote {
  championId: number | null;
  championName: string | null;
}