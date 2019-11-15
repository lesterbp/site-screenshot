var fs = require('fs')
const uuid = require('uuid')
const { takeScreenshot } = require('../screenshot/capture')

const processScreenshotFiling = async (url, folder, key) => {
  const path = await takeScreenshot(url, folder, key)
  return { url, key, path }
}

exports.processScreenshot = async (urls = []) => {
  // TODO url validation
  // TODO URL array length limit
  // TODO saving of paths to DB
  // TODO logging

  if (!Array.isArray(urls)) {
    throw new Error('processScreenshot: input given [urls] is not an array')
  }

  if (urls.length <= 0) {
    return {}
  }

  const sessionId = uuid.v4()
  fs.mkdirSync(`${process.env.SCREENSHOTS_PATH}/${sessionId}`, { recursive: true })

  const capturePromises = urls.map((url) => {
    const fileId = uuid.v4()
    return processScreenshotFiling(url, sessionId, fileId)
  })

  const captureMetaList = await Promise.all(capturePromises)
  return {
    sessionId,
    result: captureMetaList
  }
}
