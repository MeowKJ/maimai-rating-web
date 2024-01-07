<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <p>
          <span>昵称：{{ nickname }}</span>
          {{ rating }}
        </p>
      </el-header>
      <el-main>
        <!-- 显示异步获取的数据 -->
        <div v-if="isLoading">加载中...</div>
        <div v-else>
          <!-- 显示其他获取的数据 -->
          <!-- B15 -->
          <el-row v-for="(songs, i) in totalSongs" class="card-row" :gutter="20">
            <el-col
                class="card-col"
                v-for="(song, index) in songs"
                :span="12"
                :sm="12"
                :md="8"
                :xl="8"
                :key="(index)"
            >
              <el-card class="song-card" :body-style="{ padding: '0px' }">
                <el-row>
                  <!-- 左边放图片 -->
                  <el-col :span="24" :sm="8" :lg="6" :xl="6">
                    <img :src="generateImageUrl(song['song_id'])" alt="Card Image" class="full-width-image">
                  </el-col>

                  <!-- 右边放标题和其他数据 -->
                  <el-col :span="24" :sm="16" :lg="18" :xl="18">
                    <el-row class="card-content">
                      <el-col>
                        <el-row class="song-header" :class="getBackgroundColorClass(song['level_index'])">
                          <el-col :span="4">{{ song['ra'] }}</el-col>
                          <el-col :span="16">{{ song['level_label'] }} ({{ song['ds'] }})</el-col>
                          <el-col :span="4" class="song-header-item">#{{ index + 1 }}</el-col>
                        </el-row>
                      </el-col>
                      <el-col class="song-title">{{ song.title }}</el-col>
                      <el-col>
                        <el-row class="rate-content">
                          <el-col :span="12" class="rate-item achievements-text">
                            {{ Number(song['achievements']).toFixed(4) }}
                          </el-col>
                          <el-col :span="6" class="rate-item">
                            <img :src="generateRateUrl(song['rate'])" alt="" class="rate-image">
                          </el-col>
                          <el-col :span="3" class="rate-item">
                            <img :src="generateBadgeUrl(song['fc'])" alt="" class="rate-image">
                          </el-col>
                          <el-col :span="3" class="rate-item">
                            <img :src="generateBadgeUrl(song['fs'])" alt="" class="rate-image">
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col>
                        <el-row class="song-footer">
                          <el-col :span="4" class="song-footer-item">{{ song['type'] }}</el-col>
                          <el-col :span="12" class="song-footer-item">{{ song['dxScore'] }}</el-col>
                          <el-col :span="8" class="song-footer-item">id:{{ song['song_id'] }}</el-col>
                        </el-row>
                      </el-col>
                    </el-row>

                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<!-- 其他部分保持不变 -->


<script>
import fetchData from './utils/api.js'; // 替换为实际的文件路径

export default {
  data() {
    return {
      isLoading: true,
      nickname: '',
      rating: 0,
      totalSongs: [],
    };
  },
  computed: {},
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const username = this.getUsernameFromURL();
        const data = await fetchData(username);
        console.log('获取到的数据：', data);
        this.nickname = data['nickname'];
        this.rating = data['rating'];
        this.totalSongs.push(data['charts']['dx']);
        this.totalSongs.push(data['charts']['sd']);
        this.isLoading = false;
      } catch (error) {
        console.error('出错：', error);
        this.isLoading = false;
      }
    },
    getUsernameFromURL() {
      const pathSegments = window.location.pathname.split('/');
      // 根据实际情况确定要获取的位置
      return pathSegments[pathSegments.length - 1];
    },
    generateImageUrl(songId) {
      return `https://lxns.org/maimai/jacket/${songId % 10000}.png`;
    },
    generateRateUrl(rate) {
      return `https://maimai.lxns.net/assets/maimai/music_rank/${rate}.webp`;
    },
    generateBadgeUrl(badge) {
      if (!badge) {
        badge = 'blank';
      }
      return `https://maimai.lxns.net/assets/maimai/music_icon/${badge}.webp`;
    },
    getBackgroundColorClass(levelIndex) {
      switch (levelIndex) {
        case 0:
          return 'basic-background';
        case 1:
          return 'advance-background';
        case 2:
          return 'expert-background';
        case 3:
          return 'master-background';
        case 4:
          return 'remaster-background';
        default:
          return '';
      }
    },

  },
};
</script>

<style scoped>
@import url('./css/color.css');

.song-card {
  padding: 0;
}

.card-col {
  margin-bottom: 30px;
}

.full-width-image {
  width: 100%;
  display: block;
}


.achievements-text {
  text-align: left;
  font-size: 20px;
  font-weight: bold;
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

.card-footer {
  margin-top: 8px;

  display: flex;
  flex-direction: column; /* 如果子容器是垂直排列，可以省略 */
}

.song-header-middle-item {
  flex-grow: 1;
}

.rate-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover; /* 图片完全填充父容器，可能会裁剪部分内容 */
  display: block;
}

.rate-content {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.song-title {
  text-align: left;
  font-size: 1.0em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}

.card-content {
  height: 100%;
  width: 100%;
  padding-left: 1px;
  padding-right: 1px;
}
</style>