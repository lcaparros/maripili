import * as schedule from 'node-schedule'
import { logDebug, logInfo } from './log.js'
import { frasesBuenosDias } from './assets.js'
import { getElementFromArray, searchGif, sleepMs } from './utils.js'

import { DESERTORES_CHAT_ID, LOG_LEVEL } from './config.js'

export function scheduleTasks(bot) {
  logInfo('Scheduling tasks')
  scheduleDesertoresTasks(bot)
  if (LOG_LEVEL === 'DEBUG') {
    let list = schedule.scheduledJobs
    logDebug('This is the list of scheduled jobs')
    logDebug(list)
  }
}

function scheduleDesertoresTasks(bot) {
  // const goodMorningDesertoresRule = '0 7 * * *'
  let goodMorningDesertoresRule = new schedule.RecurrenceRule()
  goodMorningDesertoresRule.tz = 'Europe/Madrid'
  goodMorningDesertoresRule.hour = 8
  goodMorningDesertoresRule.minute = 0
  goodMorningDesertoresRule.second = 0
  schedule.scheduleJob(goodMorningDesertoresRule, async () => {
    const gif = await searchGif('goat')
    logInfo(`Sending goat gif to ${DESERTORES_CHAT_ID}`)
    bot.sendAnimation(DESERTORES_CHAT_ID, gif)
    await sleepMs(1000)
    logInfo(`Sending good morning message to ${DESERTORES_CHAT_ID}`)
    bot.sendMessage(DESERTORES_CHAT_ID, getElementFromArray(frasesBuenosDias))
  })
  logInfo('Good morning desertores scheduled')

  // const goodNightDesertoresRule = '59 22 * * *'
  let goodNightDesertoresRule = new schedule.RecurrenceRule()
  goodNightDesertoresRule.tz = 'Europe/Madrid'
  goodNightDesertoresRule.hour = 0
  goodNightDesertoresRule.minute = 0
  goodNightDesertoresRule.second = 0
  schedule.scheduleJob(goodNightDesertoresRule, () => {
    logInfo(`Sending good night message to ${DESERTORES_CHAT_ID}`)
    bot.sendMessage(DESERTORES_CHAT_ID, 'A ustedes!!')
  })
  logInfo('Good night desertores scheduled')
}
