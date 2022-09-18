const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./search.proto";
const protoLoader = require("@grpc/proto-loader");
const { title } = require("process");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const packageDef= protoLoader.loadSync(PROTO_PATH, options);
const objProto = grpc.loadPackageDefinition(packageDef);
const rutaGuia = objProto.rutaGuia;


// Conección con la Base de Datos
const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: 5432,
    database: process.env.POSTGRES_DB
});

module.exports = pool;

function main() {
  function obtenerServer(){
    const Server = new grpc.Server();
    Server.addService(rutaGuia.RouteGuide.service, {
      getFeature: getFeature,
      listFeatures: listFeatures,
      recordRoute: recordRoute,
      routeChat: routeChat
    });
    return Server;
  }
  const routeServer = getServer();
  routeServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    routeServer.start();
  });
  const getInfo = (request, response) => {
    pool.query('SELECT * FROM links WHERE UPPER(tittle) LIKE UPPER(%1);',[title], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
      console.log(results);
    })
  }
  module.exports = {
    getInfo,
  }
  
}
/*
function main() {

  const getInfo = (request, response) => {
    pool.query('SELECT * FROM links WHERE UPPER(tittle) LIKE UPPER(%1);',[title], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  module.exports = {
    getInfo,
  }
  
  const server= new grpc.Server();
  server.addService(objProto.Search.service, {
    getLinks: (_, callback) => {
      const linksName = _.request.message;
      const link = products.products_list.filter(({ name }) => name.includes(linksName));
      callback(null, { link: link});
    }
  });
  
  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) console.log(err);
    else {
      console.log("GRPC RUN AT http://localhost:50051");
      server.start();
    }
  });
}

main();
*/