
const utilidades = require('./utilidades');
const express = require('express');
let juegosFichero = []
const ficheroJuegos = "juegos.json"
let juegosGuardar = [{
  "id": 2,
  "nombre": "Clash Royale",
  "descripcion": "ssss",
  "numeroJugadores": 3,
  "tipo": "estrategia",
  "edad": 5,
  "precio": 4
}, {
  "id": 3,
  "nombre": "Clash of clans",
  "descripcion": "ssss",
  "numeroJugadores": 3,
  "tipo": "estrategia",
  "edad": 18,
  "precio": 4
}]
juegosFichero = utilidades.cargarJuegos(ficheroJuegos);
utilidades.guardarJuegos(ficheroJuegos, juegosGuardar)
iniciaServidor()


function iniciaServidor() {
  //duda urls
  let app = express();
  app.use(express.json());

  app.get('/juegos', (req, res) => {
    let edad = req.query.anyos
    let tipo = req.query.tipo
    if (edad !== undefined && tipo === undefined) {
      verificaEdad(req, res, true, edad)

    } else if (edad === undefined && tipo !== undefined) {
      verificaTipo(req, res, juegosFichero, tipo)

    } else if (edad !== undefined && tipo !== undefined) {
      let juegosVerificados
      juegosVerificados = verificaEdad(req, res, false, edad)
      if (juegosVerificados.length > 0) {
        verificaTipo(req, res, juegosVerificados, tipo)

      } else {
        res.status(500).send({ ok: false, error: "no se ha encontrado ningun juego con esa edad" });

      }

    } else if (edad === undefined && tipo === undefined) {
      res.status(200).send({ ok: true, resultados: juegosFichero });

    }
  })


  app.get('/juegos/:id', (req, res) => {
    let resultado = juegosFichero.filter(juego => juego.id == req.params['id']);
    if (resultado.length > 0) {
      res.status(200).send({ ok: true, resultados: resultado });
    } else {
      res.status(400).send({ ok: false, error: "no se ha encontrado ningun juego con esta id" });
    }
  })
  app.post('/juegos', (req, res) => {
    let nuevoJuego = {
      id: req.body.id,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      numeroJugadores: req.body.numeroJugadores,
      tipo: req.body.tipo,
      edad: req.body.edad,
      precio: req.body.precio
    };
    let existe = juegosFichero.filter(
      juego => juego.id == nuevoJuego.id
    );
    if (existe.length == 0) {
      juegosFichero.push(nuevoJuego);
      utilidades.guardarJuegos(ficheroJuegos, juegosFichero)

      res.status(200).send({ ok: true });
    } else {
      res.status(400).send({
        ok: false,
        error: "Juego duplicado"
      });
    }
  });

  app.put('/juegos/:id', (req, res) => {
    let existe = juegosFichero.filter(
      juego => juego.id == req.params['id']
    );
    if (existe.length > 0) {
      let juego = existe[0];
      juego.nombre = req.body.nombre,
        juego.descripcion = req.body.descripcion,
        juego.numeroJugadores = req.body.numeroJugadores,
        juego.tipo = req.body.tipo,
        juego.edad = req.body.edad,
        juego.precio = req.body.precio
      utilidades.guardarJuegos(ficheroJuegos, juegosFichero)
      res.status(200).send({ ok: true });
    } else {
      res.status(400).send({
        ok: false,
        error: "Juego no encontrado"
      });
    }
  });

  app.delete('/juegos/:id', (req, res) => {
    let filtrado = juegosFichero.filter(
      juego => juego.id != req.params['id']
    );
    if (filtrado.length != juegosFichero.length) {
      juegosFichero = filtrado;
      utilidades.guardarJuegos(ficheroJuegos, juegosFichero)
      res.status(200).send({ ok: true });
    } else {
      res.status(400).send({
        ok: false,
        error: "Juego no encontrado"
      });
    }
  });


  app.listen(8080);
}

function verificaTipo(req, res, juegosVerificados, tipo) {
  let resultado = juegosVerificados.filter(juego => juego.tipo == tipo);
  if (resultado.length > 0) {
    res.status(200).send({ ok: true, resultados: resultado });
  } else {
    res.status(500).send({ ok: false, error: "no se ha encontrado ningun juego con ese tipo" });
  }
}
function verificaEdad(req, res, envio, edad) {
  if (envio) {
    if (edad < 0) {
      res.status(400).send({ ok: false, error: "la edad no puede ser negativa" });
      return false
    } else {
      let resultado = juegosFichero.filter(juego => juego.edad >= edad);

      if (resultado.length > 0) {
        res.status(200).json({ ok: true, resultados: resultado });
        return resultado
      } else {
        res.status(500).send({ ok: false, error: "no se ha encontrado ningun juego con esa edad" });
        return false
      }
    }
  } else {
    let resultado = juegosFichero.filter(juego => juego.edad >= edad);
    return resultado;

  }

}
