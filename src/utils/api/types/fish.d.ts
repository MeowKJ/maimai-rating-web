import { FCType, FSType, LevelIndex } from "./enum";

interface RawFishSong {
  achievements: number;
  ds: number;
  dxScore: number;
  fc: FCType;
  fs: FSType;
  level: string;
  level_index: LevelIndex;
  level_label: string;
  ra: number;
  rate: string;
  song_id: number;
  title: string;
  type: string;
}

interface RawFishUserCharts {
  dx: RawFishSong[];
  sd: RawFishSong[];
}

export interface RawFishResponse {
  additional_rating: number;
  charts: RawFishUserCharts;
  nickname: string;
  plate: string;
  rating: number;
  user_general_data: any;
  username: string;
}
