const express = require("express");
const rd = require("./redis");

const grpc = require("./cliente");

const port = 3000;
const app = express();


app.use(express.json());

///////////// RUTAS ///////////////




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
        grpc.getLinks({message: item}, (error, products) => {
          if (error){
            console.log(error);
            res.json({});
          } else {
            res.json(products.link)
            rd.set(item, JSON.stringify(products.link));
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