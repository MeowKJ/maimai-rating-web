import type {
  SongData,
  Best50SongsData,
  UserData,
  Beat50ApiData,
} from "./types";
import type { RawFishResponse, RawFishSong } from "@/utils/api/types/fish";
import { getCachedTotalSongsInfo, enrichBest50Songs } from "./tools";
import { ApiType } from "./types/enum";
import EnumMapper from "./enumMapper";
import ApiDataProvider from "./ApiDataProvider";

/**
 * 类：DivingFish
 * 该类表示 DivingFish API 提供者，用于从 DivingFish API 获取用户数据和最佳50歌曲数据。
 */
export default class DivingFish extends ApiDataProvider {
  private apiUrl =
    "https://www.diving-fish.com/api/maimaidxprober/query/player";

  /**
   * 获取最佳50歌曲数据和用户数据。
   * @returns {Promise<Beat50ApiData | null>} 返回最佳50歌曲数据和用户数据，如果发生错误则返回 null。
   */
  public async getBest50Data(): Promise<Beat50ApiData | null> {
    try {
      // 从 DivingFish API 获取用户数据和最佳50歌曲数据
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          b50: true,
        }),
      });

      if (!response.ok) {
        console.error(`请求失败: ${response.status}`);
        return null;
      }

      const rawUserData: RawFishResponse = await response.json();

      // 从响应数据中映射用户数据
      const userData: UserData = {
        username: this.username,
        nickname: rawUserData.nickname,
        rating: rawUserData.rating,
        avatarUrl: "https://maimai.mpas.top/assets/images/avatar",
        plateId: 0,
        backgroundId: 0,
        rankId: 0,
        classId: 0,
        starCount: 0,
        trophyName: "",
        trophyColor: "",
        api: ApiType.FISH,
      };

      // 从响应数据中映射歌曲数据
      let songsData: Best50SongsData = {
        b15: rawUserData.charts.dx.map(mapRawSongDataFish),
        b35: rawUserData.charts.sd.map(mapRawSongDataFish),
      };

      // 使用额外信息丰富歌曲数据
      const totalSongsInfo = await getCachedTotalSongsInfo();
      if (totalSongsInfo) {
        songsData = await enrichBest50Songs(songsData, totalSongsInfo);
      } else {
        console.error("未能获取到总歌曲信息");
      }
      console.log("Data From DivingFish API:");
      console.log("rawUserData", rawUserData);
      console.log("songsData", songsData);
      console.log("userData", userData);

      return {
        userData,
        best50SongsData: songsData,
      };
    } catch (error) {
      console.error("发生错误:", error);
      return null;
    }
  }
}

/**
 * 将 DivingFish API 的原始歌曲数据映射到 SongData 格式。
 * @param {RawFishSong} rawSong - DivingFish API 的原始歌曲数据。
 * @returns {SongData} 映射后的歌曲数据。
 */
function mapRawSongDataFish(rawSong: RawFishSong): SongData {
  const initialNotes = {
    tap: 0,
    hold: 0,
    slide: 0,
    break: 0,
    touch: 0,
    total: 0,
  };

  const initialAdditionalData = {
    notes: initialNotes,
    note_designer: "",
    version: "",
    bpm: 0,
    genre: "",
  };

  return {
    achievements: rawSong.achievements,
    fc: EnumMapper.getFCType(rawSong.fc),
    fs: EnumMapper.getFSType(rawSong.fs),
    level: rawSong.level,
    level_index: rawSong.level_index,
    level_label: rawSong.level_label,
    ds: rawSong.ds,
    ra: rawSong.ra,
    rate: EnumMapper.getRateType(rawSong.rate),
    id: rawSong.song_id % 10000,
    title: rawSong.title,
    type: EnumMapper.getSongType(rawSong.type),
    dxScore: rawSong.dxScore,
    starNumber: 0,
    additionalData: initialAdditionalData,
  };
}
