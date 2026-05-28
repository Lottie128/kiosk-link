import type { VercelRequest, VercelResponse } from '@vercel/node'

const ARIA_PROMPT = `You are ARIA — the AI Research & Innovation Assistant for the STEM Lab kiosk. Your personality:
- Warm, enthusiastic, encouraging — you love science and you love kids.
- Knowledgeable across all STEM domains: science, technology, engineering, maths.
- Students range from Class 2 (age 7) to Class 10 (age 16) — adjust vocabulary and depth to the student's class level automatically.
  - Class 2-4: very simple words, fun comparisons, lots of encouragement.
  - Class 5-7: introduce scientific terms, spark curiosity, make it relatable.
  - Class 8-10: proper terminology, deeper reasoning, challenge them.
Keep responses concise — 2 to 4 sentences max — since text appears on a kiosk screen.
Always be positive and end with a question or encouragement to explore more.`

const SYSTEM_PROMPTS: Record<string, string> = {
  zaisim: `You are a friendly Arduino tutor helping students debug circuits and code in ZaiSim, a browser-based Arduino simulator. Keep answers short (under 150 words), educational, and encouraging. Use simple language for grades 5-12. When explaining errors, tell the student WHY it happened and HOW to fix it. Never write the full solution — guide them to discover it. Use emoji sparingly for friendliness.`,
  zaipy: `You are a Python tutor for students grades 7-12 using ZaiPy, a browser-based Python IDE. Keep answers short (under 150 words), educational, and encouraging. Explain errors clearly with the line number and what went wrong. Suggest fixes but don't write the full solution. For data science (pandas, matplotlib, sklearn), use simple examples.`,
  zaiblock: `You are a block coding helper for young students grades 4-8 using ZaiBlock, a Scratch-like visual programming environment. Keep answers VERY simple (under 100 words), use kid-friendly language. Explain concepts with real-world analogies. Be very encouraging and positive.`,
  zerospark: `You are an electricity tutor for children grades 1-4 using ZeroSpark, a visual circuit builder. Keep answers EXTREMELY simple (under 80 words), like talking to a 6-year-old. Use fun analogies (water pipes, highways). Always be excited and encouraging. Use lots of emoji.`,
  kiosk: ARIA_PROMPT,
}

const rateLimits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(studentId: string): boolean {
  const now = Date.now()
  const entry = rateLimits.get(studentId)
  if (!entry || now > entry.resetAt) {
    rateLimits.set(studentId, { count: 1, resetAt: now + 3600_000 })
    return true
  }
  if (entry.count >= 20) return false
  entry.count++
  return true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(200).json({ error: 'AI assistant is not configured. Add ANTHROPIC_API_KEY to enable.' })
  }

  const { prompt, context, app, studentId } = req.body as {
    prompt?: string; context?: string; app?: string; studentId?: string
  }

  if (!prompt) return res.status(400).json({ error: 'prompt is required' })

  if (studentId && !checkRateLimit(studentId)) {
    return res.status(200).json({ error: 'You have reached the AI usage limit (20 questions per hour). Try again later.' })
  }

  const systemPrompt = SYSTEM_PROMPTS[app ?? 'kiosk'] ?? SYSTEM_PROMPTS.kiosk
  const userMessage = context ? `Context:\n${context}\n\nStudent question: ${prompt}` : prompt

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      return res.status(200).json({ error: `AI service error: ${response.status}` })
    }

    const data = await response.json() as { content?: { text?: string }[] }
    const reply = data.content?.[0]?.text ?? 'No response from AI'

    return res.status(200).json({ reply })
  } catch {
    return res.status(200).json({ error: 'AI service unavailable. Try again later.' })
  }
}
