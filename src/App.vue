<template>
  <el-container class="container" v-loading.fullscreen.lock="fullscreenLoading">
    <el-header class="user-header">
      <UserComponent />
    </el-header>
    <el-main class="main">
      <LoadingComponent v-if="currentStatus === Status.Loading" />
      <div v-else-if="currentStatus === Status.Display">
        <SongComponet :total-songs="totalSongsComputed" />
        <StatsComponent :b15-data="b15Songs" :b35-data="b35Songs" />
      </div>
      <MessageComponent
        v-else-if="currentStatus === Status.Input || currentStatus === Status.Error"
        :icon="statusIcon"
        :error-message="errorMessage"
      />
    </el-main>
    <FooterComponent :is-success="currentStatus === Status.Display" />
  </el-container>
  <BackgroundComponent />
  <ToTop />
</template>

<script setup lang="ts">
/*
  引入 Vue 和相关的类型
*/
import type { Ref } from "vue";
import type { SongData } from "@/utils/api/types";

import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user";

import { DataProviderFactory } from "@/utils/api/DataProviderFactory";

import ToTop from "./widgets/ToTop.vue";
/*
  引入状态枚举
*/
enum Status {
  Input = "input",
  Loading = "loading",
  Display = "display",
  Error = "error"
}

/*
  获取当前路由对象
*/
const route = useRoute();

/*
  获取用户存储中的相关数据
*/
const userStore = useUserStore();
const { username, userData, fullscreenLoading } = storeToRefs(userStore);

/*
  定义状态相关的响应式变量
*/
const currentStatus = ref<Status>(Status.Input); // 当前状态
const errorMessage = ref("请输入 <用户名> ");
const statusIcon = ref("info");

/*
  定义存储歌曲数据的响应式变量
*/
const b15Songs: Ref<SongData[]> = ref([]);
const b35Songs: Ref<SongData[]> = ref([]);

/*
  计算属性：总歌曲数据
*/
const totalSongsComputed = computed(() => {
  const totalSongs: SongData[][] = [];
  totalSongs.push(b15Songs.value);
  totalSongs.push(b35Songs.value);
  return totalSongs;
});

/*
  监听路由参数中的用户名变化，并根据新用户名获取数据
*/
watch(
  () => route.params.username,
  (newUsername) => {
    if (newUsername) {
      username.value = newUsername as string;
      console.log("username:", username.value);
      if (!username.value) {
        currentStatus.value = Status.Error;
        errorMessage.value = "发现用户名为空";
        statusIcon.value = "error";
        return;
      }
      fetchData();
    }
  }
);

/*
  异步函数：获取数据
*/
async function fetchData() {
  try {
    currentStatus.value = Status.Loading;
    b15Songs.value = [];
    b35Songs.value = [];

    /*
      根据用户名创建数据提供者
    */
    const provider = DataProviderFactory.createProvider(username.value);
    if (!provider) {
      throw new Error("无法创建数据提供者");
    }

    /*
      获取 Best50 数据
    */
    const data = await provider.getBest50Data();

    if (data == null) {
      currentStatus.value = Status.Error;
      statusIcon.value = "error";
      errorMessage.value =
        "无法获取你的分数，请检查用户名是否正确，同时确保没有设置隐私保护";
      return;
    }

    console.log("Get Data:", data);

    /*
      更新用户数据和歌曲数据
    */
    userData.value = data.userData;
    b15Songs.value = data.best50SongsData.b15;
    b35Songs.value = data.best50SongsData.b35;
    currentStatus.value = Status.Display;
  } catch (error) {
    currentStatus.value = Status.Error;
    statusIcon.value = "error";
    errorMessage.value =
      "无法获取你的分数，请检查用户名是否正确，同时确保没有设置隐私保护";
    console.error("出错：", error);
  }
}

/*
  引入 Element Plus 的样式
*/
import "element-plus/theme-chalk/display.css";
</script>

<style scoped>
/* 用户头部样式 */
.user-header {
  margin-bottom: 60px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  z-index: 5;
}
/* 容器样式 */
.container {
  margin: 0;
  padding: 5px; /* 初始 padding 为 0 */
  height: 100%;
  width: 100%;
  z-index: 2;
}

/* 中尺寸屏幕 */
@media screen and (min-width: 600px) {
  .container {
    padding-left: 20px;
    padding-right: 20px;
  }
}

/* 大尺寸屏幕 */
@media screen and (min-width: 1200px) {
  .container {
    padding-left: 100px;
    padding-right: 100px;
  }
}

/* 主体样式 */
.main {
  z-index: 5;
}
</style>
