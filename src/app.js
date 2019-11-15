const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { setupRoute } = require('./routes')
const { getLogger } = require('./lib/logging/logger')

const startRestApp = () => {
  const log = getLogger()
  try {
    const app = express()

    app.listen(process.env.PORT)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cors())

    app.use((req, res, next) => {
      log.debug('app: rest: request information', {
        method: req.method, url: req.url, body: req.body,
      })
      res.set('Content-Type', 'application/json')
      next()
    })
    setupRoute(app)

    log.info('app: started rest app', { port: process.env.PORT })
  } catch (e) {
    log.error('app: rest app error', { errorMessage: e.message })
  }
}

startRestApp()
