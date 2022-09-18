const express = require("express");
const rd = require("./redis");
const cors = require("cors");
const grpc = require("./grpc_client");

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

///////////// RUTAS ///////////////

// Testeo de conexion a redis

app.get("/", async (req, res) => {
  res.send("Esta es la api :)");
  rd.set("test", "test");
  rd.get("test", function (err, reply) {
    console.log(reply);
  });
  rd.del("test");
});


// Busqueda 

app.get("/search/:item", async (req, res) => {
  const { item } = req.params;
  if (item) {
    rd.get(item, function (err, reply) {
      if (reply) { //Si el item esta en cache
        console.log("uso cache");
        res.json(JSON.parse(reply));
      } else {  //Si el item no esta en cache
        console.log("lo busco y agrego");
        grpc.getProducts({message: item}, (error, products) => {
          if (error){
            console.log(error);
            res.json({});
          } else {
            res.json(products.product)
            rd.set(item, JSON.stringify(products.product));
          }
        })
      }
    });
  }
});

// API

app.listen(port, () => {
  console.log(`API RUN AT http://localhost:${port}`);
});