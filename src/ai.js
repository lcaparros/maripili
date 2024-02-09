import OpenAI from 'openai'
import { OPENAI_API_KEY } from './config.js'
import { logInfo } from './log.js'
import ChatHistory from './ChatHistory.js'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
})

logInfo('Reseting AI chats')
const chats = []

export async function sendTelegamToAI(telegramMsg) {
  let chat = chats.filter((chatHistory) => chatHistory.chatId === telegramMsg.chat.id)
  if (chat.length === 0) {
    chat = new ChatHistory(telegramMsg.chat.id, telegramMsg.chat.type)
    chats.push(chat)
  } else {
    chat = chat[0]
  }
  chat.messages.push({
    role: 'user',
    content: `@${telegramMsg.from.username} | ${telegramMsg.from.first_name} - ${telegramMsg.text}`
  })
  logInfo(`AI request: ${telegramMsg.text}`)
  const aiResponse = await sendMessageToAI(chat.messages)
  logInfo(`AI response: ${aiResponse}`)
  chat.messages.push({
    role: 'assistant',
    content: aiResponse
  })
  return aiResponse
}

async function sendMessageToAI(messages) {
  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo'
  })
  const response = chatCompletion.choices[0].message.content
  return response
}
