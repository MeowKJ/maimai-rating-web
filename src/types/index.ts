export interface SongData {
  achievements: number;
  dxScore: number;
  starNumber: number;
  fc: "fc" | "fcp" | "ap" | "app";
  fs: "fs" | "fsp" | "fsd" | "fsdp";
  level: string;
  level_index: 0 | 1 | 2 | 3 | 4 | 5;
  level_label: "Basic" | "Advance" | "Expert" | "Master" | "RE:MASTER";
  ds: number;
  ra: number;
  rate: string;
  song_id: number;
  title: string;
  type: string;
}

export interface RawUser {
  username: string;
  nickname: string;
  avatarUrl: string;
  plateId: number;
  backgroundId: number;
  rankId: number;
  classId: number;
  starCount: number;
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
