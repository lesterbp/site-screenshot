const { getLogger } = require('./lib/logging/logger')
const { processBatches } = require('./lib/handlers/screenshotBatchHandler')

startBatchProcessing = () => {
  const log = getLogger()
  log.info('startBatchProcessing:processBatches starting')
  processBatches().catch((error) => {
    log.error('startBatchProcessing:processBatches had stopped because of error', error)
  }).finally(() => {
    log.warn('startBatchProcessing:processBatches had stopped')
  })
}

startBatchProcessing()
