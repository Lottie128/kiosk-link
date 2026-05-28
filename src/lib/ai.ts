export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Posts to the server-side /api/ai route (Claude, key held server-side). Returns
// { reply } on success or { error } (HTTP 200) when the key is missing / limited.
async function callAI(prompt: string, context: string, studentId?: string): Promise<{ reply: string | null; error: string | null }> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context, app: 'kiosk', studentId }),
    })
    const data = await res.json() as { reply?: string; error?: string }
    if (data.error) return { reply: null, error: data.error }
    return { reply: data.reply ?? null, error: null }
  } catch {
    return { reply: null, error: 'network' }
  }
}

export async function chatWithAI(
  messages: ChatMessage[] | string,
  studentName?: string,
  classNum?: number,
): Promise<string> {
  // Accept either a single string or a ChatMessage[] history.
  const history: ChatMessage[] = typeof messages === 'string'
    ? [{ role: 'user', content: messages }]
    : messages

  const last = history[history.length - 1]
  const prompt = last?.content ?? 'Tell me something cool about STEM!'

  const ctxParts: string[] = []
  if (studentName) ctxParts.push(`You are speaking with ${studentName}${classNum ? ` from Class ${classNum}` : ''}.`)
  const prior = history.slice(0, -1).slice(-8)
  if (prior.length) {
    ctxParts.push('Recent conversation:\n' + prior.map(m => `${m.role === 'user' ? 'Student' : 'ARIA'}: ${m.content}`).join('\n'))
  }

  const { reply, error } = await callAI(prompt, ctxParts.join('\n\n'))
  if (reply) return reply
  if (error === 'network') return "Connection issue! Check the internet and try again. 🌐"
  if (error && /not configured/i.test(error)) return "I'm in demo mode right now — my brain needs an API key! Ask your teacher to set me up. 🤖"
  return error ?? "Hmm, I had a brain hiccup! Try asking me again? 🤔"
}

export async function generateDailyQuestion(
  gradeGroup: 'junior' | 'middle' | 'senior',
  date: string,
): Promise<{ question: string; answer: string; hint: string }> {
  const gradeDesc = {
    junior: 'students in Class 2-4 (ages 7-9), use simple fun vocabulary, topics: basic science, nature, math, animals',
    middle: 'students in Class 5-7 (ages 10-12), topics: physics, chemistry, biology, technology basics',
    senior: 'students in Class 8-10 (ages 13-16), topics: advanced science, engineering concepts, real-world STEM applications',
  }[gradeGroup]

  const prompt = `Create one STEM quiz question for ${gradeDesc}.
Date: ${date}. Make it educational, fun, and appropriate for a school kiosk.
Return ONLY valid JSON, no markdown fences: {"question": "...", "answer": "1-3 words max", "hint": "one short hint"}`

  const { reply, error } = await callAI(prompt, '')
  if (!reply) throw new Error(error ?? 'AI unavailable')

  const cleaned = reply.replace(/```json\s*|\s*```/g, '').trim()
  return JSON.parse(cleaned)
}
