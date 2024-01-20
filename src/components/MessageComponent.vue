<script setup lang="ts">
import { ref, onUnmounted, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user";
import { isValidNumber } from "@/utils/tools";
import { useRouter } from "vue-router";
import animationData from "@/asstes/animations/search.json";

const router = useRouter();
const userStore = useUserStore();
const { username } = storeToRefs(userStore);
const tempUsername = ref(username.value);

import type { AnimationItem } from "lottie-web";

const props = defineProps<{
  icon: string;
  errorMessage: string;
}>();

const lottieContainer = ref<HTMLElement>();

let animInstance: AnimationItem | null;

const searchImgUrl = computed(() => {
  return tempUsername.value
    ? isValidNumber(tempUsername.value)
      ? "https://maimai.lxns.net/favicon.ico"
      : "https://www.diving-fish.com/favicon.ico"
    : "";
});

const title = computed(() => {
  if (props.icon === "error" && tempUsername.value === username.value) {
    return "❌遇到错误❌";
  } else if (tempUsername.value) {
    return `⭐${tempUsername.value}⭐`;
  } else {
    return "⭐请输入用户名⭐";
  }
});

const errorMessage = computed(() => {
  if (tempUsername.value !== username.value || username.value === "") {
    return "如果正常输入,使用[水鱼查分器].如果输入QQ号,使用[落雪查分器]";
  }
  const isLuoxue = isValidNumber(username.value);
  return `${props.errorMessage} ${isLuoxue ? "QQ号" : "用户名"}:<${
    username.value
  }>[${isLuoxue ? "落雪查分器" : "水鱼查分器"}]不存在哦~`;
});

onMounted(() => {
  if (lottieContainer.value) {
    animInstance = lottie.loadAnimation({
      container: lottieContainer.value,
      animationData: animationData,
      renderer: "svg",
      loop: false,
      autoplay: false,
      rendererSettings: {
        className: "search-svg",
      },
    });
    playLoopAnimation();
  }
});

onUnmounted(() => {
  if (animInstance) {
    animInstance.destroy();
    animInstance = null;
  }
});

function search() {
  router.push({ path: `/${tempUsername.value}` });
}

const playLoopAnimation = () => {
  if (animInstance) {
    animInstance.loop = true;
    animInstance.playSegments([130, 190], true);
  }
};

const playOnceAnimation = () => {
  if (animInstance) {
    animInstance.loop = false;
    animInstance.playSegments([300, 400], true);
  }
};
</script>
<template>
  <div class="result-container">
    <div class="username-form">
      <el-row style="username-form">
        <el-col :span="4">
          <div ref="lottieContainer" class="search-button"></div>
        </el-col>
        <el-col :span="16">
          <input
            v-model="tempUsername"
            type="text"
            placeholder="Please input"
            class="username-input"
            @change="search"
            @focus="playOnceAnimation"
            @blur="playLoopAnimation"
          />
        </el-col>
        <el-col :span="4">
          <div class="search-img-container">
            <img class="search-img" :src="searchImgUrl" alt="" />
          </div>
        </el-col>
      </el-row>
    </div>

    <el-result :title="title" :sub-title="errorMessage" class="result">
      <template #icon>
        <img
          v-if="props.icon === 'error'"
          src="https://i0.imgs.ovh/2024/01/17/hjIW3.png"
          alt="error"
        />
        <img v-else src="https://i0.imgs.ovh/2024/01/17/hjBPe.png" alt="info" />
      </template>
    </el-result>
  </div>
</template>
<style scope>
.search-button {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 42px;
  border-width: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  color: #000;
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.search-img-container {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 42px;
  border-width: 0;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  color: #000;
  background: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.search-img {
  height: 42px;
}
.username-input {
  width: 100%;
  height: 42px;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  flex-grow: 1;
  color: #000;
  font-size: 1.3em;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.username-form {
  border-radius: 15px;
  width: 300px;
  margin: 0 auto;
  border: none;
}

.result img {
  width: 200px;
}

.result-container {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 20px;
  color: #000;
  padding: 10px 0;
  z-index: 5;
  background: rgba(245, 213, 255, 0.6);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  user-select: none;
}
</style>

<style>
.search-svg {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.el-result__title {
  font-weight: bold;
}
</style>
