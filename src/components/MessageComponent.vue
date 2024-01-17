<script setup lang="ts">
import {
  ref,
  onUnmounted,
  computed,
  defineProps,
  onMounted,
  watch,
  type Ref,
} from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user";
import { isValidNumber } from "@/utils/tools";
import { useRouter } from "vue-router";
import animationData from "@/asstes/animations/search.json";

const router = useRouter();
const userStore = useUserStore();
const { username } = storeToRefs(userStore);
const tempUsername = ref(username.value);

const props = defineProps<{
  icon: string;
  errorMessage: string;
}>();

const isErrorIcon = computed(() => {
  return props.icon === "error" ? true : false;
});

const resultTitle = computed(() => {
  return props.icon === "error" ? "遇到错误" : "注意~注意~";
});

const errorMessage = computed(() => {
  if (!username.value) {
    return "请输入用户名";
  }
  const isLuoxue = isValidNumber(username.value);
  return `${props.errorMessage} ${isLuoxue ? "QQ号" : "用户名"}:<${
    username.value
  }>[${isLuoxue ? "落雪查分器" : "水鱼查分器"}]不存在哦~`;
});

const searchImgUrl = computed(() => {
  if (!tempUsername.value) {
    return "";
  }
  return isValidNumber(tempUsername.value)
    ? "https://maimai.lxns.net/favicon.ico"
    : "https://www.diving-fish.com/favicon.ico";
});

function search() {
  router.push({ path: `/${tempUsername.value}` });
}
import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";

const lottieContainer = ref<HTMLElement>();
let animInstance: AnimationItem | null;

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

    <el-result :title="resultTitle" :sub-title="errorMessage" class="result">
      <template #extra>
        <el-button type="primary">Back</el-button>
      </template>
      <template #icon>
        <img
          v-if="isErrorIcon"
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
  cursor: default;
}
</style>

<style>
.search-svg {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
</style>
