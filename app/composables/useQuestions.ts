import { ref } from 'vue'

export interface Question {
  id:    number
  text:  string
  type:  'anxiety' | 'depression'
  order: number
}

export const useQuestions = () => {
  const questions = ref<Question[]>([])
  const loading   = ref(false)
  const error     = ref<string | null>(null)

  async function fetchQuestions(): Promise<void> {
    loading.value = true
    error.value   = null

    try {
      questions.value = await $fetch<Question[]>('/api/questions')
    } catch (e) {
      error.value = 'Failed to load questions. Please try again.'
    } finally {
      loading.value = false
    }
  }

  return { questions, loading, error, fetchQuestions }
}