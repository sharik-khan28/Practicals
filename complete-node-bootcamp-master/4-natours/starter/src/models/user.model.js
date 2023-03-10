const fs = require('fs');
const path = require('path');

const users = fs.readFileSync(
  path.join(__dirname, '..', '..', 'dev-data', 'data', 'tours.json')
);

module.exports = users;
