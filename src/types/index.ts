export interface apiData {
  userData: UserData;
  songData: Songs;
}

export interface SongData {
  achievements: number;
  fc: null | string;
  fs: null | string;
  level: string;
  level_index: number;
  level_label: string;
  ds: number;
  ra: number;
  rate: string;
  id: number;
  title: string;
  type: "DX" | "SD";
  dxScore: number;
  starNumber: number;
  additionalData: {
    notes: songNotes;
    note_designer: string;
    version: number;
    bpm: number;
    genre: string;
  };
}

interface songNotes {
  tap: number;
  hold: number;
  slide: number;
  break: number;
  touch: number;
  total: number;
}
export interface Songs {
  b15: SongData[];
  b35: SongData[];
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
  api: "LXNS" | "FISH";
}
