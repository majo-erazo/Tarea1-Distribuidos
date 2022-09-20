const redis = require("redis");
const client = redis.createClient({
  host: 'redis1', // grande docker
  port: 6379,
});

client.on("error", (err) => {
  console.log("Error " + err);
});

module.exports = client;
/*
const redis  = require('redis');

const cluster = redis.createCluster({
  rootNodes: [
    {
      url: 'redis://redis1:6379'
    },
    {
      url: 'redis://redis2:6380'
    },
    {
      url: 'redis://redis3:6381'
    }
  ]
});

cluster.on('error', (err) => console.log('Redis Cluster Error', err));

const init = async () => {
  await cluster.connect();
}
init();
module.exports = cluster;
*/
