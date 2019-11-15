const { describe, it } = require('mocha')
const { expect } = require('chai')
const { getLogger } = require('../../../../src/lib/logging/logger')
const { takeScreenshot } = require('../../../../src/lib/screenshot/capture')

getLogger({ level: 'error' }) // only log errors

describe('capture', () => {
  describe('takeScreenshot', () => {
    const urlInput = 'http://www.google.com'
    it('returns array of bytes', async () => {
      const result = await takeScreenshot(urlInput)
      console.log(result)
      expect(result).to.be.not.equal(null)
    })
  })
})