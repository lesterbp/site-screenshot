const { describe, it } = require('mocha')
const { expect } = require('chai')
const { getLogger } = require('../../../../src/lib/logging/logger')
const { takeScreenshot } = require('../../../../src/lib/screenshot/capture')

getLogger({ level: 'error' }) // only log errors

describe('capture', () => {
  describe('takeScreenshot', () => {
    const urlInput = 'http://www.google.com'
    it('works', async () => {
      await takeScreenshot(urlInput, '', 'it_works')
      // expect() // TODO: mock of puppeteer should be called and browser is closed
    })
  })
})