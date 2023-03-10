const express = require('express')
const productRouter = require('./router/product.router')

const app = express()

app.use('/', productRouter)

module.exports = app
