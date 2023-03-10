const fs = require('fs')
const path = require('path')
const product_data = []

async function loadData () {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, '..', 'dev-data', 'data.json'),
      'utf-8',
      (err, data) => {
        JSON.parse(data).map(el => {
          product_data.push(el)
        })
        resolve()
        reject(err)
      }
    )
  })
}

function readData () {
  return product_data
}

module.exports = { loadData, readData }
