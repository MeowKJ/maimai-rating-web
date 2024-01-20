<template>
  <div class="qrcode-container">
    <qrcode-vue
      :value="value"
      :size="200"
      :options="{
        errorCorrectionLevel: 'Q',
      }"
    ></qrcode-vue>
    <img :src="src" class="qrcode-center-image" />
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from "@chenfengyuan/vue-qrcode";

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  src: String,
});
</script>

<style scoped>
.qrcode-container {
  position: relative;
  display: inline-block;
}

.qrcode-center-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px; /* 调整为所需大小 */
  height: 40px; /* 调整为所需大小 */
  transform: translate(-50%, -50%);
}
</style>
