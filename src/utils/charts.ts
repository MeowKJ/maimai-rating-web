import * as echarts from "echarts";

function calculateCounts<T>(
  data: T[],
  property: keyof T
): Record<string, number> {
  return data.reduce((counts: Record<string, number>, item: T) => {
    const key = item[property];
    if (key !== undefined) {
      const keyStr = String(key);
      counts[keyStr] = (counts[keyStr] || 0) + 1;
    }
    return counts;
  }, {});
}

function initTypePieChart(
  dom: HTMLElement | null | undefined,
  dataList: any[]
) {
  const pieChart = echarts.init(dom);
  const typeCounts = calculateCounts(dataList, "type");

  const option = {
    title: {
      text: "B35中DX和SD分布",
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
        name: "类型",
        type: "pie",
        radius: "50%",
        data: [
          { value: typeCounts.DX, name: "DX" },
          { value: typeCounts.SD, name: "SD" },
        ],
      },
    ],
  };
  pieChart.setOption(option);
}

function initLevelPieChart(
  dom: HTMLElement | null | undefined,
  dataList: any[]
) {
  const chart = echarts.init(dom);
  const levelCounts = calculateCounts(dataList, "level");

  const option = {
    title: {
      text: "乐曲等级分布",
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
        name: "等级",
        type: "pie",
        radius: "50%",
        data: Object.keys(levelCounts).map((key) => ({
          value: levelCounts[key],
          name: key,
        })),
      },
    ],
  };

  chart.setOption(option);
}

function initLevelDistributionChart(
  dom: HTMLElement | null | undefined,
  dataList: any[]
) {
  const chart = echarts.init(dom);
  const LevelDistributionCounts = calculateCounts(dataList, "level_label");

  // 颜色映射
  const levelColors = {
    Basic: "#90EE90", // 青草绿（淡绿色）
    Advance: "#FFFFE0", // 黄色（淡黄色）
    Master: "#BA55D3", // 不那么淡的紫色
    Expert: "#FF6347", // 不那么红的红色（番茄色）
    "Re:MASTER": "#dcbcfb", // 淡紫色
  };

  const option = {
    title: {
      text: "乐曲难度分布",
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
        name: "难度",
        type: "pie",
        radius: "50%",
        data: Object.keys(LevelDistributionCounts).map((key) => ({
          value: LevelDistributionCounts[key],
          name: key,
          // 设置对应的颜色
          itemStyle: {
            color: levelColors[key as keyof typeof levelColors] || "#000", // 如果没有找到对应的颜色，使用默认颜色
          },
        })),
      },
    ],
  };
  chart.setOption(option);
}

function initRatePieChart(
  dom: HTMLElement | null | undefined,
  dataList: any[]
) {
  const chart = echarts.init(dom);
  const rateCounts = calculateCounts(dataList, "rate");
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
  const option = {
    title: {
      text: "乐曲评级分布",
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
        name: "评级",
        type: "pie",
        radius: "50%",
        data: Object.keys(rateCounts).map((key) => {
          let color = rateColors[key as keyof typeof rateColors] || "#D3D3D3"; // 使用预定义的颜色，如果没有则使用淡灰色
          return {
            value: rateCounts[key],
            name: key,
            itemStyle: { color: color },
          };
        }),
      },
    ],
  };
  chart.setOption(option);
}

function initBadgePieChart1(
  dom: HTMLElement | null | undefined,
  dataList: any[]
) {
  const chart = echarts.init(dom);
  const levelCounts = calculateCounts(dataList, "fc");

  const option = {
    title: {
      text: "徽章",
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
        name: "徽章",
        type: "pie",
        radius: "50%",
        data: [
          {
            name: "ALL PERFECT+",
            value: levelCounts["app"] || 0,
            itemStyle: { color: "gold" },
          },
          {
            name: "ALL PERFECT",
            value: levelCounts["ap"] || 0,
            itemStyle: { color: "yellow" },
          },
          {
            name: "FULL COMBO+",
            value: levelCounts["fcp"] || 0,
            itemStyle: { color: "#00ff00" },
          },
          {
            name: "FULL COMBO",
            value: levelCounts["fc"] || 0,
            itemStyle: { color: "#00cc00" },
          },
          // 其他分类的汇总，过滤掉已经列出的分类
          ...Object.keys(levelCounts)
            .filter((key) => !["app", "ap", "fcp", "fc"].includes(key))
            .map((key) => ({
              name: key === "" ? "无徽章" : key,
              value: levelCounts[key],
              itemStyle: { color: "grey" },
            })),
        ].filter((item) => item.value !== 0), // 移除值为0的数据项
      },
    ],
  };

  chart.setOption(option);
}

function initBadgePieChart2(
  dom: HTMLElement | null | undefined,
  dataList: any[]
) {
  const chart = echarts.init(dom);
  const levelCounts = calculateCounts(dataList, "fs");

  const option = {
    title: {
      text: "双人徽章",
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
        name: "徽章",
        type: "pie",
        radius: "50%",
        data: [
          {
            name: "FULL SYNC DX+",
            value: levelCounts["fsdp"] || 0,
            itemStyle: { color: "gold" },
          },
          {
            name: "FULL SYNC DX",
            value: levelCounts["fsd"] || 0,
            itemStyle: { color: "yellow" },
          },
          {
            name: "FULL SYNC+",
            value: levelCounts["fsp"] || 0,
            itemStyle: { color: "#00ff00" },
          },
          {
            name: "FULL SYNC",
            value: levelCounts["fs"] || 0,
            itemStyle: { color: "#00cc00" },
          },
          // 其他分类的汇总，过滤掉已经列出的分类
          ...Object.keys(levelCounts)
            .filter((key) => !["fsdp", "fsd", "fsp", "fs"].includes(key))
            .map((key) => ({
              name: key === "" ? "无徽章" : key,
              value: levelCounts[key],
              itemStyle: { color: "grey" },
            })),
        ].filter((item) => item.value !== 0), // 移除值为0的数据项
      },
    ],
  };

  chart.setOption(option);
}

export function initChart(
  doms: HTMLElement[],
  b15dataList: any[],
  b35DataList: any[]
) {
  const totalDataList = b15dataList.concat(b35DataList);
  initLevelPieChart(doms[0], totalDataList);
  initLevelDistributionChart(doms[1], totalDataList);
  initTypePieChart(doms[2], b15dataList);
  initRatePieChart(doms[3], totalDataList);
  initBadgePieChart1(doms[4], totalDataList);
  initBadgePieChart2(doms[5], totalDataList);
}
