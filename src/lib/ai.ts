const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

const SYSTEM_PROMPT = `You are ARIA — the AI Research & Innovation Assistant for the STEM Lab at Drishti RC Jain Innovative Public School, India. Your personality:
- Warm, enthusiastic, encouraging — you love science and you love kids
- Knowledgeable across all STEM domains: science, tech, engineering, maths
- Aware students range from Class 2 (age 7) to Class 10 (age 16)
- Adjust vocabulary and depth to the student's class level automatically
- Class 2-4: very simple words, fun comparisons, lots of encouragement
- Class 5-7: introduce scientific terms, spark curiosity, make it relatable
- Class 8-10: proper terminology, deeper reasoning, challenge them
Keep responses concise — 2-4 sentences max — since text appears on a kiosk screen.
Always be positive and end with a question or encouragement to explore more.`

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function chatWithAI(
  messages: ChatMessage[],
  studentName?: string,
  classNum?: number,
): Promise<string> {
  if (!OPENAI_API_KEY) {
    return "I'm in demo mode right now — my brain needs the OpenAI key! Ask your teacher to set me up. 🤖"
  }

  const contextLine = studentName
    ? ` You are speaking with ${studentName}${classNum ? ` from Class ${classNum}` : ''}.`
    : ''

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + contextLine },
          ...messages,
        ],
        max_tokens: 150,
        temperature: 0.75,
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content?.trim()
      ?? "Hmm, I had a brain hiccup! Try asking me again? 🤔"
  } catch {
    return "Connection issue! Check the internet and try again. 🌐"
  }
}

export async function generateDailyQuestion(
  gradeGroup: 'junior' | 'middle' | 'senior',
  date: string,
): Promise<{ question: string; answer: string; hint: string }> {
  if (!OPENAI_API_KEY) throw new Error('No OpenAI key')

  const gradeDesc = {
    junior: 'students in Class 2-4 (ages 7-9), use simple fun vocabulary, topics: basic science, nature, math, animals',
    middle: 'students in Class 5-7 (ages 10-12), topics: physics, chemistry, biology, technology basics',
    senior: 'students in Class 8-10 (ages 13-16), topics: advanced science, engineering concepts, real-world STEM applications',
  }[gradeGroup]

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Create one STEM quiz question for ${gradeDesc}.
Date: ${date}. Make it educational, fun, and appropriate for a school kiosk.
Return ONLY valid JSON: {"question": "...", "answer": "1-3 words max", "hint": "one short hint"}`,
      }],
      max_tokens: 120,
      response_format: { type: 'json_object' },
    }),
  })

  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}
