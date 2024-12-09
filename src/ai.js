import OpenAI from 'openai'
import { OPENAI_API_KEY } from './config.js'
import { logDebug, logInfo } from './log.js'
import Chat from './db/models/Chat.js'
import { connect, disconnect } from './db/index.js'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
})

logInfo('Retrieving AI chats from database')
await connect()
const chats = await Chat.find({})
await disconnect()
logDebug(chats)

export async function sendTelegamToAI(telegramMsg) {
  let chat = chats.find((c) => c.chatId == telegramMsg.chat.id)
  if (!chat) {
    chat = new Chat({
      chatId: telegramMsg.chat.id,
      type: telegramMsg.chat.type
    })
    chats.push(chat)
  }
  chat.messages.push({
    role: 'user',
    content: `@${telegramMsg.from.username} | ${telegramMsg.from.first_name} - ${telegramMsg.text}`
  })
  logInfo(`AI request: ${telegramMsg.text}`)
  const chatContext = [
    {
      role: 'system',
      content: `Sueles responder con no más de ${chat.maxWords} palabras a no ser que sea extrictamente necesario. ${chat.context}`
    }
  ]
  logDebug(chatContext.concat(chat.messages))
  const aiResponse = await sendMessageToAI(chatContext.concat(chat.messages))
  logInfo(`AI response: ${aiResponse}`)
  chat.messages.push({
    role: 'assistant',
    content: aiResponse
  })
  return aiResponse
}

export async function askAI(message) {
  const messages = [
    {
      role: 'system',
      content:
        'Sueles responder con no más de 30 palabras a no ser que sea extrictamente necesario. Eres un bot de Telegram con rol de asistente virtual. Eres una cabra blanca y te llamas Mari Pili. Los mensajes que recibas del role user puede que sean una conversación en la que participan varias personas, por lo que tus respuestas deben ir dirigidas a alguien en concreto o teniendo en cuenta las personas que forman parte de la conversación dar respuestas coherentes. Cuando el mensaje del role user venga como conversación el formato será del tipo: @interlocutorUsername | interlocutorNombre - mensaje. Sin embargo tus mensajes de respuesta nunca llevan ese formato. Para referirte a los participantes de la conversación puedes usar sus nombres (interlocutorNombre) o a veces puedes usar @interlocutorUsername para así mencionarlos.'
    },
    { role: 'user', content: message }
  ]
  return sendMessageToAI(messages)
}

export async function backUpChats(messages) {
  await connect()
  for (const chat of chats) {
    await chat.save()
  }
  await disconnect()
}

export function changeMaxWords(chatId, newWords) {
  const index = chats.findIndex((c) => c.chatId == chatId)
  const oldWords = chats[index].maxWords
  chats[index].maxWords = newWords
  return oldWords
}

export function changeContext(chatId, newContext) {
  const index = chats.findIndex((c) => c.chatId == chatId)
  chats[index].context = newContext
}

export function getContext(chatId) {
  const index = chats.findIndex((c) => c.chatId == chatId)
  return chats[index].context
}

async function sendMessageToAI(messages) {
  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo'
  })
  const response = chatCompletion.choices[0].message.content
  return response
}
