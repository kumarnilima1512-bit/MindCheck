import { defineStore } from 'pinia'

export type SeverityLevel = 'Minimal' | 'Mild' | 'Moderate' | 'Severe' | 'Extreme'

export interface LevelResult {
  level:       SeverityLevel
  label:       string
  color:       string
  bgColor:     string
  borderColor: string
  description: string
}

export interface AssessmentResult {
  anxietyScore:    number
  depressionScore: number
  totalScore:      number
  maxScore:        number
  percentScore:    number
  anxietyLevel:    LevelResult
  depressionLevel: LevelResult
  overallLevel:    LevelResult
}

function getLevel(percent: number): LevelResult {
  if (percent <= 20) return {
    level:       'Minimal',
    label:       'Minimal',
    color:       'text-emerald-600',
    bgColor:     'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Little to no symptoms detected.',
  }
  if (percent <= 40) return {
    level:       'Mild',
    label:       'Mild',
    color:       'text-yellow-600',
    bgColor:     'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: 'Some symptoms present but manageable.',
  }
  if (percent <= 60) return {
    level:       'Moderate',
    label:       'Moderate',
    color:       'text-orange-600',
    bgColor:     'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Noticeable symptoms affecting daily life.',
  }
  if (percent <= 80) return {
    level:       'Severe',
    label:       'Severe',
    color:       'text-red-600',
    bgColor:     'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Significant symptoms requiring attention.',
  }
  return {
    level:       'Extreme',
    label:       'Extreme',
    color:       'text-purple-700',
    bgColor:     'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Severe symptoms — please seek help immediately.',
  }
}

export const useAssessmentStore = defineStore('assessment', {
  state: () => ({
    answers:   {} as Record<number, number>,
    result:    null as AssessmentResult | null,
    userName:  '' as string,
    startedAt: null as string | null,
  }),

  actions: {
    setAnswers(answers: Record<number, number>, totalQuestions: number): void {
      this.answers   = answers
      this.startedAt = new Date().toISOString()

      const anxietyIds    = [1, 2, 3, 4, 5, 6, 7]
      const depressionIds = [8, 9, 10, 11, 12, 13, 14, 15]

      const anxietyScore    = anxietyIds.reduce((sum, id)    => sum + (answers[id] ?? 0), 0)
      const depressionScore = depressionIds.reduce((sum, id) => sum + (answers[id] ?? 0), 0)
      const totalScore      = anxietyScore + depressionScore
      const maxScore        = totalQuestions * 2
      const percentScore    = Math.round((totalScore / maxScore) * 100)

      const anxietyPercent    = Math.round((anxietyScore    / (anxietyIds.length    * 2)) * 100)
      const depressionPercent = Math.round((depressionScore / (depressionIds.length * 2)) * 100)

      this.result = {
        anxietyScore,
        depressionScore,
        totalScore,
        maxScore,
        percentScore,
        anxietyLevel:    getLevel(anxietyPercent),
        depressionLevel: getLevel(depressionPercent),
        overallLevel:    getLevel(percentScore),
      }
    },

    setUserName(name: string): void {
      this.userName = name
    },

    reset(): void {
      this.answers   = {}
      this.result    = null
      this.userName  = ''
      this.startedAt = null
    },
  },
})