const bunyan = require('bunyan')

let loggerIntance

exports.getLogger = (options = {}) => {
  if (!loggerIntance) {
    loggerIntance = bunyan.createLogger({
      name: 'site-screenshot',
      level: process.env.LOG_LEVEL || 'debug',
      ...options,
    })
  }

  return loggerIntance
}
