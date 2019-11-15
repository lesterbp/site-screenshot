const { getLogger } = require('../logging/logger')
const { processScreenshot } = require('./screenshotHandler')

exports.captureScreenshot = async (req, res) => {
  const log = getLogger()
  const paramSource = req.method === 'GET' ? req.params : req.body
  const { url } = paramSource

  let result = { data: {} }
  let statusCode = 200

  try {
    const processInput = typeof url === 'string' ?  [url] : url
    const processResult = await processScreenshot(processInput)
    result.data = processResult
  } catch (e) {
    log.error('rest:captureScreenshot: encountered error', { errorMessage: e.message })
    statusCode = 500
    result.error = e.message
  }

  res.status(statusCode).json(result)
}
