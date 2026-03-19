import { defineEventHandler, getQuery, createError } from 'h3'

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
  url?:       string | null
}

interface NotionPage {
  properties: Record<string, NotionProperty>
}

interface NotionResponse {
  results: NotionPage[]
}

export interface RoutineActivity {
  day:          number
  title:        string
  timeOfDay:    'Morning' | 'Afternoon' | 'Evening'
  time:         string
  duration:     string
  youtubeUrl:   string | null
  thumbnailUrl: string | null
}

function extractVideoId(url: string | null): string | null {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match?.[1] ?? null
}

function getThumbnail(url: string | null): string | null {
  const id = extractVideoId(url)
  if (!id) return null
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
}

async function fetchFromNotion(dbId: string, apiKey: string, level: string): Promise<RoutineActivity[]> {
  console.log('Routine level:', level)
  console.log('DB ID exists:', !!dbId)

  const response = await fetch(
    `https://api.notion.com/v1/databases/${dbId}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization':  `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type':   'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'is_active',
          checkbox: { equals: true },
        },
        sorts: [
          { property: 'day',         direction: 'ascending' },
          { property: 'time_of_day', direction: 'ascending' },
        ],
        page_size: 100,
      }),
    }
  )

  console.log('Routine response status:', response.status)

  if (!response.ok) {
    const err = await response.json()
    console.error('Notion error:', JSON.stringify(err))
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch routine from Notion' })
  }

  const data = await response.json() as NotionResponse

  const activities: RoutineActivity[] = data.results.map((page: NotionPage) => {
    const props      = page.properties
    const title      = props['title']?.title?.[0]?.plain_text        ?? ''
    const day        = props['day']?.number                          ?? 0
    const timeOfDay  = (props['time_of_day']?.select?.name          ?? 'Morning') as 'Morning' | 'Afternoon' | 'Evening'
    const time       = props['time']?.rich_text?.[0]?.plain_text     ?? ''
    const duration   = props['duration']?.rich_text?.[0]?.plain_text ?? ''
    const youtubeUrl = props['youtube_url']?.url                     ?? null

    return {
      day,
      title,
      timeOfDay,
      time,
      duration,
      youtubeUrl,
      thumbnailUrl: getThumbnail(youtubeUrl),
    }
  })

  console.log('Activities count:', activities.length)

  return activities
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query  = getQuery(event)
  const level  = (query.level as string) ?? 'Minimal'

  let dbId: string

  if (level === 'Minimal' || level === 'Mild') {
    dbId = config.notionRoutineMinimalMildDb as string
  } else if (level === 'Moderate') {
    dbId = config.notionRoutineModerateDb as string
  } else {
    dbId = config.notionRoutineSevereDb as string
  }

  const activities = await fetchFromNotion(dbId, config.notionApiKey as string, level)

  return activities
})