// luoXue.ts
import type { SongData, Best50Songs, UserData, Beat50ApiData } from "./types";
import {
  ApiType,
  FCType,
  FSType,
  SongType,
  RateType,
  LevelIndex,
} from "./types/enum";
import type {
  RawLuoXueResponse,
  RawLuoXueSong,
  RawLuoXueSongsData,
  RawLuoXueUserData,
} from "@/utils/api/types/lxns";
import ApiDataProvider from "./ApiDataProvider";
import EnumMapper from "./enumMapper";
import { getCachedTotalSongsInfo, enrichBest50Songs } from "./tools";

export default class LuoXue extends ApiDataProvider {
  private apiUrl = "https://maimai.lxns.net";
  private authHeaders = {
    Authorization: import.meta.env.VITE_API_KEY,
  };

  private async fetchFromApi(
    endpoint: string
  ): Promise<RawLuoXueResponse | null> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: "GET",
        headers: this.authHeaders,
      });

      if (!response.ok) {
        console.error(`请求失败: ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("API 请求错误:", error);
      return null;
    }
  }

  private async getUserDataFromApi(): Promise<RawLuoXueUserData | null> {
    const userResponse = await this.fetchFromApi(
      `/api/v0/maimai/player/qq/${this.username}`
    );
    if (userResponse && userResponse.data) {
      return userResponse.data as RawLuoXueUserData;
    }
    return null;
  }

  private async getBest50DataFromApi(
    friendCode: number
  ): Promise<RawLuoXueSongsData | null> {
    const songResponse = await this.fetchFromApi(
      `/api/v0/maimai/player/${friendCode}/bests`
    );
    if (songResponse && songResponse.data) {
      return songResponse.data as RawLuoXueSongsData;
    }
    return null;
  }

  public async getBest50Data(): Promise<Beat50ApiData | null> {
    try {
      const userDataRaw = await this.getUserDataFromApi();
      if (!userDataRaw) {
        return null;
      }

      const userData: UserData = {
        username: this.username,
        nickname: userDataRaw.name,
        rating: userDataRaw.rating,
        avatarUrl: `https://maimai.mpas.top/assets/avatar/${userDataRaw.icon.id}`,
        plateId: userDataRaw?.name_plate?.id || 0,
        backgroundId: userDataRaw?.frame?.id || 0,
        rankId: userDataRaw?.course_rank || 0,
        classId: userDataRaw?.class_rank || 0,
        starCount: userDataRaw.star || 0,
        trophyName: userDataRaw?.trophy.name || "",
        trophyColor: userDataRaw?.trophy.color || "",
        api: ApiType.LXNS,
      };

      const songDataRaw = await this.getBest50DataFromApi(
        userDataRaw.friend_code
      );
      if (!songDataRaw) {
        return null;
      }

      let songsData: Best50Songs = {
        b15: songDataRaw.dx.map((item) => this.mapRawSongDataLuoXue(item)),
        b35: songDataRaw.standard.map((item) =>
          this.mapRawSongDataLuoXue(item)
        ),
      };

      const totalSongsInfo = await getCachedTotalSongsInfo();
      if (totalSongsInfo) {
        songsData = await enrichBest50Songs(songsData, totalSongsInfo);
      } else {
        console.error("未能获取到总歌曲信息");
      }

      return {
        userData,
        best50SongData: songsData,
      };
    } catch (error) {
      console.error("Error At Get Best50Data From LXNS:", error);
      return null;
    }
  }

  private mapRawSongDataLuoXue(rawSong: RawLuoXueSong): SongData {
    return {
      achievements: rawSong.achievements,
      fc: EnumMapper.getFCType(rawSong.fc),
      fs: EnumMapper.getFSType(rawSong.fs),
      level: rawSong.level,
      level_index: EnumMapper.getLevelIndex(rawSong.level_index),
      level_label: rawSong.level,
      ds: rawSong.level_index,
      ra: Math.floor(rawSong.dx_rating),
      rate: EnumMapper.getRateType(rawSong.rate),
      id: rawSong.id,
      title: rawSong.song_name,
      type: EnumMapper.getSongType(rawSong.type),
      dxScore: rawSong.dx_score,
      starNumber: 0,
      additionalData: {
        notes: {
          tap: 0,
          hold: 0,
          slide: 0,
          break: 0,
          touch: 0,
          total: 0,
        },
        note_designer: "",
        version: "",
        bpm: 0,
        genre: "",
      },
    };
  }
}
