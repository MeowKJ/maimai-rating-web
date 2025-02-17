import type { SongData, SongInfo, Best50SongsData } from "./types";
import { SongType } from "./types/enum";

/**
 * 从外部 API 获取所有歌曲信息的函数
 * @returns 返回包含所有歌曲信息的数组或 null（如果请求失败）
 */
async function getTotalSongsInfo(): Promise<SongInfo[] | null> {
  const apiUrl = "https://maimai.lxns.net/api/v0/maimai/song/list?notes=true";
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
    });

    const responseData = await response.json();
    if (!response.ok) {
      return null;
    }
    return responseData.songs as SongInfo[];
  } catch (error) {
    console.error("Error At Get UserData From LXNS:", error);
    return null;
  }
}

// 使用一个全局变量来缓存所有歌曲信息
let cachedTotalSongsInfo: Record<number, SongInfo> | null = null;

/**
 * 获取所有歌曲信息并缓存的函数
 * @returns 返回包含所有歌曲信息的映射或 null（如果请求失败）
 */
async function getCachedTotalSongsInfo(): Promise<Record<
  number,
  SongInfo
> | null> {
  // 如果缓存中没有数据，则请求一次并缓存
  if (!cachedTotalSongsInfo) {
    const totalSongsInfo = await getTotalSongsInfo();
    if (totalSongsInfo) {
      // 将获取到的歌曲信息转换为以 id 为键的对象，方便后续查找
      cachedTotalSongsInfo = totalSongsInfo.reduce((acc, song) => {
        acc[song.id] = song;
        return acc;
      }, {} as Record<number, SongInfo>);
    }
  }
  // 返回缓存的数据
  return cachedTotalSongsInfo;
}

/**
 * 为单个歌曲添加附加信息的函数
 * @param song 要处理的单个歌曲数据
 * @param totalSongsInfoMap 所有歌曲信息的映射
 * @returns 返回添加了附加信息的歌曲数据或 null（如果未找到匹配的歌曲信息）
 */
function enrichSongData(
  song: SongData,
  totalSongsInfoMap: Record<number, SongInfo>
): SongData | null {
  // 从映射中获取歌曲信息
  const songInfo = totalSongsInfoMap[song.id];

  // 如果没有找到匹配的歌曲信息，返回 null
  if (!songInfo) {
    return null;
  }

  // 根据歌曲类型选择对应的难度信息
  const difficulties =
    song.type === SongType.DX
      ? songInfo.difficulties.dx
      : songInfo.difficulties.standard;
  const songDifficultyData = difficulties[song.level_index];

  // 如果没有找到匹配的难度信息，返回 null
  if (!songDifficultyData) {
    return null;
  }

  // 更新 ds（难度值）
  song.ds = songDifficultyData.level_value;

  // 计算歌曲的分数百分比
  const maxScore = songDifficultyData.notes.total * 3;
  const percent = song.dxScore !== 0 ? (song.dxScore / maxScore) * 100 : 0;

  // 根据分数百分比为歌曲打星级
  if (percent >= 97) {
    song.starNumber = 5;
  } else if (percent >= 95) {
    song.starNumber = 4;
  } else if (percent >= 93) {
    song.starNumber = 3;
  } else if (percent >= 90) {
    song.starNumber = 2;
  } else if (percent >= 85) {
    song.starNumber = 1;
  } else {
    song.starNumber = 0;
  }

  // 为歌曲添加附加信息
  song.additionalData.bpm = songInfo.bpm;
  song.additionalData.version = getVersionString(songInfo.version);
  song.additionalData.genre = songInfo.genre;
  song.additionalData.note_designer = songDifficultyData.note_designer;
  song.additionalData.notes = songDifficultyData.notes;

  return song;
}

/**
 * 批量为 Best50Songs 数据添加附加信息的函数
 * @param best50Songs 要处理的 Best50Songs 数据
 * @param totalSongsInfoMap 所有歌曲信息的映射
 * @returns 返回添加了附加信息的 Best50Songs 数据
 */
async function enrichBest50Songs(
  best50Songs: Best50SongsData,
  totalSongsInfoMap: Record<number, SongInfo>
): Promise<Best50SongsData> {
  const result: Best50SongsData = {
    b15: best50Songs.b15
      .map((song) => enrichSongData(song, totalSongsInfoMap))
      .filter((s) => s !== null) as SongData[],
    b35: best50Songs.b35
      .map((song) => enrichSongData(song, totalSongsInfoMap))
      .filter((s) => s !== null) as SongData[],
  };

  return result;
}

/**
 * 根据传入的版本号获取对应的版本名称字符串
 * @param version 传入的版本号
 * @returns 返回对应的版本名称字符串
 */
function getVersionString(version: number): string {
  const versions = [
    { id: 0, title: "maimai", version: 10000 },
    { id: 1, title: "maimai PLUS", version: 11000 },
    { id: 2, title: "GreeN", version: 12000 },
    { id: 3, title: "GreeN PLUS", version: 13000 },
    { id: 4, title: "ORANGE", version: 14000 },
    { id: 5, title: "ORANGE PLUS", version: 15000 },
    { id: 6, title: "PiNK", version: 16000 },
    { id: 7, title: "PiNK PLUS", version: 17000 },
    { id: 8, title: "MURASAKi", version: 18000 },
    { id: 9, title: "MURASAKi PLUS", version: 18500 },
    { id: 10, title: "MiLK", version: 19000 },
    { id: 11, title: "MiLK PLUS", version: 19500 },
    { id: 12, title: "FiNALE", version: 19900 },
    { id: 13, title: "舞萌DX", version: 20000 },
    { id: 15, title: "舞萌DX 2021", version: 21000 },
    { id: 17, title: "舞萌DX 2022", version: 22000 },
    { id: 19, title: "舞萌DX 2023", version: 23000 },
    { id: 20, title: "舞萌DX 2024", version: 24000 },
  ];

  // 排序版本数组，确保版本按照升序排列
  versions.sort((a, b) => a.version - b.version);

  // 查找匹配版本
  for (let i = 0; i < versions.length - 1; i++) {
    if (version >= versions[i].version && version < versions[i + 1].version) {
      return versions[i].title;
    }
  }

  // 特殊情况：如果版本大于等于最后一个版本，返回最后一个版本
  if (version >= versions[versions.length - 1].version) {
    return versions[versions.length - 1].title;
  }

  // 特殊情况：如果版本小于第一个版本，返回第一个版本
  if (version < versions[0].version) {
    return versions[0].title;
  }

  // 如果找不到匹配的版本，返回空字符串或其他默认值
  return "";
}

export {
  getTotalSongsInfo,
  getCachedTotalSongsInfo,
  enrichSongData,
  enrichBest50Songs,
  getVersionString,
};
