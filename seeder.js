const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Set up config variables
dotenv.config({
  path: './config/config.env'
});

const Bootcamp = require('./models/Bootcamp');

// Connect to DB
mongoose.connect(process.env.DB_URI, {
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Read bootcamps
const bootcamps = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/_data/bootcamps.json'))
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data imported.'.green.inverse);
  } catch (err) {
    console.error(err.message);
  }

  process.exit();
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data deleted.'.red.inverse);
  } catch (err) {
    console.error(err.message);
  }

  process.exit();
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
