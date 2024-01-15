// api.ts
import type { UserData, SongData, Songs, apiData } from "../types";
import type { RawFishResponse, RawFishSong } from "@/types/fish";
import type {
  LuoXueResponse,
  RawLuoXueSong,
  RawLuoXueSongsData,
  RawLuoXueUserData,
  LuoXueSong,
} from "@/types/lxns";

export async function getDataFromDivingFish(
  username: string
): Promise<apiData | null> {
  const apiUrl = "https://www.diving-fish.com/api/maimaidxprober/query/player";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        b50: true,
      }),
    });

    if (!response.ok) {
      console.error(`请求失败: ${response.status}`);
      return null;
    }

    // 处理响应数据
    const rawUserData: RawFishResponse = await response.json();

    const userData: UserData = {
      username: username,
      nickname: rawUserData.nickname,
      rating: rawUserData.rating,
      avatarUrl: "",
      plateId: 0,
      backgroundId: 0,
      rankId: 0,
      classId: 0,
      starCount: 0,
      trophyName: "",
      trophyColor: "",
      api: "FISH",
    };

    let songsData: Songs = {
      b15: rawUserData.charts.dx.map((item) => mapRawSongDataFish(item)),
      b35: rawUserData.charts.sd.map((item) => mapRawSongDataFish(item)),
    };
    songsData = await updataSongs(songsData);

    const apiData: apiData = {
      userData: userData,
      songData: songsData,
    };

    return apiData;
  } catch (error) {
    console.error("发生错误:", error);
    return null;
  }
}

export async function getUserDataFromLuoXue(
  username: string
): Promise<apiData | null> {
  const apiUrl = "https://maimai.lxns.net";
  const authHeaders = {
    Authorization: import.meta.env.VITE_API_KEY,
  };

  try {
    const response = await fetch(
      apiUrl + "/api/v0/maimai/player/qq/" + username,
      {
        method: "GET",
        headers: authHeaders,
      }
    );

    if (!response.ok) {
      return null;
    }

    const luoXueResponse: LuoXueResponse = await response.json();
    if (!luoXueResponse.data) {
      return null;
    }
    const rawUserData = luoXueResponse.data as RawLuoXueUserData;
    // 在这里对数据进行格式修改
    const userData: UserData = {
      username: username,
      nickname: rawUserData.name,
      rating: rawUserData.rating,
      avatarUrl: rawUserData.icon_url,
      plateId: rawUserData.name_plate.id,
      backgroundId: rawUserData.frame.id,
      rankId: rawUserData.course_rank,
      classId: rawUserData.class_rank,
      starCount: rawUserData.star,
      trophyName: rawUserData.trophy.name,
      trophyColor: rawUserData.trophy.color,
      api: "LXNS",
    };

    const SongResponse = await fetch(
      apiUrl + "/api/v0/maimai/player/" + rawUserData.friend_code + "/bests",
      {
        method: "GET",
        headers: authHeaders,
      }
    );

    if (!SongResponse.ok) {
      return null;
    }

    const songDataResponse: LuoXueResponse = await SongResponse.json();

    const rawLuoXueSongData = songDataResponse.data as RawLuoXueSongsData;
    let songsData: Songs = {
      b15: rawLuoXueSongData.dx.map((item) => mapRawSongDataLuoXue(item)),
      b35: rawLuoXueSongData.standard.map((item) => mapRawSongDataLuoXue(item)),
    };
    songsData = await updataSongs(songsData);

    const apiData: apiData = {
      userData: userData,
      songData: songsData,
    };

    return apiData;
  } catch (error) {
    console.error("Error At Get UserData From LXNS:", error);
    return null;
  }
}

function mapRawSongDataLuoXue(rawSong: RawLuoXueSong): SongData {
  let type: "DX" | "SD";
  if (rawSong.type === "dx") {
    type = "DX";
  } else {
    type = "SD";
  }

  let level_label: string;
  switch (rawSong.level_index) {
    case 0:
      level_label = "Basic";
      break;
    case 1:
      level_label = "Advanced";
      break;
    case 2:
      level_label = "Expert";
      break;
    case 3:
      level_label = "Master";
      break;
    default:
      level_label = "Re:MASTER";
      break;
  }

  return {
    achievements: rawSong.achievements,
    fc: rawSong.fc,
    fs: rawSong.fs,
    level: rawSong.level,
    level_index: rawSong.level_index,
    level_label: level_label,
    ds: rawSong.level_index,
    ra: Math.floor(rawSong.dx_rating),
    rate: rawSong.rate,
    id: rawSong.id,
    title: rawSong.song_name,
    type: type,
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
      version: 0,
      bpm: 0,
      genre: "",
    },
  };
}

function mapRawSongDataFish(rawSong: RawFishSong): SongData {
  return {
    achievements: rawSong.achievements,
    fc: rawSong.fc,
    fs: rawSong.fs,
    level: rawSong.level,
    level_index: rawSong.level_index,
    level_label: rawSong.level_label,
    ds: rawSong.ds,
    ra: rawSong.ra,
    rate: rawSong.rate,
    id: rawSong.song_id % 10000,
    title: rawSong.title,
    type: rawSong.type,
    dxScore: rawSong.dxScore,
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
      version: 0,
      bpm: 0,
      genre: "",
    },
  };
}

async function getTotalSongData() {
  const apiUrl = "https://maimai.lxns.net/api/v0/maimai/song/list?notes=true";
  const authHeaders = {
    Authorization: import.meta.env.VITE_API_KEY,
  };
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: authHeaders,
    });

    const responseData = await response.json();
    if (!response.ok) {
      return null;
    }
    return responseData.songs as LuoXueSong[];
  } catch (error) {
    console.error("Error At Get UserData From LXNS:", error);
    return null;
  }
}

async function updataSongs(songs: Songs): Promise<Songs> {
  const luoXueSongs = await getTotalSongData();
  if (luoXueSongs === null) {
    return songs;
  }

  const luoXueSongMap: Record<number, LuoXueSong> = {};

  // 将 LuoXueSong 数组转换为以 id 为键的对象
  luoXueSongs!.forEach((song) => {
    luoXueSongMap[song.id] = song;
  });

  const mapSong = (song: SongData): SongData | null => {
    const luoXueSong = luoXueSongMap[song.id];

    if (!luoXueSong) {
      return null;
    }

    const difficulties =
      song.type === "DX"
        ? luoXueSong.difficulties.dx
        : luoXueSong.difficulties.standard;

    const luoXueSongData = difficulties[song.level_index];

    if (!luoXueSongData) {
      return null;
    }

    song.ds = luoXueSongData.level_value;

    const dxScore = song.dxScore;
    const maxScore = luoXueSongData.notes.total * 3;
    const percent = dxScore !== 0 ? (dxScore / maxScore) * 100 : 0;

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

    song.additionalData.bpm = luoXueSong.bpm;
    song.additionalData.version = luoXueSong.version;
    song.additionalData.genre = luoXueSong.genre;
    song.additionalData.note_designer = luoXueSongData.note_designer;
    song.additionalData.notes = luoXueSongData.notes;

    return song;
  };

  const result: Songs = {
    b15: songs.b15.map(mapSong).filter((s) => s !== null) as SongData[],
    b35: songs.b35.map(mapSong).filter((s) => s !== null) as SongData[],
  };

  return result;
}
