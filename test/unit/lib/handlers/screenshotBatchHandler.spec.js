const { describe, it, afterEach, beforeEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')
const { getLogger } = require('../../../../src/lib/logging/logger')
const fs = require('fs')
const uuid = require('uuid')
const capture = require('../../../../src/lib/screenshot/capture')
const siteScreenshot = require('../../../../src/lib/database/siteScreenshot')
const {
  processBatches,
} = require('../../../../src/lib/handlers/screenshotBatchHandler')

const sandbox = sinon.createSandbox()

getLogger({ level: 'error' }) // only log errors

describe('screenshotBatchHandler', () => {
  let uuidStub
  let updateBatchByIdStub
  let updateAndReturnSingleBatchStatusStub
  let takeScreenshotStub
  let mkdirSyncStub

  beforeEach(() => {
    uuidStub = sandbox.stub(uuid, 'v4').returns('testFileKeyUUID')
    updateBatchByIdStub = sandbox.stub(siteScreenshot, 'updateBatchById').callsFake(() => {
      process.env.ENABLE_BATCH_PROCESS = 'false'
    })

    batchRow = {
      id: 'testBatchId',
      screenshot_metadata: {
        error: null,
        files: [{
          url: "http://www.example1.com",
          path: null,
          error: null,
          fileKey: null,
        }]
      },
      status: 'PENDING',
    }
    updateAndReturnSingleBatchStatusStub = sandbox.stub(siteScreenshot, 'updateAndReturnSingleBatchStatus').resolves([batchRow])

    mkdirSyncStub = sandbox.stub(fs, 'mkdirSync')
    takeScreenshotStub = sandbox.stub(capture, 'takeScreenshot').resolves('/testBatchId/testFileKeyUUID.png')
  })

  afterEach(() => {
    sandbox.restore()
    process.env.ENABLE_BATCH_PROCESS = 'true'
  })

  describe('processBatches', () => {
    it('process a batch', async () => {
      await processBatches()
      expect(uuidStub.calledOnce).to.be.equal(true)
      expect(updateAndReturnSingleBatchStatusStub.calledOnce).to.be.equal(true)
      expect(mkdirSyncStub.calledOnce).to.be.equal(true)
      expect(takeScreenshotStub.calledOnce).to.be.equal(true)
      expect(updateBatchByIdStub.getCall(0).args[0]).to.be.deep.equal({
        batchId: 'testBatchId',
        metadata: {
          error: null,
          files: [{
              url: "http://www.example1.com",
              path: `/testBatchId/testFileKeyUUID.png`,
              error: null,
              fileKey: 'testFileKeyUUID',
          }]
        },
        status: 'SUCCESS',
      })
    })
  })
})
