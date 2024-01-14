<script setup lang="ts">
import { ref, onMounted } from "vue";

const tempArr = ref<number[]>([]);

onMounted(() => {
  for (let i = 0; i < 50; i++) {
    tempArr.value.push(i);
  }
});
</script>
<template>
  <el-row :gutter="40">
    <el-col
      class="card-col"
      v-for="i in tempArr"
      :span="12"
      :sm="12"
      :md="8"
      :xl="8"
      :key="i"
    >
      <el-skeleton :rows="4" animated />
    </el-col>
  </el-row>
</template>
<style scoped></style>
