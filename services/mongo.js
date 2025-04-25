const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.Promise = global.Promise;

const connectToDB = async () => {
  try {
    await mongoose.connect(keys.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

const disconnectFromDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  } catch (err) {
    console.error("Error disconnecting from MongoDB:", err);
  }
};

module.exports = {
  connectToDB,
  disconnectFromDB,
};
