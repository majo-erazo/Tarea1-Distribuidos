const express = require("express");
const rd = require("./redis");

const grpc = require("./cliente");

const port = 3000;
const app = express();


app.use(express.json());

///////////// RUTAS ///////////////




// Busqueda 

app.get("/search/:item", async (req, res) => {
  const start = Date.now();

  const { item } = req.params;
  if (item) {
    rd.get(item, function (err, reply) {
      if (reply) { //Si el item esta en cache
        console.log("Se usa el cache");
        // mide el tiempo que se demora
        const end1 = Date.now();
        console.log(`Tiempo de ejecución: ${end1 - start} ms`);

        res.json(JSON.parse(reply));
      } else {  //Si el item no esta en cache
        console.log("Se busca en la BD y se agrega");
        grpc.getLinks({archivo: item}, (error, results) => {
          console.log(results)
          if (error){
            console.log(error);
            console.log("Error");
            res.json({});
          } else {
            //Mide el tiempo que se demora
            const end2 = Date.now();
            res.json(results.urls)
            rd.set(item, JSON.stringify(results.urls));

            console.log(`Tiempo de ejecución: ${end2 - start} ms`);
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