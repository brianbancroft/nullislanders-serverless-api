// require('@google-cloud/trace-agent').start()
require('dotenv').config()
// require('@google-cloud/debug-agent').start()

const app = require('./src/app')
const client = require('./src/config/database')
const PORT = process.env.PORT || 3000

;(async () => {
  await client.connect().catch(e => {
    console.log('Error in top application => ', e)
  })

  app.listen(PORT, () => {
    console.log(`Started at http://localhost:${PORT}`)
  })
})()
