export interface RawLuoXueResponse {
  code: number;
  success: boolean;
  data?: RawLuoXueUserData | RawLuoXueSongsData;
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
  icon: {
    genre: string;
    id: number;
    name: string;
  };
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
  fc: string;
  fs: string;
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
