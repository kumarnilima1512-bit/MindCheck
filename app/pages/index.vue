
    <!-- Background orbs -->
   <template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden relative bg-gradient-to-br from-rose-50 via-pink-50/60 to-fuchsia-50/40">

    <!-- Falling petals -->
    <FallingPetals />

   

    <Transition name="slide" mode="out-in">

      <!-- Step 1: Form -->
      <div v-if="step === 'form'" key="form" class="relative z-10 w-full max-w-[440px]">

        <!-- Brand -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-emerald-700 rounded-2xl mb-3 shadow-md">
            <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 3a9 9 0 100 18A9 9 0 0012 3zm-1 13H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-semibold tracking-tight text-zinc-800">
            Mind<span class="text-emerald-700 italic">Check</span>
          </h1>
          <p class="text-xs tracking-widest uppercase text-zinc-400 mt-1">Mental wellness assessment</p>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm px-7 py-6 space-y-5">

          <!-- Name + Age -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="block text-[11px] font-medium tracking-widest uppercase text-zinc-400">Your name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Enter your name"
                class="w-full bg-zinc-50 border border-zinc-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-300"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-[11px] font-medium tracking-widest uppercase text-zinc-400">Age</label>
              <input
                v-model.number="form.age"
                type="number"
                placeholder="e.g. 24"
                min="10" max="99"
                :class="[
                  'w-full bg-zinc-50 border rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-300',
                  errors.age ? 'border-red-400 focus:ring-2 focus:ring-red-400/10' : 'border-zinc-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                ]"
              />
              <p v-if="errors.age" class="text-[11px] text-red-400">Enter a valid age (10–99)</p>
            </div>
          </div>

          <!-- Occupation -->
          <div class="space-y-1.5">
            <label class="block text-[11px] font-medium tracking-widest uppercase text-zinc-400">Occupation</label>
            <div class="relative">
              <select
                v-model="form.occupation"
                :class="[
                  'w-full appearance-none bg-zinc-50 border rounded-xl px-3.5 py-2.5 pr-9 text-sm outline-none transition-all',
                  form.occupation ? 'text-zinc-800' : 'text-zinc-300',
                  errors.occupation ? 'border-red-400 focus:ring-2 focus:ring-red-400/10' : 'border-zinc-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                ]"
              >
                <option value="" disabled>— Select occupation —</option>
                <optgroup label="Education">
                  <option value="student_school">School student</option>
                  <option value="student_college">College / university student</option>
                </optgroup>
                <optgroup label="Working professional">
                  <option value="employee_private">Private sector employee</option>
                  <option value="employee_govt">Government employee</option>
                  <option value="business">Business owner / entrepreneur</option>
                  <option value="freelancer">Freelancer / remote worker</option>
                  <option value="doctor">Doctor / healthcare worker</option>
                  <option value="teacher">Teacher / trainer</option>
                  <option value="engineer">Engineer / technician</option>
                  <option value="artist">Artist / creative professional</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="housewife">Homemaker</option>
                  <option value="retired">Retired</option>
                  <option value="unemployed">Unemployed / job seeking</option>
                  <option value="others">Others</option>
                </optgroup>
              </select>
              <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <p v-if="errors.occupation" class="text-[11px] text-red-400">Please select your occupation</p>
          </div>

          <!-- Gender -->
          <div class="space-y-1.5">
            <label class="block text-[11px] font-medium tracking-widest uppercase text-zinc-400">Gender</label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="g in genders"
                :key="g.value"
                type="button"
                @click="form.gender = g.value"
                :class="[
                  'flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border-[1.5px] transition-all duration-150 text-[11px] font-medium',
                  form.gender === g.value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"
                  v-html="g.icon">
                </svg>
                {{ g.label }}
              </button>
            </div>
            <p v-if="errors.gender" class="text-[11px] text-red-400">Please select your gender</p>
          </div>

          <div class="border-t border-zinc-100"></div>

          <!-- Submit -->
          <button
            type="button"
            @click="handleSubmit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-medium rounded-full py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/20 active:translate-y-0"
          >
            <template v-if="!loading">
              <span>Start assessment</span>
              <svg class="w-4 h-4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>
              </svg>
            </template>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"/>
              <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </button>

          <p class="text-center text-[11px] text-zinc-300">Completely private — no data is stored or shared</p>
        </div>
      </div>

      <!-- Step 2: Confirmation -->
      <div v-else key="confirm" class="relative z-10 w-full max-w-[440px]">
        <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm px-7 py-10 text-center space-y-4">

          <div class="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl">
            <svg class="w-7 h-7" fill="none" stroke="#059669" stroke-width="1.6"
              stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>

          <div>
            <h2 class="text-2xl font-semibold text-zinc-800">Welcome, {{ form.name || 'there' }}!</h2>
            <p class="text-sm text-zinc-400 mt-1">Your profile is ready. Here's what's ahead.</p>
          </div>

          <!-- Profile pill -->
          <div class="inline-flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-full px-4 py-2">
            <div class="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
           {{ (form.name?.[0] ?? 'Y').toUpperCase() }}
            </div>
            <span class="text-sm text-zinc-600">
              {{ form.age }} yrs · {{ occupationShort }} · {{ genderLabel }}
            </span>
          </div>

          <!-- Steps -->
          <div class="text-left space-y-3 pt-1">
            <div v-for="(s, i) in confirmSteps" :key="i" class="flex items-center gap-3 text-sm text-zinc-500">
              <div class="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span class="text-[10px] font-semibold text-emerald-700">{{ i + 1 }}</span>
              </div>
              {{ s }}
            </div>
          </div>

          <button
            type="button"
            @click="goNext"
            class="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-full py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/20 active:translate-y-0"
          >
            Let's begin →
          </button>
        </div>
      </div>

    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface UserForm {
  name: string
  age: number | null
  occupation: string
  gender: string
}

const step    = ref<'form' | 'confirm'>('form')
const loading = ref(false)

const form = ref<UserForm>({
  name: '',
  age: null,
  occupation: '',
  gender: '',
})

const errors = ref({ age: false, occupation: false, gender: false })

const genders = [
  {
    value: 'male', label: 'Male',
    icon: '<circle cx="10" cy="14" r="5"/><line x1="19" y1="5" x2="14.1" y2="9.9"/><polyline points="15 5 19 5 19 9"/>',
  },
  {
    value: 'female', label: 'Female',
    icon: '<circle cx="12" cy="8" r="5"/><line x1="12" y1="13" x2="12" y2="21"/><line x1="9" y1="18" x2="15" y2="18"/>',
  },
  {
    value: 'nonbinary', label: 'Non-binary',
    icon: '<circle cx="12" cy="11" r="5"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="9" y1="19" x2="15" y2="19"/><line x1="19" y1="5" x2="14.5" y2="9.5"/><polyline points="15 4 19 4 19 8"/>',
  },
  {
    value: 'prefer_not', label: 'Prefer not',
    icon: '<circle cx="12" cy="12" r="9"/><line x1="9" y1="12" x2="15" y2="12"/>',
  },
]

const occMap: Record<string, string> = {
  student_school:   'School student',
  student_college:  'University student',
  employee_private: 'Private employee',
  employee_govt:    'Govt. employee',
  business:         'Business owner',
  freelancer:       'Freelancer',
  doctor:           'Healthcare worker',
  teacher:          'Teacher',
  engineer:         'Engineer',
  artist:           'Creative professional',
  housewife:        'Homemaker',
  retired:          'Retired',
  unemployed:       'Unemployed',
  others:           'Other',
}

const occupationShort = computed(() => occMap[form.value.occupation] ?? '')
const genderLabel = computed<string>(() => genders.find(g => g.value === form.value.gender)?.label ?? '')

const confirmSteps = [
  'Science-backed questions on anxiety & depression',
  'Severity level assessed — Minimal to Extreme',
  'Personalised 30-day daily routine built for you',
]

function handleSubmit() {
  errors.value = { age: false, occupation: false, gender: false }
  let valid = true

  if (!form.value.age || form.value.age < 10 || form.value.age > 99) {
    errors.value.age = true; valid = false
  }
  if (!form.value.occupation) {
    errors.value.occupation = true; valid = false
  }
  if (!form.value.gender) {
    errors.value.gender = true; valid = false
  }
  if (!valid) return

  loading.value = true
  setTimeout(() => { loading.value = false; step.value = 'confirm' }, 800)
}

function goNext(){
  navigateTo('/questions')
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.32s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
</style>