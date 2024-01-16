<template>
  <el-row :gutter="20" class="stats-row">
    <el-col
      :span="6"
      :md="4"
      :xs="12"
      v-for="(value, key) in userStats"
      :key="key"
    >
      <el-card class="stat-card">
        <div class="stat-title">{{ formatStatTitle(key) }}</div>
        <div class="stat-value">{{ value }}</div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 饼状图容器 -->
  <el-row :gutter="20" class="stats-row">
    <el-col :span="24" :sm="12">
      <div ref="typeChart" style="width: 100%; height: 400px"></div>
    </el-col>
    <el-col :span="24" :sm="12">
      <div ref="levelChart" style="width: 100%; height: 400px"></div>
    </el-col>
    <el-col :span="24" :sm="12">
      <div
        ref="levelDistributionChart"
        style="width: 100%; height: 400px"
      ></div>
    </el-col>
    <el-col :span="24" :sm="12">
      <div ref="rateChart" style="width: 100%; height: 400px"></div>
    </el-col>
    <el-col :span="24" :sm="12">
      <div ref="badgeChart1" style="width: 100%; height: 400px"></div>
    </el-col>
    <el-col :span="24" :sm="12">
      <div ref="badgeChart2" style="width: 100%; height: 400px"></div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";

import { initChart } from "../utils/charts";
import { useUserStore } from "../store/user";
import type { CombinedStatsData, SongData } from "../types";
const userStore = useUserStore();

const { b15sum, b35sum } = storeToRefs(userStore);

const props = defineProps<{
  b15Data: SongData[];
  b35Data: SongData[];
}>();

const typeChart = ref<HTMLElement | null>(null);
const levelChart = ref<HTMLElement | null>(null);
const levelDistributionChart = ref<HTMLElement | null>(null);
const rateChart = ref<HTMLElement | null>(null);
const badgeChart1 = ref<HTMLElement | null>(null);
const badgeChart2 = ref<HTMLElement | null>(null);

const userStats = computed(() => {
  const b15stats = calculateStats(props.b15Data, "b15");
  const b35stats = calculateStats(props.b35Data, "b35");
  return {
    ...b15stats,
    ...b35stats,
  } as CombinedStatsData;
});

onMounted(() => {
  if (!props.b15Data && !props.b35Data) {
    console.error("songData is not loaded");
    return;
  }
  b15sum.value = userStats.value.b15sum;
  b35sum.value = userStats.value.b35sum;
  // 确保所有的 DOM 元素都不为 null
  const charts = [
    typeChart.value,
    levelChart.value,
    levelDistributionChart.value,
    rateChart.value,
    badgeChart1.value,
    badgeChart2.value,
  ].filter((chart) => chart !== null) as HTMLElement[];

  // 只有在所有的 ref 都不为 null 时调用 initChart
  if (charts.length === 6) {
    initChart(charts, props.b15Data, props.b35Data);
  } else {
    console.error("Some charts are not loaded");
  }
});
function calculateStats(data: any[], prefix: string) {
  if (data.length === 0)
    return { max: 0, min: 0, avg: 0, sum: 0, range: 0, stdDev: 0 };

  const sum = data.reduce((acc: any, song: { ra: any }) => acc + song.ra, 0);
  const avg = sum / data.length;
  const variance =
    data.reduce(
      (acc: number, song: { ra: number }) => acc + Math.pow(song.ra - avg, 2),
      0
    ) / data.length;

  return {
    [`${prefix}max`]: data[0].ra,
    [`${prefix}min`]: data[data.length - 1].ra,
    [`${prefix}avg`]: avg.toFixed(2),
    [`${prefix}sum`]: sum,
    [`${prefix}range`]: data[0].ra - data[data.length - 1].ra,
    [`${prefix}stdDev`]: Math.sqrt(variance).toFixed(2),
  };
}

function formatStatTitle(key: string | number) {
  // 格式化统计数据的标题
  const titles = {
    b15max: "B15 最高分",
    b15min: "B15 最低分",
    b15avg: "B15 平均分",
    b15sum: "B15 总分",
    b15range: "B15极差",
    b15stdDev: "b15标准差",
    b35max: "B35 最高分",
    b35min: "B35 最低分",
    b35avg: "B35 平均分",
    b35sum: "B35 总分",
    b35range: "B35极差",
    b35stdDev: "b35标准差",
  };
  return titles[key as keyof typeof titles];
}
</script>

<style scoped>
.stats-row {
  padding-top: 40px;
  text-align: center;
}

.stat-card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 20px;
  padding: 5px;
}

.stat-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.stat-title {
  font-size: 1em;
  color: #333;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.5em;
  font-weight: bold;
  color: #000;
}
</style>
