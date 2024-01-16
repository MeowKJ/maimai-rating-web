<template>
  <el-container class="container" v-loading.fullscreen.lock="fullscreenLoading">
    <el-header class="user-header">
      <UserComponent />
    </el-header>

    <el-main>
      <div v-if="isLoading"><LoadingComponent /></div>
      <div v-else-if="isSuccess">
        <!-- 显示其他获取的数据 -->
        <el-row
          v-for="(songs, i) in totalSongsComputed"
          class="card-row"
          :gutter="20"
          justify="space-evenly"
        >
          <!-- 在每个songs数组前添加一个标题 -->
          <el-row class="category-title-row">
            <el-col :span="24">
              <div class="category-title">
                <span class="bx-title">{{
                  i === 0 ? "B15   " : "B35   "
                }}</span>
                <span class="bx-score">{{ i === 0 ? b15sum : b35sum }}</span>
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
            :key="(i + 1) * index"
          >
            <song-card :song="song" :index="index"></song-card>
          </el-col>
          <el-divider border-style="dashed" />
        </el-row>
        <StatsComponent :b15-data="b15Songs" :b35-data="b35Songs" />
      </div>
      <div v-else>
        <el-result
          icon="error"
          title="出错了"
          :sub-title="errorMessage"
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
          <el-tooltip content="GPL-3.0开源" effect="light" placement="top">
            <a
              href="https://github.com/MeowKJ/maimai-rating-web"
              target="_blank"
              style="margin-right: 25px"
              ><i class="fab fa-github"></i
            ></a>
          </el-tooltip>
          <el-tooltip content="欢迎加入QQ频道" effect="light" placement="top">
            <a href="https://pd.qq.com/s/6jkk63q6d" target="_blank"
              ><i class="fab fa-qq"></i
            ></a>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";

import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { toPng } from "html-to-image";

import { getDataFromDivingFish, getUserDataFromLuoXue } from "./utils/api";
import { useUserStore } from "./store/user";
import { isValidNumber } from "./utils/tools";

import type { Ref } from "vue";
import type { SongData } from "./types";

import "element-plus/theme-chalk/display.css";

import SongCard from "./components/SongCard.vue";
import StatsComponent from "./components/StatsComponent.vue";
import UserComponent from "./components/UserComponent.vue";
import LoadingComponent from "./components/LoadingComponent.vue";

const route = useRoute();
const userStore = useUserStore();

const { username, userData, isLoading, b15sum, b35sum } =
  storeToRefs(userStore);

const b15Songs: Ref<SongData[]> = ref([]);
const b35Songs: Ref<SongData[]> = ref([]);

const isSuccess = ref(false);
const errorMessage = ref("");

const fullscreenLoading = ref(false);

const totalSongsComputed = computed(() => {
  const totalSongs: SongData[][] = [];
  totalSongs.push(b15Songs.value);
  totalSongs.push(b35Songs.value);
  return totalSongs;
});

watch(
  () => route.params.username,
  (newUsername) => {
    if (newUsername) {
      username.value = newUsername as string;
      console.log("username:", username.value);
      fetchData();
    }
  }
);

async function fetchData() {
  try {
    if (!username.value) {
      isSuccess.value = false;
      errorMessage.value = "发现用户名为空";
      return;
    }

    isLoading.value = true;
    b15Songs.value = [];
    b35Songs.value = [];

    let data = null;
    if (isValidNumber(username.value)) {
      data = await getUserDataFromLuoXue(username.value);
    } else {
      data = await getDataFromDivingFish(username.value);
    }

    if (data == null) {
      isLoading.value = false;
      isSuccess.value = false;
      errorMessage.value = "无法获取你的分数";
      return;
    }

    console.log("获取到的数据：", data);

    userData.value = data.userData;
    b15Songs.value = data.songData.b15;
    b35Songs.value = data.songData.b35;
    isSuccess.value = true;
  } catch (error) {
    isLoading.value = false;
    isSuccess.value = false;
    errorMessage.value =
      "无法获取你的分数，请检查用户名是否正确，同时确保没有设置隐私保护";
    console.error("出错：", error);
  }
  isLoading.value = false;
}
</script>

<style scoped>
.user-header {
  margin-bottom: 100px;
  align-items: center;
  justify-content: center;
}
.container {
  margin: 0;
  padding: 30px;
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
