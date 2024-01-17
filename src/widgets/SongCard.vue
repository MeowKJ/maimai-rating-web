<template>
  <el-card body-class="song-card" shadow="hover">
    <el-row>
      <!-- 歌曲图片 -->
      <el-col :span="24" :sm="8" :lg="7" :xl="6">
        <img
          :src="generateImageUrl(song.id)"
          alt="Card Image"
          crossorigin="anonymous"
          class="song-image"
        />
      </el-col>
      <!-- 歌曲信息 -->
      <el-col :span="24" :sm="16" :lg="17" :xl="18">
        <el-row class="card-content">
          <!-- 难度和评分等级 -->
          <el-col>
            <el-row class="song-header" :style="backgroundColorStyle">
              <el-col :span="4">{{ song.ra }}</el-col>
              <el-col :span="16">{{ song.level_label }} ({{ song.ds }})</el-col>
              <el-col :span="4" class="song-header-item"
                >#{{ props.index + 1 }}</el-col
              >
            </el-row>
          </el-col>
          <!-- 歌曲标题 -->
          <el-col class="song-title">{{ song.title }}</el-col>
          <!-- 成绩和徽章 -->
          <el-col>
            <el-row class="rate-content">
              <el-col :span="24" :sm="12" class="achievements-text">
                {{ Number(song.achievements).toFixed(4) }}
              </el-col>
              <el-col :span="14" :sm="6">
                <img
                  :src="generateRateUrl(song.rate)"
                  alt=""
                  crossorigin="anonymous"
                  class="badge-image"
                />
              </el-col>
              <el-col :span="5" :sm="3">
                <img
                  :src="generateBadgeUrl(song.fc)"
                  alt=""
                  crossorigin="anonymous"
                  class="badge-image"
                />
              </el-col>
              <el-col :span="5" :sm="3">
                <img
                  :src="generateBadgeUrl(song.fs)"
                  alt=""
                  crossorigin="anonymous"
                  class="badge-image"
                />
              </el-col>
            </el-row>
          </el-col>
          <!-- 歌曲额外信息 -->
          <el-col>
            <el-row class="song-footer">
              <el-col :span="2" :xs="8">{{ song.type }}</el-col>
              <el-col :span="4" :xs="8">{{ song.dxScore }}</el-col>
              <el-col :span="12" :xs="18" class="star-number"
                ><el-rate
                  disabled
                  v-model="song.starNumber"
                  :colors="starNumberColors"
                  :low-threshold="lowThreshold"
                  :highThreshold="highThreshold"
                  size="small"
              /></el-col>
              <el-col :span="6">id:{{ song.id }}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { SongData } from "../types";
import {
  generateBadgeUrl,
  generateImageUrl,
  generateRateUrl,
} from "../utils/url";

const props = defineProps<{
  song: SongData;
  index: number;
}>();
const starNumberColors = ref(["#99A9BF", "#F7BA2A", "#f37800"]);
const lowThreshold = ref(1);
const highThreshold = ref(3);

const backgroundColorStyle = computed(() => {
  switch (props.song?.level_index ?? 0) {
    case 0:
      return "background-color: green;";
    case 1:
      return "background-color: yellow;";
    case 2:
      return "background-color: red;";
    case 3:
      return "background-color: purple;";
    case 4:
      return "background-color: #dcbcfb;";
    default:
      return "";
  }
});
</script>

<style scoped>
.star-number {
  margin: 0;
  padding: 0;
  height: 10px;
  transform: translateY(-5px);
}

.song-image {
  width: 100%;
  display: block;
}

.badge-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.song-title {
  text-align: left;
  font-size: 1em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.achievements-text {
  text-align: left;
  font-size: 20px;
  font-weight: bold;
}

.rate-content {
  align-items: center;
  justify-content: center;
}

.card-content {
  height: 100%;
  width: 100%;
  padding-left: 1px;
  padding-right: 1px;
}

.song-header {
  font-size: 0.8em;
  color: #f9f9f9;
  border-radius: 2px;
  font-weight: bold;
  display: flex;
}

.song-footer {
  border-top: #1a1a1a solid 1px;
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 5px;
  padding-right: 5px;
  font-weight: bold;
  text-align: left;
  font-size: 10px;
  color: #242424;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .badge-image {
    height: 35px;
  }

  .star-number {
    transform: translateY(-5px);
  }
}
</style>
