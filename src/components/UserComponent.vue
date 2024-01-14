<script setup lang="ts">
import { useUserStore } from "../store/user";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();
const { username, nickname, rating, isLoading } = storeToRefs(userStore);

function search() {
  console.log("goTo use username: ", username.value);
  router.push({ path: `/${username.value}` });
}
</script>

<template>
  <el-row>
    <el-col class="title" :span="6" :xs="24"> Maimai的频道网页查分器 </el-col>
    <el-col :span="6" :xs="24" class="header-right">
      <el-input
        v-model="username"
        @change="search()"
        placeholder="请输入水鱼用户名"
        class="input-with-select"
      >
        <template #prepend> 用户名: </template>
        <template #append>
          <el-button @click="search()" :disabled="isLoading" circle>
            查询
          </el-button>
          <el-button @click="">截图</el-button>
        </template>
      </el-input>
    </el-col>
    <el-col class="nickname" :span="6" :xs="8">
      <span>昵称：{{ nickname }}</span>
    </el-col>
    <el-col class="rating" :span="6" :xs="16"> DXRating:{{ rating }} </el-col>
  </el-row>
</template>

<style scoped>
.title {
  text-align: left;
  font-size: 1.3em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .title {
    text-align: center;
  }
}

.nickname {
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rating {
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
