const { Client } = require('pg')
const { getLogger } = require('../logging/logger')

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

let connected = false

exports.connectedClient = async () => {
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
