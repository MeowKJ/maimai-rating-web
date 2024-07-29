<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useUserStore } from "../store/user";
import { color } from "echarts";
const router = useRouter();

const userStore = useUserStore();
const { username, userData } = storeToRefs(userStore);

const computedAvatarUrl = computed(() => {
  if (userData.value && userData.value.avatarUrl) {
    return userData.value.avatarUrl;
  }
  return "https://maimai.mpas.top/assets/images/avatar";
});

const computedNickname = computed(() => {
  console.log("computedNickname: ", userData.value);
  if (userData.value) {
    return userData.value.nickname;
  }
  return "加载中~";
});

const courseRankUrl = computed(() => {
  if (userData.value) {
    return `https://maimai.mpas.top/assets/course_rank/${userData.value.rankId}`;
  }
  return "";
});

const classRankUrl = computed(() => {
  if (userData.value) {
    return `https://maimai.mpas.top/assets/class_rank/${userData.value.classId}`;
  }
  return "";
});

const plateUrl = computed(() => {
  if (userData.value) {
    return `https://maimai.mpas.top/assets/plate/${userData.value.plateId}`;
  }
  return "https://maimai.mpas.top/assets/plate/0";
});

const trophyText = computed(() => {
  if (userData.value) {
    return userData.value.trophyName;
  }
  return "欢迎使用网页版查分器";
});

const ratingText = computed(() => {
  if (userData.value) {
    return userData.value.rating;
  }
  return "0";
});

const getImgCodeFromDxRating = (dxRating: number): string => {
  const ranges: [number, number, string][] = [
    [0, 999, "01"],
    [1000, 1999, "02"],
    [2000, 3999, "03"],
    [4000, 6999, "04"],
    [7000, 9999, "05"],
    [10000, 11999, "06"],
    [12000, 12999, "07"],
    [13000, 13999, "08"],
    [14000, 14499, "09"],
    [14500, 14999, "09"],
  ];

  for (const [lower, upper, code] of ranges) {
    if (lower <= dxRating && dxRating <= upper) {
      return code;
    }
  }
  return "10";
};

const ratingImgUrl = computed(() => {
  if (userData.value) {
    const rating = userData.value.rating;
    const imgCode = getImgCodeFromDxRating(rating);
    return `https://maimai.mpas.top/assets/rating/${imgCode}`;
  }
  return "https://maimai.mpas.top/assets/rating/01";
});



// const trophyColor = computed(() => {
//   if (userData.value) {
//     return `https://maimai.mpas.top/assets/trophy/${userData.value.trophyColor}`;
//   }
//   return "https://maimai.mpas.top/assets/trophy/rainbow";
// });

const trophyBackgroundColor = computed(() => {
  if (userData.value) {
    switch (userData.value.trophyColor.toLowerCase()) {
      case "normal":
        return "#292828"; // 灰色
      case "bronze":
        return "#cd7f32"; // 铜色
      case "silver":
        return "#000000"; // 银色
      case "gold":
        return "#ffd700"; // 金色
      default:
        return "#FF0000"; // 彩虹色
    }
  }
  return "#808080"; // 彩虹色
});

const trophyDivStyle = computed(() => {
  return {
    backgroundColor: `${hexToRgba(trophyBackgroundColor.value, 0.8)}`,
    color: "#fff",
    borderRadius: "10px",
  };
});

function hexToRgba(hex:string, alpha:number) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function search() {
  console.log("goTo use username: ", username.value);
  router.push({ path: `/${username.value}` });
}
</script>

<template>
  <div class="user-card">
    <div class="name-plate">
      <img height="100%" :src="plateUrl" alt="palte" />
      <el-avatar
        :size="85"
        class="avatar"
        shape="square"
        :src="computedAvatarUrl"
      />

      <!-- <div :style="trophyDivStyle" class="trophy">
        
      </div> -->

      <div class="nickname">{{ computedNickname }}</div>

      <div class="course-rank">
        <img width="62px" :src="courseRankUrl" alt="" />
      </div>
      <div class="class-rank">
        <img width="62px" :src="classRankUrl" alt="" />
      </div>

      <div class="rating">
        <img width="150px" :src="ratingImgUrl" alt="" />
      </div>
      <div :style="trophyDivStyle" class="trophy-text">{{ trophyText }}</div>
      <div class="rating-text">{{ ratingText }}</div>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  flex: auto;
  max-width: 100%;
  overflow: hidden;
}

.name-plate {
  padding: 0;
  height: 100px;
  position: relative;
  margin-top: 20px; /* 添加外边距以保持与屏幕边缘的距离 */
  display: inline-block;
}

.avatar {
  position: absolute;
  top: 50%;
  left: 8%;
  transform: translate(-50%, -50%);
}

.course-rank {
  position: absolute;
  bottom: 26px;
  left: 238px;
}

.class-rank {
  position: absolute;
  top: 3px;
  left: 240px;
}
.rating {
  position: absolute;
  top: 5px;
  left: 95px;
}
.trophy-text {
  text-align: center;
  overflow: hidden;
  width: 200px;
  margin-left: 5px;
  margin-right: 5px;
  font-size: 12px;
  white-space: nowrap;
  text-shadow: #000 1px 0 0, #000 0 1px 0, #000 -1px 0 0, #000 0 -1px 0;
  position: absolute;
  bottom: 6px;
  left: 96px;
}

.rating-text {
  text-align: center;
  font-size: 15px;
  color: gold;
  white-space: nowrap;
  font-weight: bold;
  text-shadow: #000 1.5px 0 0, #000 0 1.5px 0, #000 -1.5px 0 0, #000 0 -1.5px 0;
  letter-spacing: 2px;
  position: absolute;
  top: 11px;
  left: 172px;
}
.trophy {
  position: absolute;
  bottom: 0px;
  left: 100px;
}

.nickname {
  background-color: whitesmoke;
  border-radius: 5px;
  width: 196px;
  padding-left: 4px;
  text-align: left;
  font-size: 1.3em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: #000 1px 1px 4px 0px;
  position: absolute;
  bottom: 30px;
  left: 100px;
}
</style>
