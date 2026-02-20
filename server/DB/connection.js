const mongoose = require("mongoose");
// const {Task,User} = require("./model")


const url = process.env.DB_URL;
const connectDb = () => {
  try {
    mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });
    console.log("database connecté avec succes");

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDb();
