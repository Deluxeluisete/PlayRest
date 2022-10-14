
const fs = require('fs');


function cargarJuegos(nombreFichero) {
    try {
        fs.statSync(nombreFichero).isFile();
        juegosFichero = JSON.parse(fs.readFileSync(nombreFichero, 'utf8'));
        console.log(juegosFichero);
        return juegosFichero

    } catch (e) {
        console.log("el fichero no existe o el formato no es correcto")
        return juegosFichero
    }

}
function guardarJuegos(nombreFichero, arrayJuegos) {
    if (arrayJuegos.length > 0) {
        fs.writeFileSync(nombreFichero, JSON.stringify(arrayJuegos));
    }
}

module.exports = {
    cargarJuegos:cargarJuegos,
    guardarJuegos:guardarJuegos
};

// { "id": 2,"nombre": "Clash Royale","descripcion": "ssss",
//     "numeroJugadores": 3,
//     "tipo": "estrategia",
//    "edad": 5,
//     "precio": 4
//   }