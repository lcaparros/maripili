import { logInfo } from './log.js'
import { frasesChiquito, frasesLopera, frasesMariPili, insultos, respuestasInsultos, voicesChiquito, voicesHomer } from './assets.js'
import { getElementFromArray, randomFromPercentage } from './utils.js'
import { sendTelegamToAI } from './ai.js'

export function setActions(bot) {
  bot.onText(/^\/start/, function (msg) {
    const chatId = msg.chat.id
    const nameUser = msg.from.first_name

    logInfo(`Sending response to start comand to ${chatId}`)
    bot.sendMessage(chatId, `Que dise ${nameUser}?? Así no funsiona esto kabesa`)
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
