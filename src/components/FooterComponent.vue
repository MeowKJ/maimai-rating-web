<script setup lang="ts"></script>
<template>
  <el-footer class="custom-footer">
    <el-row type="flex" justify="center" style="width: 100%">
      <el-col :span="8" :xs="24" class="footer-text">
        <span>Developed By Meow | MaiMai的频道网页查分器</span>
      </el-col>
      <el-col :span="12" :xs="24" class="footer-icons">
        <el-tooltip content="GPL-3.0开源" effect="light" placement="top">
          <a
            href="https://github.com/MeowKJ/maimai-rating-web"
            target="_blank"
            style="margin-right: 25px"
            ><i class="fab fa-github"></i
          ></a>
        </el-tooltip>
        <el-tooltip content="欢迎加入QQ频道" effect="light" placement="top">
          <a href="https://pd.qq.com/s/6jkk63q6d" target="_blank"
            ><i class="fab fa-qq"></i
          ></a>
        </el-tooltip>
      </el-col>
    </el-row>
  </el-footer>
</template>
<style scoped>
.custom-footer {
  width: 100%;
  display: flex; /* 设置为Flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  border-radius: 15px;
  color: #000; /* 文字颜色 */
  padding: 10px 0; /* 上下填充 */
  z-index: 5;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.footer-icons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-icons a {
  color: #000;
  margin: 0 10px; /* 图标间距 */
  transition: color 0.3s ease;
}

.footer-icons i {
  font-size: 25px;
}

.footer-icons a:hover {
  color: #d5aeff;
}
</style>
