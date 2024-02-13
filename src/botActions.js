import { logInfo } from './log.js'
import { frasesChiquito, frasesLopera, frasesMariPili, insultos, respuestasInsultos, voicesChiquito, voicesHomer } from './assets.js'
import { getElementFromArray, randomFromPercentage } from './utils.js'
import { backUpChats, changeContext, changeMaxWords, getContext, sendTelegamToAI } from './ai.js'

export function setActions(bot) {
  bot.onText(/^\/help/, function (msg) {
    const chatId = msg.chat.id
    const nameUser = msg.from.first_name

    logInfo(`Sending response to start comand to ${chatId}`)
    bot.sendMessage(chatId, `Que dise ${nameUser}?? Así no funsiona esto kabesa`)
  })

  bot.onText(/^\/start/, function (msg) {
    const chatId = msg.chat.id
    const nameUser = msg.from.first_name

    logInfo(`Sending response to start comand to ${chatId}`)
    bot.sendMessage(chatId, `Que dise ${nameUser}?? Así no funsiona esto kabesa`)
  })

  bot.onText(/^\/maxWords/, function (msg) {
    const chatId = msg.chat.id
    const args = msg.text.match(/\S+/gi)
    const targetChat = args[1]
    const newWords = args[2]

    const oldWords = changeMaxWords(targetChat, newWords)
    logInfo(`Chat ${targetChat} maxWords modified from ${oldWords} to ${newWords} from chat ${chatId}`)
    bot.sendMessage(chatId, `Chat ${targetChat} maxWords modified from ${oldWords} to ${newWords}`)
  })

  bot.onText(/^\/getContext/, function (msg) {
    const chatId = msg.chat.id
    const args = msg.text.match(/\S+/gi)
    const targetChat = args[1]

    const context = getContext(targetChat, newContext)
    logInfo(`Getting context for chat ${targetChat} from chat ${chatId}`)
    bot.sendMessage(chatId, `Chat ${targetChat} context is: `)
  })

  bot.onText(/^\/changeContext/, function (msg) {
    const chatId = msg.chat.id
    const args = msg.text.match(/\S+/gi)
    const targetChat = args[1]
    const newContext = args.slice(2).join(' ')

    changeContext(targetChat, newContext)
    logInfo(`Chat ${targetChat} context modified from chat ${chatId}`)
    bot.sendMessage(chatId, `Chat ${targetChat} context modified`)
  })

  bot.onText(/^\/addContext/, function (msg) {
    const chatId = msg.chat.id
    const args = msg.text.match(/\S+/gi)
    const targetChat = args[1]
    const newContext = args.slice(2).join(' ')

    const context = getContext(targetChat, newContext)
    changeContext(targetChat, context + ' ' + newContext)
    logInfo(`New context details added to chat ${targetChat} context from chat ${chatId}`)
    bot.sendMessage(chatId, `Chat ${targetChat} context updated`)
  })

  bot.onText(/^\/backup/, async function (msg) {
    const chatId = msg.chat.id

    logInfo(`Back up chats ordered from chat ${chatId}`)
    await backUpChats()
    bot.sendMessage(chatId, `Chat back up created`)
  })

  bot.onText(/maripili|mari pili/i, function (msg) {
    const chatId = msg.chat.id
    logInfo(`Mari pili has been named in ${chatId}`)
    bot.sendMessage(chatId, getElementFromArray(frasesMariPili), {
      reply_to_message_id: msg.message_id
    })
  })

  bot.onText(new RegExp(insultos, 'i'), function (msg) {
    const chatId = msg.chat.id
    logInfo(`Insult said in ${chatId}`)
    bot.sendMessage(chatId, getElementFromArray(respuestasInsultos), {
      reply_to_message_id: msg.message_id
    })
  })

  bot.onText(/chiquito/i, function (msg) {
    const chatId = msg.chat.id
    if (randomFromPercentage(30)) {
      logInfo(`Sending Chiquito voice to ${chatId}`)
      bot.sendVoice(chatId, getElementFromArray(voicesChiquito))
    } else {
      logInfo(`Sending Chiquito message to ${chatId}`)
      bot.sendMessage(chatId, getElementFromArray(frasesChiquito))
    }
  })

  bot.onText(/lopera/i, function (msg) {
    const chatId = msg.chat.id
    logInfo(`Sending Lopera message to ${chatId}`)
    bot.sendMessage(chatId, getElementFromArray(frasesLopera))
  })

  bot.onText(/homer/i, function (msg) {
    const chatId = msg.chat.id
    logInfo(`Sending Homer voice to ${chatId}`)
    bot.sendVoice(chatId, getElementFromArray(voicesHomer))
  })

  bot.onText(/mari|pili|cabra|cabrita|loca/i, async function (msg) {
    const chatId = msg.chat.id
    logInfo(`Conversation with chat ${chatId}`)
    const aiResponse = await sendTelegamToAI(msg)
    bot.sendMessage(chatId, aiResponse)
  })
}
