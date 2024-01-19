import type { SongData } from "@/types";
import * as echarts from "echarts";
import type { LinearGradientObject } from "echarts";
import type { EChartsOption } from "echarts";

function calculateCounts<T>(
  data: T[],
  path: string[],
  nameMapping: Record<string, string> = {}
): Record<string, number> {
  // 首先，和原来一样计算计数
  const counts = data.reduce((counts: Record<string, number>, item: T) => {
    let currentValue: any = item;
    for (const prop of path) {
      currentValue = currentValue?.[prop];
      if (currentValue === undefined) break;
    }
    if (currentValue !== undefined) {
      let keyStr = String(currentValue);
      keyStr = nameMapping[keyStr] || keyStr;
      counts[keyStr] = (counts[keyStr] || 0) + 1;
    }
    return counts;
  }, {});

  // 使用 nameMapping 的 keys 创建排序顺序
  const sortOrder = Object.values(nameMapping);

  // 如果 nameMapping 提供了排序规则，则对结果进行排序
  if (sortOrder.length > 0) {
    // 创建一个映射，用于快速查找 sortOrder 中每个 key 的索引
    const sortOrderIndex = new Map(sortOrder.map((key, index) => [key, index]));

    // 将 counts 对象转换为数组，并根据 sortOrder 进行排序
    return Object.fromEntries(
      Object.entries(counts).sort(
        ([keyA], [keyB]) =>
          (sortOrderIndex.get(keyA) ?? sortOrder.length) -
          (sortOrderIndex.get(keyB) ?? sortOrder.length)
      )
    );
  }

  // 如果没有提供排序规则，直接返回原始计数结果
  return counts;
}

function getBasicPieChart(
  title: string,
  name: string,
  countsList: Record<string, number>,
  levelColors?: Record<string, string | LinearGradientObject>
) {
  return {
    title: {
      text: title,
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: name,
        type: "pie",
        radius: "50%",
        data: Object.keys(countsList).map((key) => {
          // 创建数据对象
          const dataObject: {
            value: number;
            name: string;
            itemStyle?: { color: string | LinearGradientObject };
          } = {
            value: countsList[key],
            name: key,
          };

          // 如果levelColors存在且为当前key提供了颜色，则添加itemStyle
          if (levelColors && levelColors.hasOwnProperty(key)) {
            dataObject.itemStyle = { color: levelColors[key] };
          }

          return dataObject;
        }),
      },
    ],
  };
}

export function getTypeOption(dataList: SongData[]) {
  return getBasicPieChart(
    "B35中DX和SD分布",
    "类型",
    calculateCounts(dataList, ["type"])
  );
}

function getLevelOption(dataList: SongData[]) {
  return getBasicPieChart(
    "乐曲等级分布",
    "等级",
    calculateCounts(dataList, ["level"])
  );
}

function getLevelLabelOption(dataList: SongData[]) {
  return getBasicPieChart(
    "乐曲难度分布",
    "难度",
    calculateCounts(dataList, ["level_label"])
  );
}

function getGenreOption(dataList: SongData[]) {
  const levelCounts = calculateCounts(dataList, ["additionalData", "genre"]);
  return getBasicPieChart("乐曲分类分布", "分类", levelCounts);
}

function getLevelVersionOption(dataList: SongData[]) {
  const levelCounts = calculateCounts(dataList, ["additionalData", "version"]);
  return getBasicPieChart("乐曲分类分布", "分类", levelCounts);
}

function getLevelDistributionOption(dataList: SongData[]) {
  const LevelDistributionCounts = calculateCounts(dataList, ["level_label"]);

  // 颜色映射
  const levelColors = {
    Basic: "#90EE90", // 青草绿（淡绿色）
    Advance: "#FFFFE0", // 黄色（淡黄色）
    Master: "#BA55D3", // 不那么淡的紫色
    Expert: "#FF6347", // 不那么红的红色（番茄色）
    "Re:MASTER": "#dcbcfb", // 淡紫色
  };

  return getBasicPieChart(
    "乐曲难度分布",
    "难度",
    LevelDistributionCounts,
    levelColors
  );
}

function getRateOption(dataList: SongData[]) {
  const rateCounts = calculateCounts(dataList, ["rate"]);
  const rateColors = {
    sssp: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
      { offset: 0, color: "#FF0000" }, // 番茄色（深红色）
      { offset: 0.15, color: "#FF4500" }, // 橙红色
      { offset: 0.3, color: "#FFA500" }, // 橙色
      { offset: 0.45, color: "#FFD700" }, // 金色
      { offset: 0.6, color: "#FFFF00" }, // 鲜黄色
      { offset: 1, color: "#008000" }, // 绿色`
    ]),

    sss: "#ff6699", // 浅红色
    ssp: "#FFD700", // 金色
    ss: "#FFFF00", // 黄色
    sp: "#DAA520", // 土黄色
    s: "#8B4513", // 土色
    // 默认颜色为淡灰色
  };

  return getBasicPieChart("乐曲评级分布", "评级", rateCounts, rateColors);
}

function getBadge1Option(dataList: SongData[]) {
  const levelCounts = calculateCounts(dataList, ["fc"], {
    app: "ALL PERFECT+",
    ap: "ALL PERFECT",
    fcp: "FULL COMBO+",
    fc: "FULL COMBO",
    null: "无徽章",
  });

  const levelColors = {
    "ALL PERFECT+": "gold",
    "ALL PERFECT": "yellow",
    "FULL COMBO+": "#00ff00",
    "FULL COMBO": "#00cc00",
    无徽章: "grey",
  };

  return getBasicPieChart("徽章", "徽章", levelCounts, levelColors);
}

function getBadge2Option(dataList: SongData[]) {
  const levelCounts = calculateCounts(dataList, ["fs"], {
    fsdp: "FULL SYNC DX+",
    fsd: "FULL SYNC DX",
    fsp: "FULL SYNC+",
    fs: "FULL SYNC",
    null: "无徽章",
  });
  const levelColors = {
    "FULL SYNC DX+": "gold",
    "FULL SYNC DX": "yellow",
    "FULL SYNC+": "#00ff00",
    "FULL SYNC": "#00cc00",
    无徽章: "grey",
  };

  return getBasicPieChart("双人徽章", "徽章", levelCounts, levelColors);
}

export const functionList = (
  b15: SongData[],
  b35: SongData[]
): EChartsOption[] => {
  // 函数实现保持不变
  const totalSongs = b15.concat(b35);
  return [
    getTypeOption(b35) as EChartsOption,
    getLevelOption(totalSongs) as EChartsOption,
    getLevelLabelOption(totalSongs) as EChartsOption,
    getGenreOption(totalSongs) as EChartsOption,
    getLevelVersionOption(b35) as EChartsOption,
    getLevelDistributionOption(totalSongs) as EChartsOption,
    getRateOption(totalSongs) as EChartsOption,
    getBadge1Option(totalSongs) as EChartsOption,
    getBadge2Option(totalSongs) as EChartsOption,
  ];
};
