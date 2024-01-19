<template>
  <img ref="balloonRef" class="balloon" :src="props.src" alt="Balloon" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});
const balloonRef = ref<HTMLElement | null>(null);

import { gsap } from "gsap";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const verticalMovePerSecond = 15; // 每秒垂直移动15像素
const stepDuration = 10; // 每个动画步骤的持续时间，以秒为单位
const totalVerticalMove = windowHeight + 300; // 总垂直移动距离
const horizontalMoveRange = { min: 50, max: windowWidth / 4 };
const rotationAmplitude = 20; // 旋转幅度（度）
const horizontalMove =
  Math.random() * (horizontalMoveRange.max - horizontalMoveRange.min) +
  horizontalMoveRange.min;
const steps = Math.ceil(
  totalVerticalMove / (verticalMovePerSecond * stepDuration)
);

const timeline = gsap.timeline({
  onComplete: () => {
    setTimeout(() => {
      startAnimation();
    }, 60000);
  },
});

onMounted(() => {
  if (balloonRef.value) {
    setTimeout(startAnimation, 10000);
  }
});

const startAnimation = () => {
  if (!balloonRef.value) return;

  // 重置气球的位置和旋转到初始状态
  balloonRef.value.style.left = "50%";
  balloonRef.value.style.bottom = "-300px";
  gsap.set(balloonRef.value, { x: 0, y: 0, rotation: 10 });

  let toward = 1;

  for (let i = 0; i < steps; i++) {
    toward = -toward;
    timeline.to(balloonRef.value, {
      y: `-=${verticalMovePerSecond * stepDuration}`,
      x: `+=${horizontalMove * toward}`,
      rotation: `+=${rotationAmplitude * toward}`,
      duration: stepDuration,
      ease: "Sine.easeInOut",
    });
  }
};
</script>

<style>
.balloon {
  position: absolute;
  bottom: -200px;
  width: 100px;

  left: 50%;
  rotate: 10deg;
  z-index: 6;
}
</style>
