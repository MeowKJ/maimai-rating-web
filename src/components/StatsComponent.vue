<template>
  <el-row :gutter="20" class="stats-row">
    <el-col :span="6" :md="4" :xs="12" v-for="(value, key) in userStats" :key="key">
      <el-card class="stat-card">
        <div class="stat-title">{{ formatStatTitle(key) }}</div>
        <div class="stat-value">{{ value }}</div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 饼状图容器 -->
  <el-row :gutter="20" class="stats-row">
    <el-col :span="24" :sm="12">
      <div ref="typeChart" style="width: 100%; height: 400px;"></div>
    </el-col>
    <el-col :span="24" :sm="12">
      <div ref="levelChart" style="width: 100%; height: 400px;"></div>
    </el-col>
    <el-col :span="24" :sm="12">
      <div ref="levelDistributionChart" style="width: 100%; height: 400px;"></div>
    </el-col>
    <el-col :span="24" :sm="12">
      <div ref="rateChart" style="width: 100%; height: 400px;"></div>
    </el-col>
    <el-col :span="24" :sm="12">
      <div ref="badgeChart1" style="width: 100%; height: 400px;"></div>
    </el-col>
    <el-col :span="24" :sm="12">
      <div ref="badgeChart2" style="width: 100%; height: 400px;"></div>
    </el-col>
  </el-row>
</template>

<script setup>
import {ref, onMounted, watch, computed, defineEmits, defineProps} from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  songData: {
    type: Array,
    required: true
  },
});
const emits = defineEmits(['update-stats']);
const typeChart = ref(null);
const levelChart = ref(null);
const levelDistributionChart = ref(null);
const rateChart = ref(null);
const badgeChart1 = ref(null);
const badgeChart2 = ref(null);

function calculateCounts(data, property) {
  return data.reduce((counts, item) => {
    const key = item[property];
    if (key !== undefined) {
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, {});
}


// 计算属性，用于转换和计算统计数据
const userStats = computed(() => {
  const b15Data = props.songData[0] || [];
  const b35Data = props.songData[1] || [];

  const b15stats = calculateStats(b15Data, 'b15');
  const b35stats = calculateStats(b35Data, 'b35');

  return {
    ...b15stats,
    ...b35stats
  };
});

// 触发更新统计数据的事件
watch(userStats, (newStats) => {
  emits('update-stats', {b15sum: newStats.b15sum, b35sum: newStats.b35sum});
}, {immediate: true});

// 根据 ref 初始化图表
onMounted(() => {
  if (!props.songData || props.songData.length === 0) {
    console.error('songData is not loaded');
    return;
  }
  initTypePieChart();
  initLevelPieChart();
  initLevelDistributionChart();
  initRatePieChart();
  initBadgePieChart1();
  initBadgePieChart2();
});


function calculateStats(data, prefix) {
  if (data.length === 0) return {max: 0, min: 0, avg: 0, sum: 0, range: 0, stdDev: 0};

  const sum = data.reduce((acc, song) => acc + song.ra, 0);
  const avg = sum / data.length;
  const variance = data.reduce((acc, song) => acc + Math.pow(song.ra - avg, 2), 0) / data.length;

  return {
    [`${prefix}max`]: data[0].ra,
    [`${prefix}min`]: data[data.length - 1].ra,
    [`${prefix}avg`]: avg.toFixed(2),
    [`${prefix}sum`]: sum,
    [`${prefix}range`]: (data[0].ra - data[data.length - 1].ra),
    [`${prefix}stdDev`]: Math.sqrt(variance).toFixed(2)
  };
}


function formatStatTitle(key) {
  // 格式化统计数据的标题
  const titles = {
    b15max: 'B15 最高分',
    b15min: 'B15 最低分',
    b15avg: 'B15 平均分',
    b15sum: 'B15 总分',
    b15range: 'B15极差',
    b15stdDev: 'b15标准差',
    b35max: 'B35 最高分',
    b35min: 'B35 最低分',
    b35avg: 'B35 平均分',
    b35sum: 'B35 总分',
    b35range: 'B35极差',
    b35stdDev: 'b35标准差',
  };
  return titles[key];
}

function initTypePieChart() {
  const pieChart = echarts.init(typeChart.value);
  const typeCounts = calculateCounts(props.songData[1], 'type');

  const option = {
    title: {
      text: 'B35中DX和SD分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '类型',
        type: 'pie',
        radius: '50%',
        data: [
          {value: typeCounts.DX, name: 'DX'},
          {value: typeCounts.SD, name: 'SD'}
        ],
      }
    ]
  };
  pieChart.setOption(option);

}

function initLevelDistributionChart() {
  const chart = echarts.init(levelDistributionChart.value);
  const LevelDistributionCounts = calculateCounts([...props.songData[0], ...props.songData[1]], 'level_label');

  // 颜色映射
  const levelColors = {
    'Basic': '#90EE90',     // 青草绿（淡绿色）
    'Advance': '#FFFFE0',   // 黄色（淡黄色）
    'Master': '#BA55D3',    // 不那么淡的紫色
    'Expert': '#FF6347',    // 不那么红的红色（番茄色）
    'Re:MASTER': '#dcbcfb'  // 淡紫色
  };

  const option = {
    title: {
      text: '乐曲难度分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '难度',
        type: 'pie',
        radius: '50%',
        data: Object.keys(LevelDistributionCounts).map(key => ({
          value: LevelDistributionCounts[key],
          name: key,
          // 设置对应的颜色
          itemStyle: {
            color: levelColors[key] || '#000' // 如果没有找到对应的颜色，使用默认颜色
          }
        }))
      }
    ]
  };
  chart.setOption(option);
}


function initLevelPieChart() {
  const chart = echarts.init(levelChart.value);
  const levelCounts = calculateCounts([...props.songData[0], ...props.songData[1]], 'level');

  const option = {
    title: {
      text: '乐曲等级分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '等级',
        type: 'pie',
        radius: '50%',
        data: Object.keys(levelCounts).map(key => ({value: levelCounts[key], name: key}))
      }
    ]
  };

  chart.setOption(option);
}


function initRatePieChart() {
  const chart = echarts.init(rateChart.value);
  const rateCounts = calculateCounts([...props.songData[0], ...props.songData[1]], 'rate');

  const rateColors = {
    'sssp': new echarts.graphic.LinearGradient(1, 0, 0, 1, [
      {offset: 0, color: '#FF0000'},     // 番茄色（深红色）
      {offset: 0.15, color: '#FF4500'},  // 橙红色
      {offset: 0.3, color: '#FFA500'},   // 橙色
      {offset: 0.45, color: '#FFD700'},  // 金色
      {offset: 0.6, color: '#FFFF00'},   // 鲜黄色
      {offset: 1, color: '#008000'}      // 绿色`
    ]),

    'sss': '#ff6699', // 浅红色
    'ssp': '#FFD700', // 金色
    'ss': '#FFFF00',  // 黄色
    'sp': '#DAA520',  // 土黄色
    's': '#8B4513',   // 土色
    // 默认颜色为淡灰色
  };
  const option = {
    title: {
      text: '乐曲评级分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '评级',
        type: 'pie',
        radius: '50%',
        data: Object.keys(rateCounts).map(key => {
          let color = rateColors[key] || '#D3D3D3'; // 使用预定义的颜色，如果没有则使用淡灰色
          return {value: rateCounts[key], name: key, itemStyle: {color: color}};
        })
      }
    ]
  };
  chart.setOption(option);
}


function initBadgePieChart1() {
  const chart = echarts.init(badgeChart1.value);
  const levelCounts = calculateCounts([...props.songData[0], ...props.songData[1]], 'fc');

  const option = {
    title: {
      text: '徽章获得情况',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '徽章',
        type: 'pie',
        radius: '50%',
        data: [
          {
            name: 'ALL PERFECT+',
            value: levelCounts['app'] || 0,
            itemStyle: {color: 'gold'}
          },
          {
            name: 'ALL PERFECT',
            value: levelCounts['ap'] || 0,
            itemStyle: {color: 'yellow'}
          },
          {
            name: 'FULL COMBO+',
            value: levelCounts['fcp'] || 0,
            itemStyle: {color: '#00ff00'}
          },
          {
            name: 'FULL COMBO',
            value: levelCounts['fc'] || 0,
            itemStyle: {color: '#00cc00'}
          },
          // 其他分类的汇总，过滤掉已经列出的分类
          ...Object.keys(levelCounts)
              .filter(key => !['app', 'ap', 'fcp', 'fc'].includes(key))
              .map(key => ({
                name: key === '' ? '无徽章' : key,
                value: levelCounts[key],
                itemStyle: {color: 'grey'}
              }))
        ].filter(item => item.value !== 0) // 移除值为0的数据项
      }
    ]
  };

  chart.setOption(option);
}


function initBadgePieChart2() {
  const chart = echarts.init(badgeChart2.value);
  const levelCounts = calculateCounts([...props.songData[0], ...props.songData[1]], 'fs');

  const option = {
    title: {
      text: '拼机徽章获得情况',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '徽章',
        type: 'pie',
        radius: '50%',
        data: [
          {
            name: 'FULL SYNC DX+',
            value: levelCounts['fsdp'] || 0,
            itemStyle: {color: 'gold'}
          },
          {
            name: 'FULL SYNC DX',
            value: levelCounts['fsd'] || 0,
            itemStyle: {color: 'yellow'}
          },
          {
            name: 'FULL SYNC+',
            value: levelCounts['fsp'] || 0,
            itemStyle: {color: '#00ff00'}
          },
          {
            name: 'FULL SYNC',
            value: levelCounts['fs'] || 0,
            itemStyle: {color: '#00cc00'}
          },
          // 其他分类的汇总，过滤掉已经列出的分类
          ...Object.keys(levelCounts)
              .filter(key => !['fsdp', 'fsd', 'fsp', 'fs'].includes(key))
              .map(key => ({
                name: key === '' ? '无徽章' : key,
                value: levelCounts[key],
                itemStyle: {color: 'grey'}
              }))
        ].filter(item => item.value !== 0) // 移除值为0的数据项
      }
    ]
  };

  chart.setOption(option);
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
