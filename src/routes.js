const { getLogger } = require('./lib/logging/logger')
const restHandler = require('./lib/handlers/restHandler')

exports.setupRoute = (app) => {
  const log = getLogger()
  const BASE_PATH = process.env.API_BASE_PATH
  log.info('routes: setting base path', { basePath: BASE_PATH })

  app.get(`${BASE_PATH}/capture-screenshot/:url`, restHandler.captureScreenshot)
  app.post(`${BASE_PATH}/capture-screenshot`, restHandler.captureScreenshot)
}
