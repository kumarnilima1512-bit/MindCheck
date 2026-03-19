<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 px-4 py-10 overflow-hidden relative">

    <!-- Background -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl animate-[morph_10s_ease-in-out_infinite]"></div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-100/35 blur-3xl animate-[morph_12s_ease-in-out_infinite_2s]"></div>
      <div class="absolute top-16 right-16 w-24 h-24 rounded-full border border-blue-200/50 animate-[spin_20s_linear_infinite]"></div>
      <div class="absolute bottom-20 left-16 w-20 h-20 rounded-full border border-violet-200/40 animate-[spin_18s_linear_infinite]"></div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="relative z-10 flex items-center justify-center min-h-screen">
      <div class="text-center space-y-4">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <svg class="w-6 h-6 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
        <p class="text-sm text-slate-400">Loading your routine...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="relative z-10 flex items-center justify-center min-h-screen">
      <div class="text-center space-y-4 max-w-sm">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 border border-red-100">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-sm text-slate-500">{{ error }}</p>
        <button @click="loadRoutine" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
          Try again →
        </button>
      </div>
    </div>

    <div v-else class="relative z-10 max-w-xl mx-auto space-y-5">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <button
          @click="navigateTo('/result')"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-semibold text-slate-700">Your 30-day routine</h1>
          <p class="text-xs text-slate-400">{{ store.result?.overallLevel.label }} level · Repeats every 30 days</p>
        </div>
      </div>

      <!-- Progress -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium text-slate-500">Overall progress</p>
          <p class="text-xs font-semibold text-indigo-600">{{ completedCount }} / 30 days</p>
        </div>
        <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-indigo-400 rounded-full transition-all duration-700"
            :style="{ width: `${(completedCount / 30) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Day selector -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5">
        <p class="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3">Select day</p>
        <div class="grid grid-cols-6 gap-2">
          <button
            v-for="day in routineDays"
            :key="day.day"
            @click="selectedDay = day.day"
            :class="[
              'aspect-square rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-center',
              selectedDay === day.day
                ? 'bg-indigo-500 text-white shadow-md scale-110'
                : day.completed
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border border-slate-100 hover:border-slate-300'
            ]"
          >
            <svg v-if="day.completed && selectedDay !== day.day" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
            <span v-else>{{ day.day }}</span>
          </button>
        </div>
      </div>

      <!-- Day detail -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        leave-active-class="transition-all duration-200 ease-in"
        leave-to-class="opacity-0 -translate-y-2"
        mode="out-in"
      >
        <div v-if="currentDay" :key="selectedDay" class="space-y-4">

          <!-- Day header -->
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-700">Day {{ currentDay.day }}</h2>
              <p class="text-xs text-slate-400">Week {{ Math.ceil(currentDay.day / 7) }}</p>
            </div>
            <button
              @click="toggleComplete(currentDay.day)"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200',
                currentDay.completed
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
              ]"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
              {{ currentDay.completed ? 'Completed' : 'Mark complete' }}
            </button>
          </div>

          <!-- Time blocks -->
          <div v-for="block in timeBlocks" :key="block.key">
            <div v-if="currentDay[block.key].length > 0">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-6 h-6 rounded-lg flex items-center justify-center" :class="block.bg">
                  <svg class="w-3.5 h-3.5" :class="block.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="block.iconPath"/>
                  </svg>
                </div>
                <p class="text-xs font-medium tracking-widest uppercase text-slate-400">{{ block.label }}</p>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(activity, i) in currentDay[block.key]"
                  :key="i"
                  class="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div class="flex items-start gap-3 p-4">
                    <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" :class="block.bg">
                      <svg class="w-4 h-4" :class="block.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="block.iconPath"/>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-slate-700">{{ activity.title }}</p>
                      <div class="flex items-center gap-3 mt-1">
                        <span class="flex items-center gap-1 text-xs text-slate-400">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {{ activity.time }}
                        </span>
                        <span class="flex items-center gap-1 text-xs text-slate-400">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                          {{ activity.duration }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- YouTube thumbnail -->
                  <div v-if="activity.thumbnailUrl && activity.youtubeUrl" class="px-4 pb-4">
                    <a :href="activity.youtubeUrl" target="_blank" rel="noopener noreferrer" class="block relative rounded-xl overflow-hidden group">
                      <img :src="activity.thumbnailUrl" :alt="activity.title" class="w-full h-36 object-cover"/>
                      <div class="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div class="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <svg class="w-4 h-4 text-slate-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      <div class="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        YouTube
                      </div>
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- 30 days complete -->
          <div v-if="completedCount === 30" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-emerald-700">You completed 30 days!</p>
            <p class="text-xs text-emerald-600 leading-relaxed">Your routine will now repeat. Keep going — consistency is key.</p>
            <button @click="restartCycle" class="text-xs font-medium text-emerald-700 underline underline-offset-2">
              Restart cycle →
            </button>
          </div>

          <!-- Prev / Next -->
          <div class="flex gap-3 pb-8">
            <button
              v-if="selectedDay > 1"
              @click="selectedDay--"
              class="flex-1 py-3 rounded-full border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all duration-200"
            >
              ← Previous day
            </button>
            <button
              v-if="selectedDay < 30"
              @click="selectedDay++"
              class="flex-1 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-900/20 active:translate-y-0"
            >
              Next day →
            </button>
          </div>

        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAssessmentStore }       from '~/stores/assessment'
import { useRoutine }               from '~/composables/useRoutine'

const store = useAssessmentStore()
const { routineDays, loading, error, fetchRoutine, toggleComplete } = useRoutine()

const selectedDay    = ref(1)
const currentDay     = computed(() => routineDays.value.find(d => d.day === selectedDay.value))
const completedCount = computed(() => routineDays.value.filter(d => d.completed).length)

interface TimeBlock {
  key:       'morning' | 'afternoon' | 'evening'
  label:     string
  bg:        string
  iconColor: string
  iconPath:  string
}

const timeBlocks: TimeBlock[] = [
  {
    key:       'morning',
    label:     'Morning',
    bg:        'bg-amber-100',
    iconColor: 'text-amber-600',
    iconPath:  'M12 3v1m0 16v1m8.66-10h-1M4.34 12h-1m15.07-6.07l-.71.71M6.34 17.66l-.71.71m12.73 0l-.71-.71M6.34 6.34l-.71-.71M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    key:       'afternoon',
    label:     'Afternoon',
    bg:        'bg-sky-100',
    iconColor: 'text-sky-600',
    iconPath:  'M12 3v1m0 16v1m8.66-10h-1M4.34 12h-1m15.07-6.07l-.71.71M6.34 17.66l-.71.71m12.73 0l-.71-.71M6.34 6.34l-.71-.71M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    key:       'evening',
    label:     'Evening',
    bg:        'bg-indigo-100',
    iconColor: 'text-indigo-600',
    iconPath:  'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  },
]

function restartCycle(): void {
  routineDays.value.forEach(d => { d.completed = false })
  selectedDay.value = 1
}

async function loadRoutine(): Promise<void> {
  if (!store.result) {
    navigateTo('/')
    return
  }
  await fetchRoutine(store.result.overallLevel.level)
}

onMounted(loadRoutine)
</script>