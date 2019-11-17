const { describe, it, afterEach, beforeEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')
const { getLogger } = require('../../../../src/lib/logging/logger')
const fs = require('fs')
const uuid = require('uuid')
const siteScreenshot = require('../../../../src/lib/database/siteScreenshot')
const {
  addToQueue,
  getBatchData,
  getScreenshotFile,
} = require('../../../../src/lib/handlers/screenshotHandler')

const sandbox = sinon.createSandbox()

getLogger({ level: 'error' }) // only log errors

describe('screenshotHandler', () => {
  let uuidStub
  let saveToBatchStub
  let retrieveBatchRow
  let retrieveBatchStub
  let readFileSyncStub

  beforeEach(() => {
    uuidStub = sandbox.stub(uuid, 'v4').returns('testUUID')
    saveToBatchStub = sandbox.stub(siteScreenshot, 'saveToBatch').resolves()

    retrieveBatchRow = {
      id: 'testBatchId',
      screenshot_metadata: {
        error: null,
        files: [{
          url: "http://www.example1.com",
          path: "/testfolder/testfile.png",
          error: null,
          fileKey: "testfile",
        }]
      },
      status: 'SUCCESS',
    }
    retrieveBatchStub = sandbox.stub(siteScreenshot, 'retrieveBatch').resolves([retrieveBatchRow])

    readFileSyncStub = sandbox.stub(fs, 'readFileSync').returns('testfilestream')
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('addToQueue', () => {
    it('saves batch with correct structure', async () => {
      const input = [
        'http://www.testexample1.com',
        'http://www.testexample2.com'
      ]
      const result = await addToQueue(input)

      expect(result).to.deep.equal({ batchId: 'testUUID' })
      expect(uuidStub.calledOnce).to.be.equal(true)
      expect(saveToBatchStub.calledOnce).to.be.equal(true)
      expect(saveToBatchStub.getCall(0).args[0]).to.deep.equal({
        batchId: 'testUUID',
        metadata: {
          files: [
            { url: 'http://www.testexample1.com', fileKey: null, path: null, error: null },
            { url: 'http://www.testexample2.com', fileKey: null, path: null, error: null },
          ],
          error: null,
        },
        status: 'PENDING',
      })
    })

    it('returns error if input not array', async () => {
      const input = ''
      const result = await addToQueue(input)

      expect(result).to.have.property('error')
      expect(uuidStub.called).to.be.equal(false)
    })

    it('returns error if input empty array', async () => {
      const input = []
      const result = await addToQueue(input)

      expect(result).to.have.property('error')
      expect(uuidStub.called).to.be.equal(false)
    })
  })

  describe('getBatchData', () => {
    it('gets the batch and returns correct data structure', async () => {
      const input = 'testBatchId'
      const result = await getBatchData(input)
      
      expect(retrieveBatchStub.calledOnce).to.be.equal(true)
      expect(retrieveBatchStub.getCall(0).args[0]).to.be.equal(input)
      expect(result).to.deep.equal({
        status: retrieveBatchRow.status,
        batchData: {
          batchId: retrieveBatchRow.id,
          error: null,
          files: [
            {
              error: null,
              key: retrieveBatchRow.screenshot_metadata.files[0].fileKey,
              url: retrieveBatchRow.screenshot_metadata.files[0].url,
            }
          ]
        },
      })
    })

    it('returns error if batch not found', async () => {
      retrieveBatchStub.resolves([])
      const input = 'testBatchId'
      const result = await getBatchData(input)
      
      expect(retrieveBatchStub.calledOnce).to.be.equal(true)
      expect(result).to.have.property('error')
    })
  })

  describe('getScreenshotFile', () => {
    it('retieves file from db and file system', async () => {
      const result = await getScreenshotFile(
        'testBatchId',
        retrieveBatchRow.screenshot_metadata.files[0].fileKey,  
      )

      expect(result).to.be.equal('testfilestream')
      expect(retrieveBatchStub.calledOnce).to.be.equal(true)
      expect(retrieveBatchStub.getCall(0).args[0]).to.be.equal('testBatchId')
      expect(readFileSyncStub.calledOnce).to.be.equal(true)
      expect(readFileSyncStub.getCall(0).args[0]).to.be.equal(
        `${process.env.SCREENSHOTS_PATH}${retrieveBatchRow.screenshot_metadata.files[0].path}`
      )
    })
  })
})
