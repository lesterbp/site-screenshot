const puppeteer = require('puppeteer-core')

exports.takeScreenshot = async (url, folder, filename = 'capture', ) => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })

  const folderPath = folder ? `/${folder}` : ''
  const path = `${process.env.SCREENSHOTS_PATH}${folderPath}/${filename}.png`
  await page.screenshot({path, fullPage: true})

  await browser.close()
}
