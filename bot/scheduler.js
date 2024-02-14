import * as schedule from 'node-schedule'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { logInfo } from './log.js'
import { frasesBuenosDias } from './assets.js'
import { getElementFromArray, randomFromPercentage, randomIntFromInterval, sleepMs } from './utils.js'

import { BOT_GIPHY_API_KEY, DESERTORES_CHAT_ID } from './config.js'

const gf = new GiphyFetch(BOT_GIPHY_API_KEY)

export function scheduleTasks(bot) {
  logInfo('Scheduling tasks')
  scheduleDesertoresTasks(bot)
}

function scheduleDesertoresTasks(bot) {
  schedule.scheduleJob('0 7 * * *', async () => {
    const offset = randomIntFromInterval(1, 40)
    const type = randomFromPercentage(50) ? 'gifs' : 'stickers'
    const { data: gifs } = await gf.search('goat', {
      sort: 'relevant',
      offset,
      limit: 1,
      type
    })
    logInfo(`Sending goat gif to ${DESERTORES_CHAT_ID}`)
    bot.sendAnimation(DESERTORES_CHAT_ID, gifs[0].images.original.url)
    await sleepMs(1000)
    logInfo(`Sending good morning message to ${DESERTORES_CHAT_ID}`)
    bot.sendMessage(DESERTORES_CHAT_ID, getElementFromArray(frasesBuenosDias))
  })
  logInfo('Good morning desertores scheduled')

  schedule.scheduleJob('59 22 * * *', () => {
    logInfo(`Sending good night message to ${DESERTORES_CHAT_ID}`)
    bot.sendMessage(DESERTORES_CHAT_ID, 'A ustedes!!')
  })
  logInfo('Good night desertores scheduled')
}
