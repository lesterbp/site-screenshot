const fs = require('fs')
const uuid = require('uuid')
const { getLogger } = require('../logging/logger')
const siteScreenshot = require('../database/siteScreenshot')

const STATUS_PENDING = 'PENDING'

exports.addToQueue = async (urls = []) => {
  const log = getLogger()

  if (!Array.isArray(urls)) {
    return { error: 'given input is not array' }
  }

  if (urls.length <= 0) {
    return { error: 'no input given' }
  }

  const files = urls.map((url) => ({
    url,
    fileKey: null,
    path: null,
    error: null,
  }))

  const batchId = uuid.v4()
  const batchData = {
    batchId,
    metadata: { files, error: null },
    status: STATUS_PENDING,
  }

  log.info('addToQueue: saving to batch table', batchData)
  await siteScreenshot.saveToBatch(batchData)

  return { batchId }
}

exports.getBatchData = async (id) => {
  const batchRows = await siteScreenshot.retrieveBatch(id)

  if (!batchRows.length) {
    return { error: 'batch not found' }
  }

  const batch = batchRows[0] || {}

  return {
    status: batch.status,
    batchData: {
      batchId: id,
      ...batch.screenshot_metadata,
      files: batch.screenshot_metadata.files.map((file) => ({
        error: file.error,
        key: file.fileKey,
        url: file.url,
      })),
    },
  }
}

exports.getScreenshotFile = async (batchId, fileKey) => {
  const batchRows = await siteScreenshot.retrieveBatch(batchId)

  if (!batchRows.length) {
    throw new Error('batch not found')
  }

  const batch = batchRows[0] || {}
  const fileDetails = batch.screenshot_metadata.files.find((file) => file.fileKey === fileKey)

  if (!fileDetails) {
    throw new Error('file key not found')
  }

  try {
    return fs.readFileSync(`${process.env.SCREENSHOTS_PATH}${fileDetails.path}`)
  } catch (error) {
    throw new Error('file reading error')
  }
}
