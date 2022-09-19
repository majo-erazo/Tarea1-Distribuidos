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
        grpc.getLinks({archivo: item}, (error, results) => {
          console.log(results)
          if (error){
            console.log(error);
            console.log("No Hay Base de Datos");
            res.json({});
          } else {
            res.json(results.urls)
            console.log("Holis2");
            rd.set(item, JSON.stringify(results.urls));
            console.log("Holis3");
          }
        })
        console.log("Holis4");
      }
    });
  }
});

// API

app.listen(port, () => {
  console.log(`API RUN AT http://localhost:${port}`);
});