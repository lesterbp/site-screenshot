const { describe, it } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')
const puppeteer = require('puppeteer-core')
const { getLogger } = require('../../../../src/lib/logging/logger')
const { takeScreenshot } = require('../../../../src/lib/screenshot/capture')

const sandbox = sinon.createSandbox()

getLogger({ level: 'error' }) // only log errors

describe('capture', () => {
  let launchStub
  let gotoStub
  let screenshotStub

  beforeEach(() => {
    gotoStub = sandbox.stub().resolves()
    screenshotStub = sandbox.stub().resolves()

    launchStub = sandbox.stub(puppeteer, 'launch').resolves({
      newPage: async () => ({
        goto: gotoStub,
        screenshot: screenshotStub,
      }),
      close: () => {},
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('takeScreenshot', () => {
    const urlInput = 'http://www.example.com'

    it('opens page and takes screenshot', async () => {
      await takeScreenshot(urlInput, 'test_folder', 'test_file')

      expect(launchStub.calledOnce).to.be.equal(true)
      expect(gotoStub.calledOnce).to.be.equal(true)
      expect(screenshotStub.calledOnce).to.be.equal(true)
      expect(gotoStub.getCall(0).args[0]).to.be.equal(urlInput)

      const screenshotArg = screenshotStub.getCall(0).args[0]
      expect(screenshotArg).to.have.property('path')
      expect(screenshotArg.path).to.have.string('/test_folder/test_file.png')
    })
  })
})
