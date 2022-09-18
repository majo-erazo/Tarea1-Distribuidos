const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./search.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDef = protoLoader.loadSync(PROTO_PATH, options);
const Search = grpc.loadPackageDefinition(packageDef).Search;
const client = new Search("grpc_server:50051", grpc.credentials.createInsecure());

module.exports = client;