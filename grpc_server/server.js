const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./search.proto";
const protoLoader = require("@grpc/proto-loader");

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
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://username:password@host:port/database");

function main() {
  const server = new grpc.Server();
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