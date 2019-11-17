const { Client } = require('pg')
const { getLogger } = require('../logging/logger')

let client
let connected = false

const initClient = () => {
  if (!client) {
    client = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })
  }
}

exports.connectedClient = async () => {
  initClient()
  const log = getLogger()

  try {
    if (!connected) {
      await client.connect()
      connected = true
    }

    return client
  } catch (error) {
    log.error({ error }, 'siteScreenshot:getClient error')
    throw new Error('database error')
  }
}
