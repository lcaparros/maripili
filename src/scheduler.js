import * as schedule from 'node-schedule'
import { logDebug, logInfo } from './log.js'
import { frasesBuenosDias } from './assets.js'
import { getCurrentDate, getElementFromArray, isXmas, searchGif, sleepMs } from './utils.js'
import { ANGELA_CHAT_ID, DESERTORES_CHAT_ID, LOG_LEVEL, OH_YEAH_CHAT_ID, PERRUNEANDO_CHAT_ID } from './config.js'
import { askAI } from './ai.js'

export async function scheduleTasks(bot) {
  function scheduleJob(ruleConfig, task, logMessage) {
    let rule = new schedule.RecurrenceRule()
    Object.assign(rule, ruleConfig)
    rule.tz = 'Europe/Madrid'
    schedule.scheduleJob(rule, task)
    logInfo(logMessage)
  }

  async function sendMessageToChats(messageGenerator, chats, logMessage) {
    for (const chatId of chats) {
      const message = await messageGenerator()
      logInfo(`${logMessage} to ${chatId}`)
      bot.sendMessage(chatId, message)
    }
  }

  async function sendGifToChats(gifGenerator, chats, logMessage) {
    for (const chatId of chats) {
      const gif = await gifGenerator()
      logInfo(`${logMessage} to ${chatId}`)
      bot.sendAnimation(chatId, gif)
    }
  }

  logInfo('Scheduling tasks')

  scheduleJob(
    { hour: 8, minute: 0, second: 0 },
    async () => {
      const gifQuery = isXmas() ? 'goat' : 'christmas goat'
      const gif = await searchGif({ query: gifQuery })
      logInfo(`Sending goat gif to ${DESERTORES_CHAT_ID}`)
      bot.sendAnimation(DESERTORES_CHAT_ID, gif)

      await sleepMs(1000)
      logInfo(`Sending good morning message to ${DESERTORES_CHAT_ID}`)
      bot.sendMessage(DESERTORES_CHAT_ID, getElementFromArray(frasesBuenosDias))
    },
    'Good morning desertores scheduled'
  )

  scheduleJob(
    { hour: 0, minute: 0, second: 0 },
    () => {
      logInfo(`Sending good night message to ${DESERTORES_CHAT_ID}`)
      bot.sendMessage(DESERTORES_CHAT_ID, 'A ustedes!!')
    },
    'Good night desertores scheduled'
  )

  scheduleJob(
    { month: 11, date: 9, hour: 11, minute: 0, second: 0 },
    async () => {
      await sendMessageToChats(
        async () =>
          await askAI('Dime de forma graciosa y divertida que a partir de hoy queda inaugurada el periodo de Navidad. Quiero hartarme de reir con tu frase'),
        [DESERTORES_CHAT_ID, OH_YEAH_CHAT_ID, PERRUNEANDO_CHAT_ID],
        'Sending welcome Xmas message'
      )
    },
    'Welcome Xmas messages scheduled'
  )

  scheduleJob(
    { month: 11, date: 25, hour: 0, minute: 0, second: 0 },
    async () => {
      await sendGifToChats(
        () =>
          'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXZpNjZvbmNwbTh4NjB4YnRnbWNoMWY0bm9kd2E0M25remx1cjMxcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aZzcSMjQJ4v0GdAsYB/giphy.gif',
        [DESERTORES_CHAT_ID, OH_YEAH_CHAT_ID, PERRUNEANDO_CHAT_ID],
        'Sending Merry Xmas gif'
      )
      await sleepMs(1000)
      await sendMessageToChats(
        async () => await askAI('Felicitame la Navidad de forma graciosa y divertida. Quiero hartarme de reir con tu frase'),
        [DESERTORES_CHAT_ID, OH_YEAH_CHAT_ID, PERRUNEANDO_CHAT_ID],
        'Sending Merry Xmas message'
      )
    },
    'Merry Xmas messages scheduled'
  )

  scheduleJob(
    { month: 0, date: 1, hour: 0, minute: 0, second: 0 },
    async () => {
      await sendGifToChats(
        async () => await searchGif({ query: 'goat happy new year', offsetIndex: 0, type: 'gifs' }),
        [DESERTORES_CHAT_ID, OH_YEAH_CHAT_ID, PERRUNEANDO_CHAT_ID],
        'Sending Happy New Year gif'
      )
      await sleepMs(1000)
      await sendMessageToChats(
        async () => await askAI('Felicitame el año nuevo de una forma divertida, descarada y sarcastica que haga que me harte de reir'),
        [DESERTORES_CHAT_ID, OH_YEAH_CHAT_ID, PERRUNEANDO_CHAT_ID],
        'Sending Happy New Year message'
      )
    },
    'Happy New Year messages scheduled'
  )

  scheduleJob(
    { hour: 9, minute: 0, second: 0 },
    async () => {
      await sendGifToChats(async () => await searchGif({ query: 'goat good morning' }), [ANGELA_CHAT_ID], 'Sending Angela good morning gif')
      await sleepMs(1000)
      logInfo(`Sending good morning message to ${ANGELA_CHAT_ID}`)
      const mensajes = [
        `Dame los buenos días de forma alegre, divertida y motivadora. Si hay algo interesante que se celebre o haya ocurrido en ${getCurrentDate()}`,
        'Dame los buenos días de forma alegre, divertida y motivadora'
      ]
      const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)]
      const message = await askAI(mensaje)
      bot.sendMessage(ANGELA_CHAT_ID, message)
    },
    'Angela good morning messages schedule'
  )

  scheduleJob(
    { hour: 0, minute: 0, second: 0 },
    async () => {
      await sendGifToChats(async () => await searchGif({ query: 'goat good night' }), [ANGELA_CHAT_ID], 'Sending Angela good night gif')
      await sleepMs(1000)
      logInfo(`Sending good night message to ${ANGELA_CHAT_ID}`)
      const message = await askAI('Dame las buenas noches de forma alegre y divertida')
      bot.sendMessage(ANGELA_CHAT_ID, message)
    },
    'Angela good night messages schedule'
  )

  if (LOG_LEVEL === 'DEBUG') {
    let list = schedule.scheduledJobs
    logDebug('This is the list of scheduled jobs')
    logDebug(list)
  }
}
