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


// Conección con la Base de Datos
const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: 5432,
    database: process.env.POSTGRES_DB
});


function main() {
  
  const server= new grpc.Server();
  server.addService(objProto.Search.service, {
    getLinks: (_, callback) => {
      console.log("entro a servicio grpc");
      const linksName = _.request.archivo;
      console.log(linksName)
      pool.query('SELECT * FROM link WHERE UPPER(title) LIKE UPPER($1::text) LIMIT 1;',[linksName], (error, results) => {
        if (error) {
          throw error
        }
        console.log(results.rows);
        callback(null, { urls: results.rows});
      })
      //const link = products.products_list.filter(({ name }) => name.includes(linksName));
      //callback(null, { link: link});
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