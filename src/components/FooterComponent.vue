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
            href="https://pd.qq.com/s/484alqv8"
            target="_blank"
            class="icon-link"
            ref="tecentRef"
          >
          </a>
        </el-tooltip>
        <el-tooltip content="生成二维码" effect="light" placement="top">
          <div
            v-show="isSuccess"
            class="icon-link"
            ref="qrRef"
            style="width: 40px"
            @click="open"
          ></div>
        </el-tooltip>

        <el-tooltip content="截图" effect="light" placement="top">
          <div
            v-show="isSuccess"
            class="icon-link"
            ref="cameraRef"
            style="width: 40px"
            @click="capture"
          ></div>
        </el-tooltip>
      </el-col>
    </el-row>
  </el-footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
const { userData, fullscreenLoading } = storeToRefs(userStore);

import iconGithubData from "@/asstes/animations/github.json";
import iconTencentData from "@/asstes/animations/tencent-qq.json";
import iconQRCodeData from "@/asstes/animations/qrcode.json";
import iconCameraData from "@/asstes/animations/camera.json";

const githubRef = ref<HTMLElement>();
const tecentRef = ref<HTMLElement>();
const qrRef = ref<HTMLElement>();

const cameraRef = ref<HTMLElement>();

const props = defineProps<{
  isSuccess: boolean;
}>();

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

  if (qrRef.value) {
    lottie.loadAnimation({
      container: qrRef.value,
      animationData: iconQRCodeData,
      renderer: "svg",
      loop: true,
      autoplay: true,
    });
  }

  if (cameraRef.value) {
    lottie.loadAnimation({
      container: cameraRef.value,
      animationData: iconCameraData,
      renderer: "svg",
      loop: true,
      autoplay: true,
    });
  }
});
import { h } from "vue";

import "element-plus/es/components/message/style/css";
import { ElMessageBox } from "element-plus";

import QRCodeWithImage from "@/widgets/QRCodeWithImage.vue";

const open = () => {
  ElMessageBox({
    title: "二维码",
    message: h(QRCodeWithImage, {
      value: window.location.href,
      src: userData.value?.avatarUrl ? userData.value.avatarUrl : "",
    }),
    center: true,
  });
};

import { toPng } from "html-to-image";
async function capture() {
  fullscreenLoading.value = true;
  const node = document.getElementById("app");
  if (node) {
    try {
      const dataUrl = await toPng(node);
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(error);
    } finally {
      fullscreenLoading.value = false;
    }
  }
}
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
}
</style>
