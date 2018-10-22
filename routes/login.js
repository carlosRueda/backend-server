// Requires ---> es para importar librerias propias o de terceros
var express = require('express');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// inicializar variables
var app = express();
var Usuario = require('../models/Usuario');

app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err,
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err,
            });
        }

        if (!bcryptjs.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err,
            });
        }

        // crea un token
        //esta e sla función para generar token
        //tiene 3 parámetros:
        //  - data que quiero poner en el token (payload)...por ejemplo...todo el objeto usuario
        //  - el seed o semilla, que es un código que hace único nuestro token
        //  - vigencia, tiempoen segundos durante el cual estará abierta la sesión
        //    https://jwt.io/ --> aqui se puede ver el contenido del toquen
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas

        return res.status(200).json({
            ok: true,
            token: token,
            usuario: usuarioDB,
            id: usuarioDB._id
        });
    });







});


// permite exportar la ruta
module.exports = app;