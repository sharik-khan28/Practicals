const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config();

const app = require('./app');

const server = http.createServer(app);

const { PORT } = process.env;
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(con => {
  console.log('Database is connected');
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
