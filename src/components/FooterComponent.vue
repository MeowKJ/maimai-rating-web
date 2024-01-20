<template>
  <el-footer class="custom-footer">
    <el-row :gutter="20" justify="center" class="footer-content">
      <el-col :span="24" :sm="12" class="footer-item">
        Developed By Meow | MaiMai的频道网页查分器
      </el-col>
      <el-col :span="24" :sm="12" class="footer-item">
        <el-tooltip content="GPL-3.0开源" effect="light" placement="top">
          <a
            href="https://github.com/MeowKJ/maimai-rating-web"
            target="_blank"
            class="icon-link"
            ref="githubRef"
          >
          </a>
        </el-tooltip>
        <el-tooltip content="欢迎加入QQ频道" effect="light" placement="top">
          <a
            href="https://github.com/MeowKJ/maimai-rating-web"
            target="_blank"
            class="icon-link"
            ref="tecentRef"
          >
          </a>
        </el-tooltip>
      </el-col>
    </el-row>
  </el-footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import iconGithubData from "@/asstes/animations/github.json";
import iconTencentData from "@/asstes/animations/tencent-qq.json";

const githubRef = ref<HTMLElement>();
const tecentRef = ref<HTMLElement>();

declare const lottie: import("lottie-web").LottiePlayer;

onMounted(() => {
  if (githubRef.value) {
    lottie.loadAnimation({
      container: githubRef.value,
      animationData: iconGithubData,
      renderer: "svg",
      loop: true,
      autoplay: true,
    });
  }

  if (tecentRef.value) {
    lottie.loadAnimation({
      container: tecentRef.value,
      animationData: iconTencentData,
      renderer: "svg",
      loop: true,
      autoplay: true,
    });
  }
});
</script>

<style scoped>
.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  width: 100%;
  z-index: 5;
}

.custom-footer {
  width: 100%;
}

.footer-item {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-link {
  height: 50px;
  color: #000;
  margin: 0 10px;
  transition: color 0.3s ease;
}
</style>
