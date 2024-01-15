export interface LuoXueResponse {
  code: number;
  success: boolean;
  data?: RawLuoXueUserData | RawLuoXueSongData;
}

interface RawLuoXueUserData {
  name: string;
  rating: number;
  friend_code: number;
  trophy: {
    id: number;
    name: string;
    color: string;
  };
  course_rank: number;
  class_rank: number;
  star: number;
  icon_url: string;
  name_plate: {
    id: number;
    name: string;
  };
  frame: {
    id: number;
    name: string;
  };
  upload_time: string;
}

interface RawLuoXueSong {
  id: number;
  song_name: string;
  level: string;
  level_index: number;
  achievements: number;
  fc: string | null;
  fs: string | null;
  dx_score: number;
  dx_rating: number;
  rate: string;
  type: string;
  upload_time: string;
  play_time?: string;
}

interface RawLuoXueSongsData {
  standard_total: number;
  dx_total: number;
  standard: RawLuoXueSong[];
  dx: RawLuoXueSong[];
}

export interface LuoXueSong {
  id: number;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  version: number;
  difficulties: {
    standard: LuoXueDifficulty[];
    dx: LuoXueDifficulty[];
  };
}

export interface LuoXueDifficulty {
  type: string;
  difficulty: number;
  level: string;
  level_value: number;
  note_designer: string;
  version: number;
  notes: {
    total: number;
    tap: number;
    hold: number;
    slide: number;
    touch: number;
    break: number;
  };
}
