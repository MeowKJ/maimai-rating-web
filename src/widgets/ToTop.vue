<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import top1Png from '@/assets/images/top1.png';
import top2Png from '@/assets/images/top2.png';

const scrollSpeed = 1;
const scrollThreshold = 1000;
const opacity = ref(0);
const scrollY = ref(0);
const scale = ref(0);

function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): F {
  let timerId: number | undefined;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    timerId = window.setTimeout(
      () => func.apply(this, args),
      delay
    ) as unknown as number;
  } as F;
}

const handleScroll = debounce(() => {
  scrollY.value = window.scrollY;
  opacity.value = scrollY.value > scrollThreshold ? 1 : 0;
  scale.value = scrollY.value > scrollThreshold ? 1 : 0;
}, 200);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div
    :style="{
      opacity: opacity,
      transform: `scale(${scale})`,
      transition: 'opacity 0.5s, transform 0.5s',
    }"
    class="to-top-container"
    @click="scrollToTop"
  >
    <img
      class="to-top dila"
      :src="top1Png"
      alt="top"
    />
    <img
      class="to-top top"
      :src="top2Png"
      alt="top"
    />
  </div>
</template>

<style scoped>
.to-top-container {
  position: fixed;
  z-index: 100;
  display: block;
  bottom: 2.5vw;
  right: 2.5vw;
  cursor: pointer;
}

.dila {
  transform-origin: 50% 35%;
}

.to-top-container img {
  position: absolute;
  z-index: 100;
  display: block;
  bottom: 0;
  right: 0;
  width: 80px;
  transition: 1s;
}

@media only screen and (max-width: 769px) {
  .to-top-container {
    display: none;
  }
}

.to-top-container:hover .top {
  transform: translateY(-10px);
}
.to-top-container:hover .dila {
  transform: translateY(-10px) rotate(360deg);
}
</style>
