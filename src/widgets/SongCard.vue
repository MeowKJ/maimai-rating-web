<template>
  <el-card body-class="song-card" shadow="hover" @click="toggleAdditionDiv">
    <el-row>
      <!-- 歌曲图片 -->
      <el-col :span="24" :sm="8" :lg="7" :xl="6">
        <el-image
          :src="generateImageUrl(song.id)"
          alt="Card Image"
          class="song-image"
          lazy
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
    <div class="addition-div" :class="{ expanded: isAdditionDivExpanded }">
      <el-row style="padding: 5px; margin-top: 8px">
        <el-col
          :span="24"
          style="
            text-align: center;
            padding-bottom: 5px;
            margin-bottom: 5px;
            border-bottom: 1px #000 dashed;
          "
        >
          <span style="font-size: 1em; font-weight: bold"> 统计数据 </span>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-row>
            <el-col :span="8">
              <span class="addition-title">&nbsp;ALL</span>
            </el-col>
            <el-col style="text-align: center" :span="16">{{
              song.additionalData.notes.total
            }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12" :xs="24" v-for="(data, index) in additonList">
          <el-row>
            <el-col :span="8">
              <img class="addition-title" :src="data.icon" alt="tab" />
            </el-col>
            <el-col style="text-align: center" :span="16">{{
              data.noteNumber
            }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-row>
            <el-col :span="8">
              <span class="addition-title">&nbsp;铺面</span>
            </el-col>
            <el-col class="addition-text" :span="16"
              ><p style="margin-top: 4px; text-align: center">
                {{ song.additionalData.note_designer }}
              </p></el-col
            >
          </el-row>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-row>
            <el-col :span="8">
              <span class="addition-title">版本</span>
            </el-col>
            <el-col class="addition-text" :span="16"
              ><p style="margin-top: 4px; text-align: center">
                {{ song.additionalData.version }}
              </p></el-col
            >
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { SongData } from "../types";
import {
  generateBadgeUrl,
  generateImageUrl,
  generateRateUrl,
} from "@/utils/url";

import tabIcon from '@/images/tab.png';
import holdIcon from '@/images/hold.png';
import touchIcon from '@/images/touch.png';
import slideIcon from '@/images/slide.png';
import breakIcon from '@/images/break.png';

const props = defineProps<{
  song: SongData;
  index: number;
}>();
const isAdditionDivExpanded = ref(false);

const toggleAdditionDiv = () => {
  isAdditionDivExpanded.value = !isAdditionDivExpanded.value;
};


const additonList = computed(() => {
  return [
    {
      title: "tab",
      icon: tabIcon,
      noteNumber: props.song?.additionalData.notes.tap ?? 0,
    },
    {
      title: "hold",
      icon: holdIcon,
      noteNumber: props.song?.additionalData.notes.hold ?? 0,
    },
    {
      title: "touch",
      icon: touchIcon,
      noteNumber: props.song?.additionalData.notes.touch ?? 0,
    },
    {
      title: "slide",
      icon: slideIcon,
      noteNumber: props.song?.additionalData.notes.slide ?? 0,
    },
    {
      title: "break",
      icon: breakIcon,
      noteNumber: props.song?.additionalData.notes.break ?? 0,
    },
  ];
});

const starNumberColors = ref(["#99A9BF", "#F7BA2A", "#f37800"]);
const lowThreshold = ref(1);
const highThreshold = ref(3);

const backgroundColorStyle = computed(() => {
  switch (props.song?.level_index ?? 0) {
    case 0:
      return "background-color: green;";
    case 1:
      return "background-color: #FFBD33;";
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
.addition-div .addition-text {
  overflow: hidden;
  white-space: nowrap;
  font-size: 0.5em;
  font-weight: bold;
}

.addition-div {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.addition-div.expanded {
  max-height: 180px; /* 设置为你希望的最大高度 */
}

.addition-div img {
  height: 20px;
}

.addition-div .addition-title {
  margin-left: 20%;
  font-size: 0.8em;
  font-weight: bold;
}

.addition-div .el-col {
  text-align: left;
}

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

  .addition-div.expanded {
    max-height: 300px;
  }
}
</style>
