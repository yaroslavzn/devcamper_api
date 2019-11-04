const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB_URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  console.log(`MongoDB connect: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
