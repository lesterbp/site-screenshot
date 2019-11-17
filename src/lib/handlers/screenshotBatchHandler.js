const get = require('lodash.get')
const fs = require('fs')
const { promisify } = require('util')
const uuid = require('uuid')
const { getLogger } = require('../logging/logger')
const { takeScreenshot } = require('../screenshot/capture')
const {
  updateAndReturnSingleBatchStatus,
  updateBatchById,
} = require('../database/siteScreenshot')

const sleep = promisify(setTimeout)

const STATUS_PROCESSING = 'PROCESSING'
const STATUS_SUCCESS = 'SUCCESS'
const STATUS_ERROR = 'ERROR'

const processScreenshot = async (url, folder) => {
  const fileKey = uuid.v4()
  const result = {
    path: null, fileKey, error: null, url,
  }

  try {
    result.path = await takeScreenshot(url, folder, fileKey)
  } catch (error) {
    result.error = error.message
  }
  return result
}

const generateBatchScreenshots = (batchId, urls) => {
  fs.mkdirSync(`${process.env.SCREENSHOTS_PATH}/${batchId}`, { recursive: true })
  const processPromises = urls.map((url) => processScreenshot(url, batchId))
  return Promise.all(processPromises)
}

const processBatch = async (batch) => {
  const log = getLogger()
  let status = STATUS_SUCCESS
  const batchId = batch.id
  const files = get(batch, 'screenshot_metadata.files') || []
  const metadata = { files, error: null }

  try {
    const urls = files.map((file) => file.url)
    metadata.files = await generateBatchScreenshots(batchId, urls)
    const fileError = metadata.files.find((file) => !!file.error)

    if (fileError) {
      metadata.error = 'one or more files have error processing'
      status = STATUS_ERROR
    }
  } catch (error) {
    log.error('processBatch: error', error)
    status = STATUS_ERROR
    metadata.error = error.message
  }

  await updateBatchById({ batchId, status, metadata })
}

exports.processBatches = async () => {
  const log = getLogger()

  while (process.env.ENABLE_BATCH_PROCESS === 'true') {
    // eslint-disable-next-line
    const batchRows = await updateAndReturnSingleBatchStatus(STATUS_PROCESSING)

    if (!batchRows.length) {
      // eslint-disable-next-line
      await sleep(5000)
    } else if (batchRows.length > 0) {
      log.info('processBatches: processing batch', { batch: batchRows })
      // eslint-disable-next-line
      await processBatch(batchRows[0])
    }
  }
}
