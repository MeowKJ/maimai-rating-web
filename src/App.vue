<template>
  <el-container class="container">
    <el-header class="user-header">
      <el-row>
        <el-col class="title" :span=6 :xs="24">
          Maimai的频道网页查分器
        </el-col>
        <el-col :span="6" :xs="14" class="header-right hidden-md-and-down">
          <el-input
              v-model="username"
              placeholder="请输入水鱼用户名"
              class="input-with-select"
          >
            <template #prepend>
              用户名：
            </template>
            <template #append>
              <el-button :icon="Search" @click="goTo()" :disabled="isFetchData" circle/>
            </template>
          </el-input>
        </el-col>
        <el-col class="nickname" :span="6" :xs="8">
          <span>昵称：{{ user.nickname }}</span>
        </el-col>
        <el-col class="rating" :span="6" :xs="16">
          DXRating:{{ user.rating }}
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-watermark :font="font" :content="['MaiMai的频道']">
        <!-- 显示异步获取的数据 -->
        <div v-if="isLoading">

          <el-row :gutter="40">
            <el-col
                class="card-col"
                v-for="i in tempArr"
                :span="12"
                :sm="12"
                :md="8"
                :xl="8"
                :key="(i)"
            >
              <el-skeleton :rows="4" animated/>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="isSuccess">
          <!-- 显示其他获取的数据 -->
          <el-row v-for="(songs, i) in totalSongsComputed" class="card-row" :gutter="20" justify="space-evenly">
            <!-- 在每个songs数组前添加一个标题 -->
            <el-row class="category-title-row">
              <el-col :span="24">
                <div class="category-title">
                  <span class='bx-title'>{{ i === 0 ? 'B15   ' : 'B35   ' }}</span>
                  <span class='bx-score'>{{ i === 0 ? userStats.b15sum : userStats.b35sum }}</span>
                </div>
              </el-col>
            </el-row>
            <el-col
                class="card-col"
                v-for="(song, index) in songs"
                :span="12"
                :sm="12"
                :md="8"
                :xl="5"
                :key="(i+1)*index"
            >
              <song-card :song="song" :index="index"></song-card>
            </el-col>
            <el-divider border-style="dashed"/>
          </el-row>
        </div>
        <div v-else>
          <el-result
              icon="error"
              title="出错了"
              :sub-title=errorMessage
              style=""
          >
            <template #extra>
              <el-button type="primary">Back</el-button>
            </template>
          </el-result>
        </div>
      </el-watermark>
    </el-main>
    <el-footer>
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6" v-for="(value, key) in userStats" :key="key">
          <el-card class="stat-card">
            <div class="stat-title">{{ formatStatTitle(key) }}</div>
            <div class="stat-value">{{ value }}</div>
          </el-card>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script setup>
import {ref, onMounted, watch, computed} from 'vue';
import {useRoute} from 'vue-router'; // 引入 useRoute

import getData from './utils/api.js';
import {Search} from '@element-plus/icons-vue';

import 'element-plus/theme-chalk/display.css'

import SongCard from './components/SongCard.vue';


import {useRouter} from 'vue-router';

const router = useRouter();

const route = useRoute(); // 使用 useRoute
const isLoading = ref(true);
const username = ref('');
const user = ref({
  nickname: '',
  rating: 0,
  b15max: 0,
  b15min: 0,
  b15avg: 0,
  b15sum: 0,
  b35max: 0,
  b35min: 0,
  b35avg: 0,
  b35sum: 0,
});

const totalSongs = ref([]);

const isFetchData = ref(false);
const isSuccess = ref(false);
const errorMessage = ref('');
const tempArr = ref([]);

const font = ref({
  color: 'rgba(255, 255, 255, .15)',
});

const totalSongsComputed = computed(() => {
  // 处理 totalSongs 的逻辑
  return totalSongs.value.map(song => {
    // 一些逻辑
    return song;
  });
});

const userStats = computed(() => {
  return {
    b15max: user.value.b15max || 0,
    b15min: user.value.b15min || 0,
    b15avg: user.value.b15avg !== undefined ? user.value.b15avg.toFixed(2) : '0.00',
    b15sum: user.value.b15sum || 0,
    b35max: user.value.b35max || 0,
    b35min: user.value.b35min || 0,
    b35avg: user.value.b35avg !== undefined ? user.value.b35avg.toFixed(2) : '0.00',
    b35sum: user.value.b35sum || 0,
  };
});


watch(() => route.params.username, (newUsername) => {
  if (newUsername) {
    username.value = newUsername;
    console.log('username:', username.value);
    fetchData();
  }
});

onMounted(() => {
  for (let i = 0; i < 50; i++) {
    tempArr.value.push(i);
  }
});

function goTo() {
  // 使用 router.push 进行路由跳转
  router.push({path: `/${username.value}`});
}

async function fetchData() {
  try {
    if (!username.value) {
      return;
    }
    totalSongs.value = [];
    user.value = {
      nickname: username.value,
    };

    isLoading.value = true;
    const data = await getData(username.value);
    console.log('获取到的数据：', data);

    const dxData = data['charts']['dx'] || []; // 防止未定义的数据
    const sdData = data['charts']['sd'] || []; // 防止未定义的数据

    totalSongs.value.push(dxData);
    totalSongs.value.push(sdData);

    const b15stats = calculateStats(dxData, 'b15');
    const b35stats = calculateStats(sdData, 'b35');
    console.log('b15stats:', b15stats);
    // 更新 user 对象
    user.value = {
      nickname: data['nickname'],
      rating: data['rating'],
      ...b15stats,
      ...b35stats
    };
    isSuccess.value = true;
  } catch (error) {
    isSuccess.value = false;
    errorMessage.value = '无法获取你的分数，请检查用户名是否正确，同时确保没有设置隐私保护';
    console.error('出错：', error);
  }
  isLoading.value = false;
}

// 计算统计数据的函数
function calculateStats(data, prefix) {
  const max = data.length > 0 ? data[0].ra : 0;
  const min = data.length > 0 ? data[data.length - 1].ra : 0;
  const sum = data.reduce((acc, song) => acc + song.ra, 0);
  const avg = data.length > 0 ? sum / data.length : 0;

  return {
    [`${prefix}max`]: max,
    [`${prefix}min`]: min,
    [`${prefix}avg`]: avg,
    [`${prefix}sum`]: sum
  };
}

function formatStatTitle(key) {
  // 格式化统计数据的标题
  const titles = {
    b15max: 'B15 最高分',
    b15min: 'B15 最低分',
    b15avg: 'B15 平均分',
    b15sum: 'B15 总分',
    b35max: 'B35 最高分',
    b35min: 'B35 最低分',
    b35avg: 'B35 平均分',
    b35sum: 'B35 总分',
  };
  return titles[key] || key;
}
</script>

<style scoped>
@import url('./css/color.css');

.title {
  text-align: left;
  font-size: 1.3em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {

  .title {
    text-align: center;
  }
}


.nickname {
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rating {
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-header {
  align-items: center;
  justify-content: center;
}


.container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.card-col {
  z-index: 10;
  margin-bottom: 30px;
  transition: transform 0.3s ease; /* Add a transition for the transform property */
}

.card-col:hover {
  transform: scale(1.05); /* Scale the card on hover */
}

.stats-row {
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

.category-title-row {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;

  display: flex;
  align-items: center; /* 垂直居中对齐 */
}

.bx-title {
  font-size: 1.6em;
  font-weight: bold;
}

.bx-score {
  font-size: 1.3em;
}
</style>

