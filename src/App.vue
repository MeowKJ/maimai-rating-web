<template>
  <el-container class="container">
    <el-header class="user-header">
      <el-row>
        <el-col class="title" :span=6 :xs="10">
          Maimai的频道网页查分器
        </el-col>
        <el-col :span="6" :xs="14" class="header-right">
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
          <span>昵称：{{ nickname }}</span>
        </el-col>
        <el-col class="rating" :span="6" :xs="16">
          DXRating:{{ rating }}
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
          <el-row v-for="(songs, i) in totalSongs" class="card-row" :gutter="20">
            <el-col
                class="card-col"
                v-for="(song, index) in songs"
                :span="12"
                :sm="12"
                :md="8"
                :xl="8"
                :key="(i+1)*index"
            >
              <el-card body-class="song-card" shadow="hover">
                <el-row>
                  <!-- 左边放图片 -->
                  <el-col :span="24" :sm="8" :lg="6" :xl="6">
                    <img :src="generateImageUrl(song['song_id'])" alt="Card Image" class="full-width-image">
                  </el-col>

                  <!-- 右边放标题和其他数据 -->
                  <el-col :span="24" :sm="16" :lg="18" :xl="18">
                    <el-row class="card-content">
                      <el-col>
                        <el-row class="song-header" :class="getBackgroundColorClass(song['level_index'])">
                          <el-col :span="4">{{ song['ra'] }}</el-col>
                          <el-col :span="16">{{ song['level_label'] }} ({{ song['ds'] }})</el-col>
                          <el-col :span="4" class="song-header-item">#{{ index + 1 }}</el-col>
                        </el-row>
                      </el-col>
                      <el-col class="song-title">{{ song.title }}</el-col>
                      <el-col>
                        <el-row class="rate-content">
                          <el-col :span="12" class="rate-item achievements-text">
                            {{ Number(song['achievements']).toFixed(4) }}
                          </el-col>
                          <el-col :span="6" class="rate-item">
                            <img :src="generateRateUrl(song['rate'])" alt="" class="rate-image">
                          </el-col>
                          <el-col :span="3" class="rate-item">
                            <img :src="generateBadgeUrl(song['fc'])" alt="" class="rate-image">
                          </el-col>
                          <el-col :span="3" class="rate-item">
                            <img :src="generateBadgeUrl(song['fs'])" alt="" class="rate-image">
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col>
                        <el-row class="song-footer">
                          <el-col :span="4" class="song-footer-item">{{ song['type'] }}</el-col>
                          <el-col :span="12" class="song-footer-item">{{ song['dxScore'] }}</el-col>
                          <el-col :span="8" class="song-footer-item">id:{{ song['song_id'] }}</el-col>
                        </el-row>
                      </el-col>
                    </el-row>

                  </el-col>
                </el-row>
              </el-card>
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
  </el-container>
</template>
<script setup>
import {ref, onMounted, watch} from 'vue';
import {useRoute} from 'vue-router'; // 引入 useRoute
import getData from './utils/api.js';
import {Search} from '@element-plus/icons-vue';

const route = useRoute(); // 使用 useRoute
const isLoading = ref(true);
const username = ref('');
const nickname = ref('');
const rating = ref(0);
const totalSongs = ref([]);
const isFetchData = ref(false);
const isSuccess = ref(false);
const errorMessage = ref('');
const tempArr = ref([]);

const font = ref({
  color: 'rgba(255, 255, 255, .15)',
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
  window.location.href = `/${username.value}`;
}

async function fetchData() {
  try {
    if (!username.value) {
      return;
    }
    totalSongs.value = [];
    nickname.value = '';
    rating.value = 0;
    isLoading.value = true;
    const data = await getData(username.value);
    console.log('获取到的数据：', data);
    nickname.value = data['nickname'];
    rating.value = data['rating'];
    totalSongs.value.push(data['charts']['dx']);
    totalSongs.value.push(data['charts']['sd']);
    isSuccess.value = true;
  } catch (error) {
    isSuccess.value = false;
    errorMessage.value = '无法获取你的分数，请检查用户名是否正确，同时确保没有设置隐私保护';
    console.error('出错：', error);
  }
  isLoading.value = false;
}


function generateImageUrl(songId) {
  return `https://lxns.org/maimai/jacket/${songId % 10000}.png`;
}

function generateRateUrl(rate) {
  return `https://maimai.lxns.net/assets/maimai/music_rank/${rate}.webp`;
}

function generateBadgeUrl(badge) {
  if (!badge) {
    badge = 'blank';
  }
  return `https://maimai.lxns.net/assets/maimai/music_icon/${badge}.webp`;
}

function getBackgroundColorClass(levelIndex) {
  switch (levelIndex) {
    case 0:
      return 'basic-background';
    case 1:
      return 'advance-background';
    case 2:
      return 'expert-background';
    case 3:
      return 'master-background';
    case 4:
      return 'remaster-background';
    default:
      return '';
  }
}
</script>

<style scoped>
@import url('./css/color.css');


.full-width-image {
  width: 100%;
  display: block;
}


.achievements-text {
  text-align: left;
  font-size: 20px;
  font-weight: bold;
}

.song-header {
  font-size: 0.8em;
  color: #f9f9f9;
  border-radius: 2px;
  font-weight: bold;
  display: flex;
}

.song-footer {
  border-top: #1a1a1a solid 1px;
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 5px;
  padding-right: 5px;
  font-weight: bold;
  text-align: left;
  font-size: 10px;
  color: #242424;
  margin-top: 10px;
}


.rate-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover; /* 图片完全填充父容器，可能会裁剪部分内容 */
  display: block;
}

.rate-content {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.song-title {
  text-align: left;
  font-size: 1.0em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}

.card-content {
  height: 100%;
  width: 100%;
  padding-left: 1px;
  padding-right: 1px;
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

.title {
  text-align: left;
  font-size: 1.3em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

</style>

