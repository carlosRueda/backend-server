// aqui va el código javascript para inicializar el servidor, bases de datos, etc
// ------------------------------------------------------------------------------
// Requires ---> es para importar librerias propias o de terceros
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables
var app = express();


// RUTAS: ahora se importan aquí
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');

// conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb',
    (err, res) => {

        if (err) throw err;

        console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');
    });

// // rutas-->el código que teniamos aqui, se pasó a routes/app.js
// y ahora se usa, importandolo arriba y eclarandolo de esta forma:
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);

//escucar peticiones...en ellisten se configura el puerto en elo que queremos que corra ka aplicación
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});