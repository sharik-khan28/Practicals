const { readData } = require('../models/product.model')
const fs = require('fs')
const path = require('path')
const templateOverview = fs.readFileSync(
  path.join(__dirname, '..', 'templates', 'template-overview.html'),
  'utf-8'
)
const templateCard = fs.readFileSync(
  path.join(__dirname, '..', 'templates', 'template-card.html'),
  'utf-8'
)
const templateProduct = fs.readFileSync(
  path.join(__dirname, '..', 'templates', 'template-product.html'),
  'utf-8'
)
const data = readData()

function getData (req, res) {
  return res.status(200).json(data)
}

function replaceTemplate (temp, product) {
  temp = temp.replace(/{%Product%}/g, product['productName'])
  temp = temp.replace(/{%Image%}/g, product['image'])
  temp = temp.replace(/{%Price%}/g, product['price'])
  temp = temp.replace(/{%Source%}/g, product['from'])
  temp = temp.replace(/{%Quantity%}/g, product['quantity'])
  temp = temp.replace(/{%Nutrients%}/g, product['nutrients'])
  temp = temp.replace(/{%Sender%}/g, product['from'])
  temp = temp.replace(/{%Description%}/g, product['description'])
  temp = temp.replace(/{%ID%}/g, product['id'])
  if (!product['organic'])
    temp = temp.replaceAll(/{%Not_Organic%}/g, 'not-organic')
  return temp
}

function createCard () {
  let temp = templateCard
  const cardsHtml = data.map(product => replaceTemplate(temp, product))
  const output = templateOverview.replace(
    /{%Product_Card%}/g,
    cardsHtml.join('')
  )
  return output
}

function getProduct (req, res) {
  const id = req.query.id
  const product = data[id]
  const output = replaceTemplate(templateProduct, product)
  return res.setHeader('Constent-Type', 'text/html').end(output)
}

function getOverview (req, res) {
  return res.setHeader('Constent-Type', 'text/html').end(createCard())
}

module.exports = {
  getData,
  getOverview,
  getProduct
}
