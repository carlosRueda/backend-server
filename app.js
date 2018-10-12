// aqui va el código javascript para inicializar el servidor, bases de datos, etc
// ------------------------------------------------------------------------------
// Requires ---> es para importar librerias propias o de terceros
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// inicializar variables
var app = express();

//BodyParser ---funciones como estas soin middlewares, o funciones que se van a ejecutar siempre
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// RUTAS: ahora se importan aquí
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', //{ useNewUrlParser: true },
    //mongoose.connect('mongodb://localhost:27017/hospitaldb', { useNewUrlParser: true },
    (err, res) => {

        if (err) throw err;

        console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');
    }
);
// var db = mongoose.connect('mongodb://localhost:27017/hospitaldb');
// db.on('error', function(err) { throw err; });
// db.once('open', function() { console.log('base de datos: \x1b[32m%s\x1b[0m', 'online'); });




// // rutas-->el código que teniamos aqui, se pasó a routes/app.js
// y ahora se usa, importandolo arriba y eclarandolo de esta forma:
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);

//escucar peticiones...en ellisten se configura el puerto en elo que queremos que corra ka aplicación
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});