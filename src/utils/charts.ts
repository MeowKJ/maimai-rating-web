import type { SongData } from "@/types";
declare const echarts: typeof import("echarts");

import type {
  EChartsOption,
  LinearGradientObject,
  PieSeriesOption,
} from "echarts";

function calculateCounts<T>(
  data: T[],
  path: string[],
  nameMapping: Record<string, string> = {}
): Record<string, number> {
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

  // 如果提供了 nameMapping，则按照其键的顺序进行排序
  if (Object.keys(nameMapping).length > 0) {
    const sortedCounts: Record<string, number> = {};
    for (const key of Object.keys(nameMapping)) {
      if (counts[nameMapping[key]] !== undefined) {
        sortedCounts[nameMapping[key]] = counts[nameMapping[key]];
      }
    }
    // 包括那些在 nameMapping 中未定义的键
    for (const key of Object.keys(counts)) {
      if (sortedCounts[key] === undefined) {
        sortedCounts[key] = counts[key];
      }
    }
    return sortedCounts;
  }

  return counts;
}

function getBasicPieChart(
  title: string,
  name: string,
  countsList: Record<string, number>,
  levelColors?: Record<string, string | LinearGradientObject>,
  useRose?: boolean
): EChartsOption {
  const seriesConfig: PieSeriesOption = {
    name: name,
    type: "pie",

    data: Object.keys(countsList).map((key) => ({
      value: countsList[key],
      name: key,
      itemStyle: levelColors?.[key] ? { color: levelColors[key] } : undefined,
    })),
    ...(useRose
      ? {
          radius: [50, 180],
          center: ["50%", "50%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 8,
          },
        }
      : {
          radius: "50%",
          itemStyle: {
            borderRadius: 0,
          },
        }),
  };

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
    series: [seriesConfig],
  };
}
function getBasicPointChart(
  title: string,
  countsList: [string, number, number][]
): EChartsOption {
  // 将 countsList 转换为 ECharts 数据格式
  const formattedData = countsList.map((item) => ({
    value: [item[1], item[2]], // 第二个和第三个元素为数据点
    name: item[0], // 第一个元素为乐曲标题
  }));

  return {
    xAxis: {
      scale: true,
    },
    yAxis: {
      scale: true,
    },
    title: {
      text: title,
      left: "center",
    },
    tooltip: {
      // 显示标题和两个数字参数
      formatter: function (params: any) {
        return (
          params.marker +
          params.name +
          "<br/>" +
          params.value[0] +
          "->" +
          params.value[1]
        );
      },
    },
    series: [
      {
        symbolSize: 20,
        data: formattedData,
        type: "scatter",
      },
    ],
  };
}

function getDsRateOption(dataList: SongData[]) {
  return getBasicPointChart(
    "定数-分数图",
    dataList.map((item) => [item.title, item.ds, item.ra])
  );
}

function getTypeOption(dataList: SongData[]) {
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
  return getBasicPieChart("乐曲分类分布", "分类", levelCounts, undefined, true);
}

function getLevelVersionOption(dataList: SongData[]) {
  const levelCounts = calculateCounts(dataList, ["additionalData", "version"]);
  return getBasicPieChart("乐曲版本分布", "版本", levelCounts);
}

function getStarOption(dataList: SongData[]) {
  const levelCounts = calculateCounts(dataList, ["starNumber"], {
    0: "0⭐",
    1: "1⭐",
    2: "2⭐",
    3: "3⭐",
    4: "4⭐",
    5: "5⭐",
  });
  return getBasicPieChart("DX星", "⭐", levelCounts);
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
    "": "无徽章",
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
    "": "无徽章",
    null: "无徽章",
  });
  const levelColors = {
    "FULL SYNC DX+": "gold",
    "FULL SYNC DX": "yellow",
    "FULL SYNC+": "#00ff00",
    "FULL SYNC": "#00cc00",
    无徽章: "grey",
    null: "无徽章",
  };

  return getBasicPieChart("双人徽章", "徽章", levelCounts, levelColors);
}
function getRaChangeLineChart(
  b15Data: SongData[],
  b35Data: SongData[]
): EChartsOption {
  // 反转 b15 和 b35 数据数组
  const reversedB15Data = [...b15Data].reverse();
  const reversedB35Data = [...b35Data].reverse();

  return {
    title: {
      text: "乐曲分数变化曲线",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["B15", "B35"],
      left: 10,
    },
    xAxis: [
      {
        type: "category",
        data: reversedB15Data.map((_, index) => index + 1),
        show: false,
      },
      {
        type: "category",
        data: reversedB35Data.map((_, index) => index + 1),
        show: false,
      },
    ],
    yAxis: {
      type: "value",
      name: "RA",
      scale: true,
    },
    series: [
      {
        name: "B15",
        type: "line",
        xAxisIndex: 0,
        data: reversedB15Data.map((song) => song.ra),
        smooth: true,
      },
      {
        name: "B35",
        type: "line",
        xAxisIndex: 1,
        data: reversedB35Data.map((song) => song.ra),
        smooth: true,
      },
    ],
  };
}

export const functionList = (
  b15: SongData[],
  b35: SongData[]
): EChartsOption[] => {
  const totalSongs = b15.concat(b35);
  return [
    getTypeOption(b35),
    getLevelOption(totalSongs),
    getLevelLabelOption(totalSongs),
    getLevelDistributionOption(totalSongs),
    getRateOption(totalSongs),
    getStarOption(totalSongs),
    getBadge1Option(totalSongs),
    getBadge2Option(totalSongs),
    getDsRateOption(totalSongs),
    getRaChangeLineChart(b15, b35),
    getLevelVersionOption(b35),
    getGenreOption(totalSongs),
  ];
};
