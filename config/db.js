const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL ||"mongodb://localhost:27017/instagram", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other options if needed
    });
    console.log(`Connected to MongoDB Database: ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.bgRed.white);
  }
};

module.exports = connectDB;
