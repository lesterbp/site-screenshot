const puppeteer = require('puppeteer-core')
const { getLogger } = require('../logging/logger')

exports.takeScreenshot = async (url, folder, filename = 'capture') => {
  const log = getLogger()

  const executablePath = process.env.CHROMIUM_PATH
  log.debug('takeScreenshot: launching browser', { executablePath })

  const browser = await puppeteer.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })
  const page = await browser.newPage()

  log.debug('takeScreenshot: loading page', { url })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })

  const folderPath = folder ? `/${folder}` : ''
  const relativePath = `${folderPath}/${filename}.png`
  const path = `${process.env.SCREENSHOTS_PATH}${relativePath}`

  log.debug('takeScreenshot: capturing screenshot', { path })
  await page.screenshot({ path, fullPage: true })
  log.info('takeScreenshot: screenshot taken', { url, path })

  await browser.close()

  return relativePath
}
