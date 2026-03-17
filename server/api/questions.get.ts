import { defineEventHandler, createError } from 'h3'

interface NotionTextContent {
  plain_text: string
}

interface NotionProperty {
  type:       string
  title?:     NotionTextContent[]
  rich_text?: NotionTextContent[]
  select?:    { name: string } | null
  number?:    number | null
  checkbox?:  boolean
}

interface NotionPage {
  properties: Record<string, NotionProperty>
}

interface NotionResponse {
  results: NotionPage[]
}

interface Question {
  id:    number
  text:  string
  type:  'anxiety' | 'depression'
  order: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  console.log('API Key exists:', !!config.notionApiKey)
  console.log('DB ID exists:',  !!config.notionQuestionDb)

  const response = await fetch(
    `https://api.notion.com/v1/databases/${config.notionQuestionDb}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization':  `Bearer ${config.notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type':   'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'is_active',
          checkbox: { equals: true },
        },
        sorts: [
          { property: 'order', direction: 'ascending' },
        ],
      }),
    }
  )

  console.log('Notion response status:', response.status)

  if (!response.ok) {
    const errorBody = await response.json()
    console.log('Notion error:', JSON.stringify(errorBody))
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch questions from Notion' })
  }

  const data = await response.json() as NotionResponse
  console.log('Questions count:', data.results.length)

  const questions: Question[] = data.results.map((page: NotionPage) => {
    const props = page.properties
    const text  = props['question_text']?.title?.[0]?.plain_text ?? ''
    const type  = (props['type']?.select?.name ?? 'anxiety')      as 'anxiety' | 'depression'
    const order = props['order']?.number                          ?? 0

    return { id: order, text, type, order }
  })

  return questions
})