import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, blogTitle }: { messages: UIMessage[]; blogTitle?: string } =
    await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `You are Yuri, a friendly and knowledgeable space assistant for ZENITH — a space venture blog. You are named after Yuri Gagarin, the first human in space.

Your personality:
- Enthusiastic about space, science, and exploration
- Explain complex concepts in simple, engaging ways
- Use space metaphors and analogies when helpful
- Keep responses concise but informative (2-4 paragraphs max)
- Be encouraging and inspire curiosity

${blogTitle ? `The reader is currently reading an article titled: "${blogTitle}". When they ask about specific text from the article, explain it in context and provide additional insights.` : ""}

If asked about something unrelated to space, science, or the article, gently redirect them back to space topics while still being helpful.`,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
