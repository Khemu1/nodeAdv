console.log("🛠 Setup file loaded!");

require("../models/User"); // <-- make sure this registers mongoose.model("User")
require("../models/Blog"); // <-- make sure this registers mongoose.model("Blog")

const { connectToDB, disconnectFromDB } = require("../services/mongo");

beforeAll(async () => {
  await connectToDB();
});

afterAll(async () => {
  await disconnectFromDB();
});
