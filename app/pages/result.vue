<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 px-4 py-12 overflow-hidden relative">

    <!-- Background -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl animate-[morph_10s_ease-in-out_infinite]"></div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-100/35 blur-3xl animate-[morph_12s_ease-in-out_infinite_2s]"></div>
      <div class="absolute top-16 right-16 w-24 h-24 rounded-full border border-blue-200/50 animate-[spin_20s_linear_infinite]"></div>
      <div class="absolute bottom-20 left-16 w-20 h-20 rounded-full border border-violet-200/40 animate-[spin_18s_linear_infinite]"></div>
    </div>

    <!-- No result guard -->
    <div v-if="!result" class="relative z-10 flex items-center justify-center min-h-screen">
      <div class="text-center space-y-4">
        <p class="text-sm text-slate-400">No results found.</p>
        <button
          @click="navigateTo('/')"
          class="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          Go back →
        </button>
      </div>
    </div>

    <div v-else class="relative z-10 max-w-xl mx-auto space-y-5">

      <!-- Header -->
      <div class="text-center space-y-1 mb-6">
        <h1 class="text-2xl font-semibold text-slate-700">Your results</h1>
        <p class="text-sm text-slate-400">Based on your responses today</p>
      </div>

      <!-- Overall score card -->
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm p-7">
        <div class="flex items-center justify-between mb-5">
          <div>
            <p class="text-xs font-medium tracking-widest uppercase text-slate-400 mb-1">Overall level</p>
            <p class="text-3xl font-semibold" :class="result.overallLevel.color">
              {{ result.overallLevel.label }}
            </p>
            <p class="text-sm text-slate-400 mt-1 max-w-[200px] leading-relaxed">
              {{ result.overallLevel.description }}
            </p>
          </div>

          <!-- Score ring -->
          <div class="relative w-20 h-20 flex-shrink-0">
            <svg class="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" stroke-width="8"/>
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                :stroke="ringColor"
                stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="`${result.percentScore * 2.01} 201`"
                class="transition-all duration-1000"
              />
            </svg>
            <span class="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-600">
              {{ result.percentScore }}%
            </span>
          </div>
        </div>

        <!-- Score bar -->
        <div class="space-y-1.5">
          <div class="flex justify-between text-xs text-slate-400">
            <span>Total score</span>
            <span>{{ result.totalScore }} / {{ result.maxScore }}</span>
          </div>
          <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out"
              :style="{ width: `${result.percentScore}%`, background: ringColor }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Anxiety + Depression breakdown -->
      <div class="grid grid-cols-2 gap-4">

        <!-- Anxiety -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <p class="text-xs font-medium tracking-widest uppercase text-slate-400">Anxiety</p>
          </div>
          <p class="text-xl font-semibold" :class="result.anxietyLevel.color">
            {{ result.anxietyLevel.label }}
          </p>
          <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000"
              :style="{ width: `${Math.round((result.anxietyScore / 14) * 100)}%`, background: anxietyRingColor }"
            ></div>
          </div>
          <p class="text-xs text-slate-400">{{ result.anxietyScore }} / 14</p>
        </div>

        <!-- Depression -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <p class="text-xs font-medium tracking-widest uppercase text-slate-400">Depression</p>
          </div>
          <p class="text-xl font-semibold" :class="result.depressionLevel.color">
            {{ result.depressionLevel.label }}
          </p>
          <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000"
              :style="{ width: `${Math.round((result.depressionScore / 16) * 100)}%`, background: depressionRingColor }"
            ></div>
          </div>
          <p class="text-xs text-slate-400">{{ result.depressionScore }} / 16</p>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="bg-amber-50/80 backdrop-blur-sm rounded-2xl border border-amber-100 p-5 space-y-2">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-xs font-semibold text-amber-700 tracking-wide uppercase">Important notice</p>
        </div>
        <p class="text-sm text-amber-700 leading-relaxed">
          These results are based on a self-reported screening tool and are <strong>not a clinical diagnosis</strong>.
          They are meant to give you a general sense of your mental wellbeing. If you are experiencing distress,
          please consult a licensed psychologist or mental health professional for a proper evaluation and support.
        </p>
      </div>

      <!-- Habit suggestions -->
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm p-7 space-y-5">
        <div>
          <p class="text-xs font-medium tracking-widest uppercase text-slate-400 mb-1">Personalised suggestions</p>
          <h2 class="text-lg font-semibold text-slate-700">Habits that can help you feel better</h2>
        </div>

        <div class="space-y-3">
          <div
            v-for="(habit, i) in habits"
            :key="i"
            class="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100"
          >
            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" :class="habit.bg">
              <svg class="w-4 h-4" :class="habit.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="habit.iconPath"/>
              </svg>
            </div>
            <div class="space-y-0.5">
              <p class="text-sm font-medium text-slate-700">{{ habit.title }}</p>
              <p class="text-xs text-slate-400 leading-relaxed">{{ habit.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="pb-8 flex gap-3">
        <button
          @click="navigateTo('/')"
          class="flex-1 py-3 rounded-full border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all duration-200"
        >
          Start over
        </button>
        <button
          @click="navigateTo('/routine')"
          class="flex-1 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-900/20 active:translate-y-0"
        >
          View my routine →
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAssessmentStore } from '~/stores/assessment'
import type { SeverityLevel } from '~/stores/assessment'

const store  = useAssessmentStore()
const result = computed(() => store.result)

const colorMap: Record<SeverityLevel, string> = {
  Minimal:  '#10b981',
  Mild:     '#eab308',
  Moderate: '#f97316',
  Severe:   '#ef4444',
  Extreme:  '#9333ea',
}

const ringColor           = computed(() => result.value ? colorMap[result.value.overallLevel.level]    : '#10b981')
const anxietyRingColor    = computed(() => result.value ? colorMap[result.value.anxietyLevel.level]    : '#10b981')
const depressionRingColor = computed(() => result.value ? colorMap[result.value.depressionLevel.level] : '#10b981')

interface Habit {
  title:       string
  description: string
  bg:          string
  iconColor:   string
  iconPath:    string
}

const habitsByLevel: Record<SeverityLevel, Habit[]> = {
  Minimal: [
    {
      title: 'Keep up your mindfulness practice',
      description: 'Even 5–10 minutes of meditation daily reinforces mental resilience.',
      bg: 'bg-emerald-100', iconColor: 'text-emerald-600',
      iconPath: 'M12 3v1m0 16v1m8.66-10h-1M4.34 12h-1m15.07-6.07l-.71.71M6.34 17.66l-.71.71m12.73 0l-.71-.71M6.34 6.34l-.71-.71M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      title: 'Stay physically active',
      description: 'Regular walks or light exercise keeps mood stable and energy levels up.',
      bg: 'bg-blue-100', iconColor: 'text-blue-600',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
    {
      title: 'Journaling',
      description: 'Writing 3 things you are grateful for each morning builds a positive mindset.',
      bg: 'bg-yellow-100', iconColor: 'text-yellow-600',
      iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    },
    {
      title: 'Protect your sleep',
      description: 'Aim for 7–8 hours. Consistent sleep is one of the strongest mental health tools.',
      bg: 'bg-indigo-100', iconColor: 'text-indigo-600',
      iconPath: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
    },
  ],
  Mild: [
    {
      title: 'Practice deep breathing',
      description: 'Try box breathing (4s in, 4s hold, 4s out, 4s hold) when you feel tense.',
      bg: 'bg-blue-100', iconColor: 'text-blue-600',
      iconPath: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Limit screen time',
      description: 'Cut social media to under 1 hour a day. Passive scrolling worsens mild anxiety.',
      bg: 'bg-orange-100', iconColor: 'text-orange-600',
      iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
      title: 'Exercise at least 4 days a week',
      description: 'Even a 20-minute walk significantly reduces mild anxiety and low mood.',
      bg: 'bg-emerald-100', iconColor: 'text-emerald-600',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
    {
      title: 'Talk to someone you trust',
      description: 'Opening up to a friend or family member can relieve emotional pressure.',
      bg: 'bg-pink-100', iconColor: 'text-pink-600',
      iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    },
    {
      title: 'Reduce caffeine and alcohol',
      description: 'Both can amplify anxiety symptoms, especially in the evening.',
      bg: 'bg-yellow-100', iconColor: 'text-yellow-600',
      iconPath: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
    },
  ],
  Moderate: [
    {
      title: 'Consider speaking to a counsellor',
      description: 'A few sessions with a therapist can provide tools to manage moderate symptoms.',
      bg: 'bg-violet-100', iconColor: 'text-violet-600',
      iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      title: 'Build a daily structure',
      description: 'A consistent routine — wake, meals, work, rest — reduces decision fatigue.',
      bg: 'bg-indigo-100', iconColor: 'text-indigo-600',
      iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      title: 'Spend time in nature',
      description: 'Even 15 minutes outside in green space measurably lowers cortisol levels.',
      bg: 'bg-emerald-100', iconColor: 'text-emerald-600',
      iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Avoid negative news and content',
      description: 'Set a media boundary. Constant bad news feeds anxiety loops.',
      bg: 'bg-orange-100', iconColor: 'text-orange-600',
      iconPath: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
    },
    {
      title: 'Prioritise sleep hygiene',
      description: 'No screens 1 hour before bed. Same sleep and wake time every day.',
      bg: 'bg-blue-100', iconColor: 'text-blue-600',
      iconPath: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
    },
  ],
  Severe: [
    {
      title: 'Please consult a professional',
      description: 'A psychologist or psychiatrist can provide a proper diagnosis and treatment plan.',
      bg: 'bg-red-100', iconColor: 'text-red-600',
      iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    },
    {
      title: 'Do not isolate yourself',
      description: 'Stay connected with trusted people. Isolation makes severe symptoms worse.',
      bg: 'bg-pink-100', iconColor: 'text-pink-600',
      iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      title: 'Use grounding techniques daily',
      description: 'The 5-4-3-2-1 method helps interrupt anxious thought spirals in the moment.',
      bg: 'bg-blue-100', iconColor: 'text-blue-600',
      iconPath: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    },
    {
      title: 'Avoid alcohol and substances',
      description: 'These worsen severe depression and anxiety even if they feel relieving short-term.',
      bg: 'bg-orange-100', iconColor: 'text-orange-600',
      iconPath: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
    },
    {
      title: 'Aim for 8 hours of sleep',
      description: 'Sleep deprivation severely amplifies all mental health symptoms.',
      bg: 'bg-indigo-100', iconColor: 'text-indigo-600',
      iconPath: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
    },
  ],
  Extreme: [
    {
      title: 'Seek help today',
      description: 'Please reach out to a mental health professional or visit a clinic as soon as possible.',
      bg: 'bg-purple-100', iconColor: 'text-purple-600',
      iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    },
    {
      title: 'Call a helpline',
      description: 'iCall (India): 9152987821 — Kaan Pete Roi (Bangladesh): 01779-554391.',
      bg: 'bg-red-100', iconColor: 'text-red-600',
      iconPath: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    },
    {
      title: 'Tell someone close to you',
      description: 'Let a family member or trusted friend know how you are feeling right now.',
      bg: 'bg-pink-100', iconColor: 'text-pink-600',
      iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    },
    {
      title: 'Consider inpatient support if needed',
      description: 'There is no shame in getting intensive professional support — it can be life-changing.',
      bg: 'bg-orange-100', iconColor: 'text-orange-600',
      iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
  ],
}

const habits = computed<Habit[]>(() =>
  result.value ? (habitsByLevel[result.value.overallLevel.level] ?? []) : []
)
</script>