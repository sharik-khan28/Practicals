const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const Tour = require('../../src/models/tour.model');

require('dotenv').config();

console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(con => {
  console.log('Database is connected');
});

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'tours-simple.json'), 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else {
  deleteData();
}
