import * as dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api'
import * as schedule from 'node-schedule'
import { GiphyFetch } from '@giphy/js-fetch-api'

import { logInfo, logError } from './log.js'
import { frasesBuenosDias, frasesChiquito, frasesLopera, frasesMariPili, insultos, respuestasInsultos, voicesChiquito, voicesHomer } from './assets.js'
import { getElementFromArray, randomFromPercentage, randomIntFromInterval, sleepMs } from './utils.js'
import { fakeVoice, getVoices, getVoicesByLanguage, getVoicesByTitle, getVoicesModelTokenByTitle } from './fakeyou.js'

dotenv.config()

const chatIdDesertores = process.env.DESERTORES_CHAT_ID
const giphyToken = process.env.BOT_GIPHY_API_KEY
const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })

logInfo('Starting bot...')

const gf = new GiphyFetch(giphyToken)

logInfo('Scheduling tasks')

schedule.scheduleJob('0 8 * * *', async () => {
  const offset = randomIntFromInterval(1, 40)
  const type = randomFromPercentage(50) ? 'gifs' : 'stickers'
  const { data: gifs } = await gf.search('goat', {
    sort: 'relevant',
    offset,
    limit: 1,
    type
  })
  logInfo(`Sending goat gif to ${chatIdDesertores}`)
  bot.sendAnimation(chatIdDesertores, gifs[0].images.original.url)
  await sleepMs(1000)
  logInfo(`Sending good morning message to ${chatIdDesertores}`)
  bot.sendMessage(chatIdDesertores, getElementFromArray(frasesBuenosDias))
})
logInfo('Good morning desertores scheduled')

schedule.scheduleJob('59 23 * * *', () => {
  logInfo(`Sending good night message to ${chatIdDesertores}`)
  bot.sendMessage(chatIdDesertores, 'A ustedes!!')
})
logInfo('Good night desertores scheduled')

logInfo('Bot ready and listening to new events')

bot.on('polling_error', function (error) {
  logError('Error polling messages')
  console.log(error)
})

bot.onText(/^\/start/, function (msg) {
  const chatId = msg.chat.id
  const nameUser = msg.from.first_name

  logInfo(`Sending response to start comand to ${chatId}`)
  bot.sendMessage(chatId, `Que dise ${nameUser}?? Así no funsiona esto kabesa`)
})

bot.onText(/maripili|mari pili/i, function (msg) {
  const chatId = msg.chat.id
  logInfo(`Mari pili has been called in ${chatId}`)
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
