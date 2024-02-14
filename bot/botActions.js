import { logInfo } from './log.js'
import { frasesChiquito, frasesLopera, frasesMariPili, insultos, respuestasInsultos, voicesChiquito, voicesHomer } from './assets.js'
import { getElementFromArray, randomFromPercentage } from './utils.js'
import { backUpChats, changeContext, changeMaxWords, getContext, sendTelegamToAI } from './ai.js'

export function setActions(bot) {
  bot.onText(/^\/help/, function (msg) {
    const chatId = msg.chat.id
    const nameUser = msg.from.first_name

    logInfo(`Printing help information in ${chatId}`)
    const helpMessage =
      '*Comandos:*\n\n/help Para mostrar la ayuda del bot\n/start Yo no lo probaría 😂\n/getChatId Devuelve el ID del chat desde el que se ejecuta el comando\n/maxWords Requiere los parámetros `chatId` y `newMaxWords` Este comando modificará el número máximo de palabras que usará el bot en sus mensajes de IA en un chat concreto Por defecto el valor es de 30 No obstante, en ocasiones puede poner mensajes más largos si la IA lo considera oportuno\n/getContext Requiere el parámetros `chatId` y te muestra el contexto actual para dicho chat\n/setContext Requiere los parámetros `chatId` y `newContext` y este comando sustituirá el contexto del bot en el chat\n/addContext Requiere los parámetros `chatId` y `contextToAdd` y este comando añadirá el contexto `contextToAdd` al contexto actual del bot en el chat\n/backup Realiza un backup de todas las conversaciones y configraciones referentes a la IA'
    bot.sendMessage(chatId, helpMessage, { parse_mode: 'MarkdownV2' })
  })

  bot.onText(/^\/start/, function (msg) {
    const chatId = msg.chat.id
    const nameUser = msg.from.first_name

    logInfo(`Sending response to start comand to ${chatId}`)
    bot.sendMessage(chatId, `Que dise ${nameUser}?? Así no funsiona esto kabesa`)
  })

  bot.onText(/^\/getChatId/, function (msg) {
    const chatId = msg.chat.id

    logInfo(`Sending chatID to ${chatId}`)
    bot.sendMessage(chatId, `El ID para este chat es: ${chatId}`)
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

    const context = getContext(targetChat)
    logInfo(`Getting context for chat ${targetChat} from chat ${chatId}`)
    bot.sendMessage(chatId, `Chat ${targetChat} context is: ${context}`)
  })

  bot.onText(/^\/setContext/, function (msg) {
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
