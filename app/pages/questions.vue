<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center px-4 py-10 overflow-hidden relative">

    <!-- Background animations -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl animate-[morph_10s_ease-in-out_infinite]"></div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-100/35 blur-3xl animate-[morph_12s_ease-in-out_infinite_2s]"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-100/25 blur-3xl animate-[morph_8s_ease-in-out_infinite_1s]"></div>
      <div class="absolute top-16 right-16 w-24 h-24 rounded-full border border-blue-200/50 animate-[spin_20s_linear_infinite]"></div>
      <div class="absolute top-20 right-20 w-16 h-16 rounded-full border border-indigo-200/40 animate-[spin_14s_linear_infinite_reverse]"></div>
      <div class="absolute bottom-20 left-16 w-20 h-20 rounded-full border border-violet-200/40 animate-[spin_18s_linear_infinite]"></div>
      <div class="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-blue-300/40 animate-[float_6s_ease-in-out_infinite]"></div>
      <div class="absolute top-1/3 left-1/5 w-1.5 h-1.5 rounded-full bg-indigo-300/35 animate-[float_8s_ease-in-out_infinite_1s]"></div>
      <div class="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-violet-300/40 animate-[float_7s_ease-in-out_infinite_2s]"></div>
      <div class="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-blue-400/30 animate-[float_5s_ease-in-out_infinite_.5s]"></div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="relative z-10 text-center space-y-4">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <svg class="w-6 h-6 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </div>
      <p class="text-sm text-slate-400">Loading questions...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="relative z-10 text-center space-y-4 max-w-sm">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 border border-red-100">
        <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-sm text-slate-500">{{ error }}</p>
      <button
        @click="fetchQuestions"
        class="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
      >
        Try again →
      </button>
    </div>

    <!-- Question card -->
    <div v-else class="relative z-10 w-full max-w-lg">

      <!-- Top bar -->
      <div class="flex items-center justify-between mb-6">
        <button
          @click="goBack"
          :disabled="currentIndex === 0"
          class="flex items-center gap-1.5 text-sm transition-colors"
          :class="currentIndex === 0
            ? 'text-slate-200 cursor-not-allowed'
            : 'text-slate-400 hover:text-slate-600'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        <span class="text-xs font-medium text-slate-400">
          {{ currentIndex + 1 }} <span class="text-slate-300">/</span> {{ questions.length }}
        </span>
      </div>

      <!-- Progress bar -->
      <div class="mb-8">
        <div class="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full bg-indigo-400 transition-all duration-500 ease-out"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
      </div>

      <!-- Card -->
      <Transition name="question" mode="out-in">
        <div
          :key="currentIndex"
          class="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm p-8 mb-6"
        >
          <h2 class="text-xl font-medium text-slate-700 leading-relaxed">
            {{ currentQuestion?.text }}
          </h2>
        </div>
      </Transition>

      <!-- Answer options -->
      <Transition name="options" mode="out-in">
        <div :key="currentIndex" class="space-y-3">
          <button
            v-for="option in answerOptions"
            :key="option.value"
            @click="handleAnswer(option.value)"
            :class="[
              'w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-150 text-left group',
              selectedAnswer === option.value
                ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                : 'border-slate-100 bg-white/70 hover:border-slate-200 hover:bg-white/90'
            ]"
          >
            <span
              class="text-sm font-medium transition-colors"
              :class="selectedAnswer === option.value ? 'text-indigo-700' : 'text-slate-600'"
            >
              {{ option.label }}
            </span>

            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150"
              :class="selectedAnswer === option.value
                ? 'border-indigo-400 bg-indigo-400'
                : 'border-slate-200 group-hover:border-slate-300'"
            >
              <svg
                v-if="selectedAnswer === option.value"
                class="w-3 h-3 text-white"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </button>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuestions }        from '~/composables/useQuestions'
import { useAssessmentStore }  from '~/stores/assessment'

const { questions, loading, error, fetchQuestions } = useQuestions()
const store = useAssessmentStore()

const currentIndex   = ref(0)
const answers        = ref<Record<number, number>>({})
const selectedAnswer = ref<number | null>(null)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const progressPercent = computed(() =>
  questions.value.length > 0
    ? (currentIndex.value / questions.value.length) * 100
    : 0
)

const answerOptions = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'Nearly every day' },
]

function handleAnswer(value: number): void {
  if (!currentQuestion.value) return

  selectedAnswer.value                       = value
  answers.value[currentQuestion.value.order] = value

  setTimeout(() => {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++
      selectedAnswer.value = answers.value[questions.value[currentIndex.value]?.order ?? 0] ?? null
    } else {
      store.setAnswers(answers.value, questions.value.length)
      navigateTo('/result')
    }
  }, 400)
}

function goBack(): void {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = answers.value[questions.value[currentIndex.value]?.order ?? 0] ?? null
  }
}

onMounted(fetchQuestions)
</script>

<style scoped>
.question-enter-active,
.question-leave-active {
  transition: all 0.3s ease;
}
.question-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.question-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.options-enter-active,
.options-leave-active {
  transition: all 0.3s ease;
}
.options-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.options-leave-to {
  opacity: 0;
}
</style>