// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')

const server = jsonServer.create()

// Uncomment to allow write operations
const fs = require('node:fs')
const path = require('node:path')
const filePath = path.join('db.json')
const data = fs.readFileSync(filePath, 'utf-8')
const db = JSON.parse(data)
const router = jsonServer.router(db)

// Comment out to allow write operations
//const router = jsonServer.router('db.json')

const middlewares = jsonServer.defaults()

server.use(middlewares)

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    '/api/*': '/$1',
    '/:resource/:id/show': '/:resource/:id',
    '/articles?id=:id': '/unidades-de-saude/:id',
  })
)

// Returned resources will be wrapped in a body property
router.render = (req, res) => {
  if (req.method === 'GET' && req.url && !req.route.path.includes(':')) {
    const headers = res.getHeaders()
    res.jsonp({
      data: res.locals.data,
      items: headers['x-total-count'],
    })
  } else {
    res.jsonp(res.locals.data)
  }
}

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
