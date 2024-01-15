interface RawFishSong {
  achievements: number;
  ds: number;
  dxScore: number;
  fc: string;
  fs: string;
  level: string;
  level_index: number;
  level_label: string;
  ra: number;
  rate: string;
  song_id: number;
  title: string;
  type: "DX" | "SD";
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
  user_general_data: any; // Replace with the actual type if available
  username: string;
}
