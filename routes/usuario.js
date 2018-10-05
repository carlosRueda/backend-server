// Requires ---> es para importar librerias propias o de terceros
var express = require('express');

// inicializar variables
var app = express();

var Usuario = require('../models/usuario');

// rutas-->define elpath....q es elslash para la ruta
// el segundo parametro es el callback function y tiene 3 parámetros
//    el request:
//    el response:
//    el next: le dice a express q cuando se ejecute continúe con otra función....normalmente se usa solo con midlewares.
//             en los demás casi no se usan
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre, email, img, role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Usuario(s)',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });
    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Get a Usuarios realizada correctamente'
    // });

});

module.exports = app;