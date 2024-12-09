import * as dotenv from 'dotenv'

dotenv.config()

export const {
  ANGELA_CHAT_ID,
  BOT_GIPHY_API_KEY,
  DESERTORES_CHAT_ID,
  LOG_LEVEL,
  LUIS_CHAT_ID,
  OH_YEAH_CHAT_ID,
  OPENAI_API_KEY,
  PERRUNEANDO_CHAT_ID,
  TELEGRAM_TOKEN
} = process.env
