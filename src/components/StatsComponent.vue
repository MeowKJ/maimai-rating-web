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
    <el-col
      :span="24"
      :sm="index > 9 ? 24 : 12"
      v-for="(o, index) in optionList"
      :key="index"
    >
      <Chart :option="o" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { functionList } from "@/utils/charts";

import { useUserStore } from "../store/user";
import type { CombinedStatsData, SongData } from "../types";
import Chart from "@/widgets/Chart.vue";
const userStore = useUserStore();

const { b15sum, b35sum } = storeToRefs(userStore);

const props = defineProps<{
  b15Data: SongData[];
  b35Data: SongData[];
}>();

const optionList = computed(() => {
  return functionList(props.b15Data, props.b35Data);
});

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
