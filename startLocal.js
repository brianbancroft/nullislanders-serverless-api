// require('@google-cloud/trace-agent').start()
require('dotenv').config()
// require('@google-cloud/debug-agent').start()

const app = require('./src/app')
const PORT = process.env.PORT || 7777

;(async () => {
  app.listen(PORT, () => {
    console.log(`Started at http://localhost:${PORT}`)
  })
})()
