<template>
  <div class="pointer-events-none fixed inset-0 overflow-hidden z-0">
    <div
      v-for="petal in petals"
      :key="petal.id"
      class="absolute"
      :style="petal.containerStyle"
    >
      <svg
        :width="petal.size"
        :height="petal.size * 1.3"
        :viewBox="`0 0 40 52`"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :style="petal.svgStyle"
      >
        <!-- Realistic cherry blossom petal shape — rounded teardrop with notch -->
        <path
          d="M20 48 C8 38 2 28 2 18 C2 8 10 2 20 4 C30 2 38 8 38 18 C38 28 32 38 20 48 Z"
          :fill="petal.color"
          :opacity="petal.opacity"
        />
        <!-- Center vein -->
        <path
          d="M20 46 C20 30 20 16 20 6"
          :stroke="petal.veinColor"
          stroke-width="0.8"
          stroke-linecap="round"
          :opacity="petal.opacity * 0.5"
        />
        <!-- Side veins -->
        <path
          d="M20 28 C14 24 8 20 5 16 M20 28 C26 24 32 20 35 16 M20 20 C15 17 11 14 8 11 M20 20 C25 17 29 14 32 11"
          :stroke="petal.veinColor"
          stroke-width="0.5"
          stroke-linecap="round"
          :opacity="petal.opacity * 0.3"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Petal {
  id:             number
  size:           number
  color:          string
  veinColor:      string
  opacity:        number
  containerStyle: Record<string, string>
  svgStyle:       Record<string, string>
}

const petalColors: [string, string][] = [
  ['#ffc2d4', '#c9184a'],
  ['#ffb3c6', '#ff4d6d'],
  ['#ffd6e0', '#c9184a'],
  ['#ffccd5', '#ff758c'],
  ['#fff0f3', '#ff4d6d'],
  ['#ffe5ec', '#c9184a'],
  ['#fbb1bd', '#a4133c'],
  ['#f4acb7', '#c9184a'],
]

const petals  = ref<Petal[]>([])
let nextId    = 0

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function getRandomColors(): [string, string] {
  const index = Math.floor(Math.random() * petalColors.length)
  return petalColors[index] as [string, string]
}

function createPetal(): Petal {
  const [color, veinColor] = getRandomColors()
  const size               = randomBetween(12, 22)
  const startX             = randomBetween(-2, 102)
  const duration           = randomBetween(7000, 14000)
  const delay              = randomBetween(0, 8000)
  const swayDuration       = randomBetween(2000, 4000)
  const initialRotation    = randomBetween(-45, 45)
  const rotationEnd        = initialRotation + randomBetween(-60, 60)

  return {
    id:        nextId++,
    size,
    color,
    veinColor,
    opacity:   randomBetween(0.55, 0.85),
    containerStyle: {
      left:      `${startX}vw`,
      top:       `-${size * 2}px`,
      animation: `petalFall ${duration}ms ease-in ${delay}ms infinite`,
    },
    svgStyle: {
      animation: `petalSway ${swayDuration}ms ease-in-out ${delay}ms infinite alternate, petalRotate ${duration}ms linear ${delay}ms infinite`,
      transform: `rotate(${initialRotation}deg)`,
      '--rot-end': `${rotationEnd}deg`,
    },
  }
}

function injectKeyframes(): void {
  if (document.getElementById('petal-keyframes')) return
  const style       = document.createElement('style')
  style.id          = 'petal-keyframes'
  style.textContent = `
    @keyframes petalFall {
      0%   { top: -40px;  opacity: 0;   }
      5%   { opacity: 1;               }
      95%  { opacity: 1;               }
      100% { top: 105vh;  opacity: 0;  }
    }
    @keyframes petalSway {
      0%   { margin-left: 0px;   }
      100% { margin-left: 60px;  }
    }
    @keyframes petalRotate {
      0%   { transform: rotate(-30deg)  }
      25%  { transform: rotate(15deg)   }
      50%  { transform: rotate(-20deg)  }
      75%  { transform: rotate(25deg)   }
      100% { transform: rotate(-30deg)  }
    }
  `
  document.head.appendChild(style)
}

onMounted(() => {
  injectKeyframes()
  for (let i = 0; i < 25; i++) {
    petals.value.push(createPetal())
  }
})

onUnmounted(() => {
  const style = document.getElementById('petal-keyframes')
  if (style) style.remove()
})
</script>