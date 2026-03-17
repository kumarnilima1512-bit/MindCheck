import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './app.vue',
  ],
  theme: {
    extend: {},
  },

  keyframes: {
  morph: {
    '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
    '50%':      { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
  },
  float: {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%':      { transform: 'translateY(-12px)' },
  },
},
animation: {
  morph: 'morph 10s ease-in-out infinite',
  float: 'float 6s ease-in-out infinite',
},
  plugins: [],
} satisfies Config