const { describe, it, afterEach, beforeEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')
const { getLogger } = require('../../../../src/lib/logging/logger')
const client = require('../../../../src/lib/database/client')
const {
  saveToBatch,
  retrieveBatch,
  updateAndReturnSingleBatchStatus,
  updateBatchById,
} = require('../../../../src/lib/database/siteScreenshot')

const sandbox = sinon.createSandbox()

getLogger({ level: 'error' }) // only log errors

describe('siteScreenshot', () => {
  let queryStub

  beforeEach(() => {
    queryStub = sandbox.stub().resolves({ rows: [] })

    sandbox.stub(client, 'connectedClient').resolves({
      query: queryStub,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('saveToBatch', () => {
    it('queries passing the input parameters', async () => {
      const input = {
        batchId: 'testBatchId',
        metadata: { test: 'metadataTest' },
        status: 'test status',
      }
      await saveToBatch(input)

      expect(queryStub.calledOnce).to.be.equal(true)
      const queryArg = queryStub.getCall(0).args[0]

      expect(queryArg).to.have.property('values')
      expect(queryArg.values).to.have.members([
        input.batchId, input.metadata, input.status,
      ])
    })
  })

  describe('retrieveBatch', () => {
    it('queries passing the input parameters', async () => {
      const input = 'testBatchId'
      await retrieveBatch(input)
      expect(queryStub.calledOnce).to.be.equal(true)
      const queryArg = queryStub.getCall(0).args[0]

      expect(queryArg).to.have.property('values')
      expect(queryArg.values).to.have.members([ input ])
    })
  })

  describe('updateAndReturnSingleBatchStatus', () => {
    it('queries passing the input parameters', async () => {
      const input = 'testStatus'
      await updateAndReturnSingleBatchStatus(input)

      expect(queryStub.calledOnce).to.be.equal(true)
      const queryArg = queryStub.getCall(0).args[0]

      expect(queryArg).to.have.property('values')
      expect(queryArg.values).to.have.members([ input ])
    })
  })

  describe('updateBatchById', () => {
    it('queries passing the input parameters', async () => {
      const input = {
        batchId: 'testBatchId',
        metadata: { test: 'metadataTest' },
        status: 'test status',
      }
      await updateBatchById(input)

      expect(queryStub.calledOnce).to.be.equal(true)
      const queryArg = queryStub.getCall(0).args[0]

      expect(queryArg).to.have.property('values')
      expect(queryArg.values).to.have.members([
        input.batchId, input.metadata, input.status,
      ])
    })
  })
})
