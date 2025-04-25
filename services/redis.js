const redis = require("redis");
const util = require("util");

const redisUrl = require("../config/keys").REDIS_URL;
const client = redis.createClient(redisUrl);

client.getAsync = util.promisify(client.get).bind(client);
client.setAsync = util.promisify(client.set).bind(client);
client.hgetAsync = util.promisify(client.hget).bind(client);
client.hsetAsync = util.promisify(client.hset).bind(client);

client.on("error", (err) => {
  console.error("Redis error:", err);
});

const connectToRedis = async () => {
  try {
    if (client.connect) await client.connect();
    if (client.flushAll) await client.flushAll(); // or client.flushall() depending on version
    console.log("Redis connected successfully");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
};

module.exports = {
  client,
  connectToRedis,
};
