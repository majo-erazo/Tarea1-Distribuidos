import { createCluster } from 'redis';

const cluster = createCluster({
  rootNodes: [
    {
      url: 'redis1:6379'
    },
    {
      url: 'redis2:6380'
    },
    {
      url: 'redis3:6381'
    }
  ]
});

cluster.on('error', (err) => console.log('Redis Cluster Error', err));

module.exports = cluster;
