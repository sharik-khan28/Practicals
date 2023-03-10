const http = require('http')
const app = require('./app')
const { loadData } = require('./models/product.model')

const server = http.createServer(app)

async function startServer () {
  await loadData()
  server.listen(3000, () => {
    console.log('Listening on port 3000...')
  })
}
startServer()
