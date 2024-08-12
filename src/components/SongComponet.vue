<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user";

import type { SongData } from "../utils/api/types";

import "element-plus/theme-chalk/display.css";
import SongCard from "@/widgets/SongCard.vue";

const userStore = useUserStore();

const { b15sum, b35sum } = storeToRefs(userStore);

const emit = defineEmits(["catchError"]);

const props = defineProps<{
  totalSongs: SongData[][];
}>();
</script>
<template>
  <el-row
    v-for="(songs, i) in props.totalSongs"
    class="card-row"
    :gutter="20"
    justify="space-evenly"
  >
    <!-- 在每个songs数组前添加一个标题 -->
    <el-row class="category-title-row">
      <el-col :span="24">
        <div class="category-title">
          <span class="bx-title">{{ i === 0 ? "B15   " : "B35   " }}</span>
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
      <SongCard :song="song" :index="index" />
    </el-col>
    <el-divider border-style="dashed" />
  </el-row>
</template>
<style scoped>
.card-col {
  z-index: 10;
  margin-bottom: 30px;
  transition: transform 0.3s ease;
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
</style>
