// aqui va el código javascript para inicializar el servidor, bases de datos, etc
// ------------------------------------------------------------------------------
// Requires ---> es para importar librerias propias o de terceros
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables
var app = express();

// conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',
    (err, res) => {

        if (err) throw err;

        console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');
    });



// rutas-->define elpath....q es elslash para la ruta
// el segundo parametro es el callback function y tiene 3 parámetros
//    el request: 
//    el response: 
//    el next: le ice a express q cuandos e ejecute continúe con otra función....normalmente se usa solo con midlewares.
//             en los demás casi no se usan
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });

});


//escucar peticiones...en ellisten se configura el puerto en elo que queremos que corra ka aplicación
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});