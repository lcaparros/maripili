import pc from 'picocolors'

const { LOG_LEVEL } = process.env

const symbol = {
  debug: pc.cyan('🛠'),
  info: pc.cyan('ℹ'),
  success: pc.green('✔'),
  warning: pc.yellow('⚠'),
  error: pc.red('✖')
}

export const logDebug = (...args) => {
  if (LOG_LEVEL === 'DEBUG') console.log(`${symbol.debug} ${pc.cyan(...args)}`)
}
export const logInfo = (...args) => console.log(`${symbol.info} ${pc.cyan(...args)}`)
export const logError = (...args) => console.log(`${symbol.error} ${pc.red(...args)}`)
export const logSuccess = (...args) => console.log(`${symbol.success} ${pc.green(...args)}`)
export const logWarning = (...args) => console.log(`${symbol.warning} ${pc.yellow(...args)}`)
