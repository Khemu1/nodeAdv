require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const cors = require("cors");
const { client } = require("./services/redis");
const { connectToDB } = require("./services/mongo");
require("./models/User");
require("./models/Blog");
require("./services/passport");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from the frontend
    credentials: true, // Allow cookies to be sent with requests (if needed)
  })
);
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [keys.cookieKey], // Your cookie key
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/blogRoutes")(app);
require("./routes/uploadRoutes")(app);

if (
  ["production"].includes(process.env.NODE_ENV) ||
  ["ci"].includes(process.env.NODE_ENV)
) {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    console.log("tring to send file");
    res.sendFile(path.resolve("client", "build", "index.html"));
  });
}
console.log("env", process.env.NODE_ENV);
console.log("port", process.env.PORT);
const PORT =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "ci"
    ? process.env.PORT
    : 5001;
console.log("port", PORT);
app.listen(PORT, async () => {
  // await client.flushdb();
  // await client.flushall();
  await connectToDB();

  console.log(`Listening on port`, PORT);
});
