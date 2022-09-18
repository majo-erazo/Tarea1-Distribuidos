const redis = require("redis");
const client = redis.createClient({
  host: process.env.REDIS_HOST, // grande docker
  port: 6379,
});

client.on("error", (err) => {
  console.log("Error " + err);
});

module.exports = client;
