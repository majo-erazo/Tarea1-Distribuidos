const redis = require("redis");
const client = redis.createClient({
  host: 'redis1', // grande docker
  port: 6379,
});

client.on("error", (err) => {
  console.log("Error " + err);
});

module.exports = client;
