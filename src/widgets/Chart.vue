<template>
  <div ref="chartContainer" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { EChartsOption } from "echarts";
declare const echarts: typeof import("echarts");

// Props 接收一个初始化图表的函数
const props = defineProps<{
  option: EChartsOption;
}>();
const chartContainer = ref(null);

onMounted(() => {
  if (chartContainer.value) {
    const pieChart = echarts.init(chartContainer.value);
    pieChart.setOption(props.option);
  }
});
</script>
