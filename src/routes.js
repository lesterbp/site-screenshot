const { getLogger } = require('./lib/logging/logger')
const restHandler = require('./lib/handlers/restHandler')

exports.setupRoute = (app) => {
  const log = getLogger()
  const BASE_PATH = process.env.API_BASE_PATH
  log.info('routes: setting base path', { basePath: BASE_PATH })

  app.get(`${BASE_PATH}/capture-screenshot/:url`, restHandler.captureScreenshot)
  app.post(`${BASE_PATH}/capture-screenshot`, restHandler.captureScreenshot)
  app.get(`${BASE_PATH}/batch/:id`, restHandler.getBatch)
  app.get(`${BASE_PATH}/file/:batchId/:fileKey`, restHandler.getFile)
}
