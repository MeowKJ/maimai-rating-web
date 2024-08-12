import {
  FCType,
  FSType,
  LevelIndex,
  RateType,
  SongType,
  ApiType,
} from "./enum";

export interface Beat50ApiData {
  userData: UserData;
  best50SongData: Best50Songs;
}

export interface Best50Songs {
  b15: SongData[];
  b35: SongData[];
}

export interface SongData {
  achievements: number;
  fc: FCType;
  fs: FSType;
  level: string;
  level_index: LevelIndex;
  level_label: string;
  ds: number;
  ra: number;
  rate: RateType;
  id: number;
  title: string;
  type: SongType;
  dxScore: number;
  starNumber: number;
  additionalData: {
    notes: SongNotes;
    note_designer: string;
    version: string;
    bpm: number;
    genre: string;
  };
}

interface SongNotes {
  tap: number;
  hold: number;
  slide: number;
  break: number;
  touch: number;
  total: number;
}

export interface CombinedStatsData {
  b15max: number;
  b15min: number;
  b15avg: number;
  b15sum: number;
  b15range: number;
  b15stdDev: number;
  b35max: number;
  b35min: number;
  b35avg: number;
  b35sum: number;
  b35range: number;
  b35stdDev: number;
}

export interface UserData {
  username: string;
  nickname: string;
  rating: number;
  avatarUrl: string;
  plateId: number;
  backgroundId: number;
  rankId: number;
  classId: number;
  starCount: number;
  trophyName: string;
  trophyColor: string;
  api: ApiType;
}

export interface SongInfo {
  id: number;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  version: number;
  difficulties: {
    standard: DifficultyInfo[];
    dx: DifficultyInfo[];
  };
}

export interface DifficultyInfo {
  type: SongType;
  difficulty: LevelIndex;
  level: string;
  level_value: number;
  note_designer: string;
  version: number;
  notes: Notes;
}

export interface Notes {
  tap: number;
  hold: number;
  slide: number;
  break: number;
  touch: number;
  total: number;
}
