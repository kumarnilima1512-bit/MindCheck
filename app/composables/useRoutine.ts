import { ref } from 'vue'

export interface RoutineActivity {
  day:          number
  title:        string
  timeOfDay:    'Morning' | 'Afternoon' | 'Evening'
  time:         string
  duration:     string
  youtubeUrl:   string | null
  thumbnailUrl: string | null
}

export interface RoutineDay {
  day:       number
  morning:   RoutineActivity[]
  afternoon: RoutineActivity[]
  evening:   RoutineActivity[]
  completed: boolean
}

export const useRoutine = () => {
  const routineDays = ref<RoutineDay[]>([])
  const loading     = ref(false)
  const error       = ref<string | null>(null)

  async function fetchRoutine(level: string): Promise<void> {
    loading.value = true
    error.value   = null

    try {
      const activities = await $fetch<RoutineActivity[]>('/api/routine', {
        query: { level },
      })

      const dayMap = new Map<number, RoutineDay>()

      for (let i = 1; i <= 30; i++) {
        dayMap.set(i, { day: i, morning: [], afternoon: [], evening: [], completed: false })
      }

      for (const activity of activities) {
        const d = dayMap.get(activity.day)
        if (!d) continue
        if (activity.timeOfDay === 'Morning')   d.morning.push(activity)
        if (activity.timeOfDay === 'Afternoon') d.afternoon.push(activity)
        if (activity.timeOfDay === 'Evening')   d.evening.push(activity)
      }

      routineDays.value = Array.from(dayMap.values())
    } catch (e) {
      error.value = 'Failed to load routine. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function toggleComplete(day: number): void {
    const d = routineDays.value.find(r => r.day === day)
    if (d) d.completed = !d.completed
  }

  return {
    routineDays,
    loading,
    error,
    fetchRoutine,
    toggleComplete,
  }
}