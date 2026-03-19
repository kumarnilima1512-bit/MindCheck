<template>
  <div class="min-h-screen bg-[#fff8f8] overflow-x-hidden">

    <FallingPetals />

    <!-- Navbar -->
    <nav class="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-rose-600 rounded-xl flex items-center justify-center">
          <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12 3a9 9 0 100 18A9 9 0 0012 3zm-1 13H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
        <span class="text-lg font-semibold text-rose-900 tracking-tight">Mind<em class="text-rose-500 font-serif">Check</em></span>
      </div>
      <button @click="navigateTo('/assessment')" class="text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors">
        Take the assessment →
      </button>
    </nav>

    <!-- Hero -->
    <section class="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-24 text-center">
      <div class="inline-flex items-center gap-2 bg-rose-100 text-rose-600 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
        <div class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
        Free · Private · Science-backed
      </div>

      <h1 class="text-5xl font-bold text-rose-950 leading-tight tracking-tight mb-5">
        Understand your<br/>
        <span class="text-rose-500 font-serif italic">mental wellness</span><br/>
        in minutes
      </h1>

      <p class="text-lg text-rose-800/60 leading-relaxed max-w-xl mx-auto mb-10">
        MindCheck helps you assess your anxiety and depression levels using clinically validated questions,
        then builds a personalised 30-day routine to help you feel better — completely free.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          @click="navigateTo('/assessment')"
          class="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-600/25 active:translate-y-0"
        >
          Start free assessment →
        </button>
        
          <a href="#how-it-works"
          class="w-full sm:w-auto px-8 py-3.5 bg-white border border-rose-200 text-rose-600 text-sm font-medium rounded-full hover:bg-rose-50 transition-all duration-200"
        >
          See how it works
        </a>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-14">
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl border border-rose-100 p-4">
          <p class="text-2xl font-bold text-rose-600">15</p>
          <p class="text-xs text-rose-800/50 mt-0.5">Questions</p>
        </div>
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl border border-rose-100 p-4">
          <p class="text-2xl font-bold text-rose-600">30</p>
          <p class="text-xs text-rose-800/50 mt-0.5">Day routine</p>
        </div>
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl border border-rose-100 p-4">
          <p class="text-2xl font-bold text-rose-600">5</p>
          <p class="text-xs text-rose-800/50 mt-0.5">Severity levels</p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="relative z-10 bg-white/60 backdrop-blur-sm py-20 px-6">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-12">
          <p class="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-2">How it works</p>
          <h2 class="text-3xl font-bold text-rose-950 tracking-tight">Three simple steps</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="relative bg-white rounded-2xl border border-rose-100 p-6 shadow-sm"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" :class="step.bg">
              <svg class="w-5 h-5" :class="step.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="step.iconPath"/>
              </svg>
            </div>
            <div class="absolute top-5 right-5 text-3xl font-bold text-rose-100">{{ i + 1 }}</div>
            <h3 class="text-sm font-semibold text-rose-900 mb-2">{{ step.title }}</h3>
            <p class="text-xs text-rose-800/50 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="relative z-10 py-20 px-6">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-12">
          <p class="text-xs font-semibold tracking-widest uppercase text-rose-400 mb-2">Features</p>
          <h2 class="text-3xl font-bold text-rose-950 tracking-tight">Everything you need</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="(feature, i) in features"
            :key="i"
            class="flex items-start gap-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-rose-100 p-5"
          >
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" :class="feature.bg">
              <svg class="w-4 h-4" :class="feature.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="feature.iconPath"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-rose-900 mb-0.5">{{ feature.title }}</p>
              <p class="text-xs text-rose-800/50 leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="relative z-10 py-6 px-6">
      <div class="max-w-3xl mx-auto">
        <div class="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
          <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-xs text-amber-700 leading-relaxed">
            MindCheck is a self-assessment tool and <strong>not a substitute for professional medical advice</strong>.
            If you are in crisis or need immediate help, please contact a licensed mental health professional or call a helpline.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative z-10 py-20 px-6">
      <div class="max-w-xl mx-auto text-center">
        <div class="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-10 shadow-xl shadow-rose-200">
          <h2 class="text-3xl font-bold text-white mb-3 tracking-tight">Ready to check in?</h2>
          <p class="text-rose-100 text-sm leading-relaxed mb-8">
            Takes less than 3 minutes. No sign-up required. Your answers are never stored.
          </p>
          <button
            @click="navigateTo('/assessment')"
            class="px-10 py-3.5 bg-white text-rose-600 text-sm font-semibold rounded-full hover:bg-rose-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            Start free assessment →
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 py-8 px-6 border-t border-rose-100">
      <div class="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-rose-600 rounded-lg flex items-center justify-center">
            <svg class="w-3 h-3 fill-white" viewBox="0 0 24 24">
              <path d="M12 3a9 9 0 100 18A9 9 0 0012 3zm-1 13H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-rose-900">Mind<em class="text-rose-500 font-serif">Check</em></span>
        </div>
        <p class="text-xs text-rose-800/40">Not a medical device. For informational purposes only.</p>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
interface Step {
  title:       string
  description: string
  bg:          string
  iconColor:   string
  iconPath:    string
}

interface Feature {
  title:       string
  description: string
  bg:          string
  iconColor:   string
  iconPath:    string
}

const steps: Step[] = [
  {
    title:       'Answer 15 questions',
    description: 'Based on the clinically validated GAD-7 and PHQ-9 screening tools for anxiety and depression.',
    bg:          'bg-rose-100',
    iconColor:   'text-rose-600',
    iconPath:    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    title:       'Get your results',
    description: 'Receive a detailed breakdown of your anxiety and depression levels — from Minimal to Extreme.',
    bg:          'bg-pink-100',
    iconColor:   'text-pink-600',
    iconPath:    'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    title:       'Follow your routine',
    description: 'Get a personalised 30-day daily plan with guided exercises and YouTube videos tailored to your level.',
    bg:          'bg-fuchsia-100',
    iconColor:   'text-fuchsia-600',
    iconPath:    'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
]

const features: Feature[] = [
  {
    title:       'Science-backed questions',
    description: 'Uses GAD-7 for anxiety and PHQ-9 for depression — the same tools used by healthcare professionals.',
    bg:          'bg-rose-100',
    iconColor:   'text-rose-600',
    iconPath:    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title:       'Personalised 30-day routine',
    description: 'Your routine is tailored to your severity level — different plans for Minimal, Moderate, and Severe.',
    bg:          'bg-pink-100',
    iconColor:   'text-pink-600',
    iconPath:    'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title:       'Guided YouTube videos',
    description: 'Each activity comes with a curated YouTube video — from yoga to meditation to breathing exercises.',
    bg:          'bg-fuchsia-100',
    iconColor:   'text-fuchsia-600',
    iconPath:    'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title:       'Completely private',
    description: 'No account needed. No data stored. Your answers stay on your device and are never shared.',
    bg:          'bg-rose-100',
    iconColor:   'text-rose-600',
    iconPath:    'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    title:       '30-day cycle tracking',
    description: 'Track which days you have completed. After 30 days, the routine automatically repeats.',
    bg:          'bg-pink-100',
    iconColor:   'text-pink-600',
    iconPath:    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  },
  {
    title:       'Free forever',
    description: 'MindCheck is completely free to use with no hidden costs, subscriptions, or premium features.',
    bg:          'bg-fuchsia-100',
    iconColor:   'text-fuchsia-600',
    iconPath:    'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
]
</script>