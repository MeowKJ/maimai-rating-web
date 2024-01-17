<script setup lang="ts">
import "@/asstes/styles/animation.css";
import "@/asstes/styles/balloon.css";
import "@/asstes/styles/position.css";
</script>

<template>
  <div class="background-main">
    <div class="bg-triangle">
      <div class="bg-triangle-top"></div>
      <div class="bg-triangle-btm"></div>
    </div>
    <div class="bg-flag"></div>
    <div class="bg-fireworks"></div>

    <div class="bg-frame">
      <div class="bg-frame-btm">
        <div class="bg-frame-btm-left">
          <div class="items items-anm2 balloon-6 item-b-l-1"></div>
          <div class="items items-anm2 balloon-4 item-b-l-2"></div>
          <div class="items items-anm1 balloon-7 itm-b-l-3"></div>
        </div>
        <div class="bg-frame-btm-right">
          <div class="items items-anm1 giftbox item-b-r-1"></div>
          <div class="items items-anm2 balloon-1 item-b-r-2"></div>
          <div class="items items-anm1 balloon-4 item-b-r-3"></div>
        </div>
      </div>
      <div class="bg-frame-top">
        <div class="bg-frame-top-left">
          <div class="items items-anm2 ribbin-1"></div>
          <div class="items items-anm1 ribbin-2"></div>
          <div class="items items-anm1 ribbin-4"></div>
          <div class="items items-anm1 balloon-1"></div>
          <div class="items items-anm2 balloon-2"></div>
          <div class="items items-anm1 balloon-3"></div>
          <div class="items items-anm2 ribbin-3"></div>
          <div class="items items-anm2 balloon-4"></div>
          <div class="items items-anm2 balloon-5"></div>
          <div class="items items-anm1 balloon-6"></div>
          <div class="items items-anm1 balloon-7"></div>
        </div>
        <div class="bg-frame-top-right">
          <div class="items items-anm2 ribbin-5"></div>
          <div class="items items-anm1 ribbin-6"></div>
          <div class="items items-anm2 balloon-4"></div>
          <div class="items items-anm1 balloon-7"></div>
          <div class="items items-anm2 balloon-5"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background-main {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: block;
  background: linear-gradient(#fdfa78 30%, #fff 30% 70%, #d5aeff 70% 100%);
}

.bg-triangle-top,
.bg-triangle-btm {
  min-width: 100%;
  position: fixed;
  height: 30vh;
}

.bg-triangle-top {
  top: 0;
  background: url("https://maimai.mpas.top/assets/bg/bg_triangle_top") 0 100%
    no-repeat;
  animation: background-goleft-top 60s linear infinite;
}

.bg-triangle-btm {
  bottom: 0;
  background: url("https://maimai.mpas.top/assets/bg/bg_triangle_btm") 0 0
    no-repeat;
  animation: background-goleft-btm 60s linear infinite;
}

.bg-flag {
  top: -30px;
  left: 230px;
  width: 1229px;
  height: 170px;
  animation: swingPC 10s ease-in-out infinite;
}

.bg-flag {
  position: fixed;
  top: 20px;
  left: -20px;
  width: 614.5px;
  height: 85px;
  background: url("https://maimai.mpas.top/assets/bg/bg_flag") no-repeat;
  background-size: cover;
  animation: swingSP 10s ease-in-out infinite;
  transform: rotate(15deg);
}

.bg-fireworks {
  position: fixed;
  top: -20px;
  right: 20px;
  width: 215px;
  height: 215px;
  background: url("https://maimai.mpas.top/assets/bg/bg_fireworks") no-repeat
    100% / contain;
  animation: fireworks cubic-bezier(0.54, -0.14, 1, 1) 10s forwards infinite;
  opacity: 0;
}

.bg-frame-btm {
  background: transparent url("https://maimai.mpas.top/assets/bg/bg_balloon")
    repeat-x;
  background-size: cover;
  width: 150%;
  height: 235.5px;
  position: fixed;
  bottom: -25px;
  left: -15%;
}

.bg-frame-btm-left {
  position: fixed;
  bottom: 0;
  left: 0;
}
.bg-frame-btm-right {
  position: fixed;
  bottom: 0;
  right: 0;
}

.bg-frame-top-left {
  position: fixed;
  top: 0;
  left: 0;
}

.bg-frame-top-right {
  position: fixed;
  top: 0;
  right: 0;
}

@media only screen and (min-width: 769px) {
  .bg-flag {
    top: -30px;
    left: 230px;
    width: 1229px;
    height: 170px;
    animation: swingPC 10s ease-in-out infinite;
  }
  .bg-fireworks {
    top: -100px;
    right: 55px;
    width: 430px;
    height: 430px;
  }

  .bg-frame-btm {
    background-size: contain;
    min-width: 1615px;
    width: 100%;
    height: 405px;
    bottom: -90px;
    left: 0;
  }
}
</style>
