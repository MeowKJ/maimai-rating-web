<template>
  <el-container class="container" v-loading.fullscreen.lock="fullscreenLoading">
    <el-header class="user-header">
      <UserComponent />
    </el-header>
    <el-main class="main">
      <LoadingComponent v-if="isLoading" />
      <div v-else-if="isSuccess">
        <SongComponet :total-songs="totalSongsComputed" />
        <StatsComponent :b15-data="b15Songs" :b35-data="b35Songs" />
      </div>
      <MessageComponent
        v-else
        :icon="statusIcon"
        :error-message="errorMessage"
      />
    </el-main>
    <FooterComponent :is-success="isSuccess" />
  </el-container>
  <BackgroundComponent />
  <ToTop />
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user";
import type { Ref } from "vue";
import type { SongData } from "@/utils/api/types";
import ToTop from "@/widgets/ToTop.vue";
import { DataProviderFactory } from "@/utils/api/DataProviderFactory";

const route = useRoute();
const userStore = useUserStore();

const { isLoading, username, userData, fullscreenLoading } =
  storeToRefs(userStore);

const isSuccess = ref(false);
const errorMessage = ref("请输入 <用户名> ");
const statusIcon = ref("info");

const b15Songs: Ref<SongData[]> = ref([]);
const b35Songs: Ref<SongData[]> = ref([]);

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
      if (!username.value) {
        isSuccess.value = false;
        errorMessage.value = "发现用户名为空";
        statusIcon.value = "error";
        return;
      }
      fetchData();
    }
  }
);

async function fetchData() {
  try {
    isLoading.value = true;
    b15Songs.value = [];
    b35Songs.value = [];

    const provider = DataProviderFactory.createProvider(username.value);
    if (!provider) {
      throw new Error("无法创建数据提供者");
    }

    const data = await provider.getBest50Data();

    if (data == null) {
      isLoading.value = false;
      isSuccess.value = false;
      statusIcon.value = "error";
      errorMessage.value =
        "无法获取你的分数，请检查用户名是否正确，同时确保没有设置隐私保护";
      return;
    }

    console.log("Get Data:", data);

    userData.value = data.userData;
    b15Songs.value = data.best50SongData.b15;
    b35Songs.value = data.best50SongData.b35;
    isSuccess.value = true;
  } catch (error) {
    isLoading.value = false;
    isSuccess.value = false;
    statusIcon.value = "error";
    errorMessage.value =
      "无法获取你的分数，请检查用户名是否正确，同时确保没有设置隐私保护";
    console.error("出错：", error);
  }
  isLoading.value = false;
}

import "element-plus/theme-chalk/display.css";
</script>

<style scoped>
.user-header {
  margin-bottom: 60px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  z-index: 5;
}
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

.main {
  z-index: 5;
}
</style>
