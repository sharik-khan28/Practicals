const express = require('express')
const {
  getData,
  getOverview,
  getProduct
} = require('../controller/product.controller')

const productRouter = express.Router()

productRouter.get('/data', getData)
productRouter.get('/overview', getOverview)
productRouter.get('/product?:id', getProduct)

module.exports = productRouter
