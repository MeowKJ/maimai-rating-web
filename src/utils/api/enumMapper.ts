import {
  ApiType,
  FCType,
  FSType,
  SongType,
  RateType,
  LevelIndex,
} from "./types/enum";

class EnumMapper {
  // ApiType 映射
  public static getApiType(api: string): ApiType {
    switch (api.toUpperCase()) {
      case "LXNS":
        return ApiType.LXNS;
      case "FISH":
        return ApiType.FISH;
      default:
        return ApiType.LXNS; // 默认返回 LXNS
    }
  }

  // FCType 映射
  public static getFCType(fc: string): FCType {
    if (!fc) {
      return FCType.NONE;
    }
    switch (fc.toLowerCase()) {
      case "app":
        return FCType.AP_PLUS;
      case "ap":
        return FCType.AP;
      case "fcp":
        return FCType.FC_PLUS;
      case "fc":
        return FCType.FC;
      case "none":
        return FCType.NONE;
      default:
        return FCType.NONE; // 默认返回 NONE
    }
  }

  // FSType 映射
  public static getFSType(fs: string): FSType {
    if (!fs) {
      return FSType.NONE;
    }
    switch (fs.toLowerCase()) {
      case "fsdp":
        return FSType.FDX_PLUS;
      case "fsd":
        return FSType.FDX;
      case "fsp":
        return FSType.FS_PLUS;
      case "fs":
        return FSType.FS;
      case "sync":
        return FSType.SYNC_PLAY;
      default:
        return FSType.NONE; // 默认返回 NONE
    }
  }

  // RateType 映射
  public static getRateType(rate: string): RateType {
    switch (rate.toUpperCase()) {
      case "SSSP":
        return RateType.SSS_PLUS;
      case "SSS":
        return RateType.SSS;
      case "SSP":
        return RateType.SS_PLUS;
      case "SS":
        return RateType.SS;
      case "SP":
        return RateType.S_PLUS;
      case "S":
        return RateType.S;
      case "AAA":
        return RateType.AAA;
      case "AA":
        return RateType.AA;
      case "A":
        return RateType.A;
      case "BBB":
        return RateType.BBB;
      case "BB":
        return RateType.BB;
      case "B":
        return RateType.B;
      case "C":
        return RateType.C;
      case "D":
        return RateType.D;
      default:
        return RateType.D; // 默认返回 D
    }
  }

  // SongType 映射
  public static getSongType(type: string): SongType {
    const lowerType = type.toUpperCase();
    switch (true) {
      case lowerType.includes("DX"):
        return SongType.DX;
      case lowerType.includes("SD") || lowerType.includes("STANDARD"):
        return SongType.STANDARD;
      case lowerType.includes("UT"):
        return SongType.UTAGE;
      default:
        return SongType.STANDARD; // 默认返回 STANDARD
    }
  }

  // LevelIndex 映射
  public static getLevelIndex(level: string | number): LevelIndex {
    if (typeof level === "string") {
      switch (level.toUpperCase()) {
        case "BASIC":
          return LevelIndex.BASIC;
        case "ADVANCED":
          return LevelIndex.ADVANCED;
        case "EXPERT":
          return LevelIndex.EXPERT;
        case "MASTER":
          return LevelIndex.MASTER;
        case "RE:MASTER":
          return LevelIndex.ReMASTER;
        default:
          return LevelIndex.BASIC; // 默认返回 BASIC
      }
    } else if (typeof level === "number") {
      switch (level) {
        case 0:
          return LevelIndex.BASIC;
        case 1:
          return LevelIndex.ADVANCED;
        case 2:
          return LevelIndex.EXPERT;
        case 3:
          return LevelIndex.MASTER;
        case 4:
          return LevelIndex.ReMASTER;
        default:
          return LevelIndex.BASIC; // 默认返回 BASIC
      }
    }
    return LevelIndex.BASIC; // 默认返回 BASIC
  }
}

export default EnumMapper;
