const dbClient = require('./client')
const { getLogger } = require('../logging/logger')

const SAVE_BATCH_SQL = 'INSERT INTO screenshot_batches(id, screenshot_metadata, status) VALUES($1, $2, $3)'
const RETRIEVE_BATCH_SQL = 'SELECT * FROM screenshot_batches WHERE id = $1'
const UPDATE_SINGLE_PENDING_BATCH_STATUS_SQL = `UPDATE screenshot_batches SET status = $1
  WHERE id = (SELECT id FROM screenshot_batches WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT 1)
  RETURNING id, screenshot_metadata, status
`
const UPDATE_BATCH_BY_ID_SQL = 'UPDATE screenshot_batches SET status = $2, screenshot_metadata = $3 WHERE id = $1'


exports.saveToBatch = async ({ batchId, metadata, status }) => {
  const log = getLogger()

  try {
    const client = await dbClient.connectedClient()
    await client.query({
      text: SAVE_BATCH_SQL,
      values: [batchId, metadata, status],
    })
  } catch (error) {
    log.error({ error }, 'siteScreenshot:saveToBatch error')
    throw new Error('saving error')
  }
}

exports.retrieveBatch = async (id) => {
  const log = getLogger()

  try {
    const client = await dbClient.connectedClient()
    const { rows } = await client.query({
      text: RETRIEVE_BATCH_SQL,
      values: [id],
    })
    return rows
  } catch (error) {
    log.error({ error }, 'siteScreenshot:retrieveBatch error')
    throw new Error('retrieving error')
  }
}

exports.updateAndReturnSingleBatchStatus = async (status) => {
  const log = getLogger()

  try {
    const client = await dbClient.connectedClient()
    const { rows } = await client.query({
      text: UPDATE_SINGLE_PENDING_BATCH_STATUS_SQL,
      values: [status],
    })
    return rows
  } catch (error) {
    log.error({ error }, 'siteScreenshot:updateBatch error')
    throw new Error('retrieving error')
  }
}

exports.updateBatchById = async ({ batchId, status, metadata }) => {
  const log = getLogger()

  try {
    const client = await dbClient.connectedClient()
    const { rows } = await client.query({
      text: UPDATE_BATCH_BY_ID_SQL,
      values: [batchId, status, metadata],
    })
    return rows
  } catch (error) {
    log.error({ error }, 'siteScreenshot:updateBatch error')
    throw new Error('retrieving error')
  }
}
