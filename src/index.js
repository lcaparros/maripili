import TelegramBot from 'node-telegram-bot-api'

import { TELEGRAM_TOKEN } from './config.js'
import { logInfo, logError } from './log.js'
import { scheduleTasks } from './scheduler.js'
import { setActions } from './botActions.js'

const token = TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })

bot.on('polling_error', function (error) {
  logError('Error polling messages')
  console.log(error)
})

logInfo('Starting bot...')
scheduleTasks(bot)
setActions(bot)
logInfo('Bot ready and listening to new events')
