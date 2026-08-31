export type Role = 'USER' | 'ADMIN';

export type ChampionStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';

export type SocialPlatform =
  | 'TWITCH'
  | 'X'
  | 'YOUTUBE'
  | 'INSTAGRAM'
  | 'TIKTOK'
  | 'KICK';

export interface User {
  id: number;
  email: string;
  displayName: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CollaboratorSummary {
  id: number;
  name: string;
  photoUrl: string | null;
}

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

export interface Champion {
  id: number;
  name: string;
  championKey: string | null;
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

export interface ChampionPayload {
  name: string;
  championKey: string | null;
  photoUrl: string | null;
  winRatio: number | null;
  wins: number;
  losses: number;
  notes: string | null;
  orderIndex: number;
  status: ChampionStatus;
  collaborator: { id: number } | null;
}

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export const CHAMPION_STATUS_LABEL: Record<ChampionStatus, string> = {
  COMPLETED: 'Completado',
  IN_PROGRESS: 'En progreso',
  PENDING: 'Pendiente',
};