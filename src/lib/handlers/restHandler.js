const { getLogger } = require('../logging/logger')
const { addToQueue, getBatchData, getScreenshotFile } = require('./screenshotHandler')

exports.captureScreenshot = async (req, res) => {
  const log = getLogger()
  const paramSource = req.method === 'GET' ? req.params : req.body
  const { url } = paramSource

  const result = { data: {} }
  let statusCode = 200

  try {
    const processInput = typeof url === 'string' ? [url] : url
    const processResult = await addToQueue(processInput)
    result.data = processResult

    if (processResult.error) {
      statusCode = 400
    }
  } catch (e) {
    log.error('rest:captureScreenshot: encountered error', { errorMessage: e.message })
    statusCode = 500
    result.error = e.message
  }

  res.status(statusCode).json(result)
}

exports.getBatch = async (req, res) => {
  const log = getLogger()
  const { id } = req.params
  const result = { data: {} }
  let statusCode = 200

  try {
    result.data = await getBatchData(id)
    if (result.data.error) {
      statusCode = 404
    }
  } catch (e) {
    log.error('rest:getBatch: encountered error', { errorMessage: e.message })
    statusCode = 500
    result.error = e.message
  }

  res.status(statusCode).json(result)
}

exports.getFile = async (req, res) => {
  const log = getLogger()
  const { batchId, fileKey } = req.params
  let statusCode = 200
  let fileData

  try {
    fileData = await getScreenshotFile(batchId, fileKey)
  } catch (e) {
    log.error('rest:getFile: encountered error', { errorMessage: e.message })
    statusCode = 404
  }

  res.writeHead(statusCode, { 'Content-Type': 'image/png' })
  if (fileData) {
    res.end(fileData)
  } else {
    res.end()
  }
}
