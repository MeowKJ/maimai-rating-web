<template>
  <el-container class="container">
    <el-header class="user-header">
      <el-row>
        <el-col class="title" :span=6 :xs="24">
          Maimai的频道网页查分器
        </el-col>
        <el-col :span="6" :xs="24" class="header-right">
          <el-input
              v-model="username"
              @change="goTo()"
              placeholder="请输入水鱼用户名"
              class="input-with-select"
          >
            <template #prepend>
              用户名：
            </template>
            <template #append>
              <el-button :icon="Search" @click="goTo()" :disabled="isFetchData" circle/>
              <el-button @click="captureScreenshot">截图</el-button>

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
                <span class="bx-score">{{ i === 0 ? userStats.b15sum : userStats.b35sum }}</span>
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
        <StatsComponent :songData="totalSongsComputed" @update-stats="handleStatsUpdate"/>
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
    </el-main>
    <el-footer class="custom-footer">
      <el-row type="flex" justify="center" style="width: 100%">
        <el-col :span="8" class="footer-text">
          <span>Developed By Meow</span>
        </el-col>
        <el-col :span="12" class="footer-icons">
          <el-tooltip
              content="求求点个⭐吧/GPL-3.0开源"
              effect="light"
              placement="top"
          >
            <a href="https://github.com/MeowKJ/maimai-rating-web" target="_blank" style="margin-right: 25px"><i
                class="fab fa-github"></i></a>

          </el-tooltip>
          <el-tooltip
              content="欢迎加入QQ频道"
              effect="light"
              placement="top"
          >
            <a href="https://pd.qq.com/s/6jkk63q6d" target="_blank"><i class="fab fa-qq"></i></a>

          </el-tooltip>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script setup>
import {ref, onMounted, watch, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import html2canvas from 'html2canvas';
import getData from './utils/api.js';
import {Search} from '@element-plus/icons-vue';

import 'element-plus/theme-chalk/display.css'

import SongCard from './components/SongCard.vue';
import StatsComponent from "./components/StatsComponent.vue";

const router = useRouter();

const route = useRoute(); // 使用 useRoute
const isLoading = ref(true);
const username = ref('');
const user = ref({
  nickname: '',
  rating: 0,
});

const userStats = ref({
  b15sum: 0,
  b35sum: 0
})

const totalSongs = ref([]);
const isFetchData = ref(false);
const isSuccess = ref(false);
const errorMessage = ref('');
const tempArr = ref([]);


const totalSongsComputed = computed(() => {
  return totalSongs.value.map(song => {
    return song;
  });
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

function handleStatsUpdate(stats) {
  console.log("B15 Sum:", stats.b15sum);
  console.log("B35 Sum:", stats.b35sum);
  userStats.value.b15sum = stats.b15sum
  userStats.value.b35sum = stats.b35sum
}

function goTo() {
  console.log('goTo use username: ', username.value)
  router.push({path: `/${username.value}`});
  isSuccess.value = false;

}

async function fetchData() {
  console.log('fetchData use username: ', username.value)
  try {
    if (!username.value) {
      isSuccess.value = false
      errorMessage.value = '发现用户名为空';
      return
    }
    isLoading.value = true;
    totalSongs.value = [];
    user.value = {
      nickname: username.value,
      rating: 0,
    };

    const data = await getData(username.value);
    console.log('获取到的数据：', data);

    const dxData = data['charts']['dx'] || []; // 防止未定义的数据
    const sdData = data['charts']['sd'] || []; // 防止未定义的数据

    totalSongs.value.push(dxData);
    totalSongs.value.push(sdData);
    // 更新 user 对象
    user.value = {
      nickname: data['nickname'],
      rating: data['rating'],
    };
    isSuccess.value = true;
  } catch (error) {
    isSuccess.value = false;
    errorMessage.value = '无法获取你的分数，请检查用户名是否正确，同时确保没有设置隐私保护';
    console.error('出错：', error);
  }
  isLoading.value = false;
}

async function captureScreenshot() {
  try {
    const element = document.querySelector('.container');
    await Promise.all(Array.from(element.getElementsByTagName('img')).map(img => {
      return new Promise((resolve, reject) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = reject;
        }
      });
    }));

    const canvas = await html2canvas(element);
    const image = canvas.toDataURL('image/png');
    downloadImage(image, 'screenshot.png');
  } catch (error) {
    console.error('截图出错：', error);
  }
}


function downloadImage(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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

.custom-footer {
  display: flex; /* 设置为Flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  border-radius: 50px;
  background-color: #333; /* 背景颜色 */
  color: white; /* 文字颜色 */
  padding: 10px 0; /* 上下填充 */
}

.footer-icons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-icons a {
  color: white; /* 图标颜色 */
  margin: 0 10px; /* 图标间距 */
}

.footer-icons i {
  font-size: 25px;

}

.footer-icons a:hover {
  color: #aaa; /* 鼠标悬浮时的颜色 */
}

</style>

