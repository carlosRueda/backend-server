// Requires ---> es para importar librerias propias o de terceros
var express = require('express');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

// inicializar variables
var app = express();
var Usuario = require('../models/Usuario');
// var salt = bcryptjs.genSaltSync(10);
// var hash = bcryptjs.hashSync("B4c0/\/", salt);

// rutas-->define elpath....q es el slash para la ruta
// el segundo parametro es el callback function y tiene 3 parámetros
//    el request:
//    el response:
//    el next: le dice a express q cuando se ejecute continúe con otra función....normalmente se usa solo con midlewares.
//             en los demás casi no se usan
// =================================================
// GET: aquí se Obtienen todos los usuarios almacenados 
// =================================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
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

// // =================================================
// // verificar token: se ubicó estratégicamente en este punto para hacer que las funciones que hay de aquí hacia abajo 
// // tengan la verificación del token
// // Middleware
// // sin embargo esta no es la mejor ubicación...por lo que se pasó a middlewares/autenticacion.js
// // =================================================
// app.use('/', (req, res, next) => {
//     var token = req.query.token;

//     jwt.verify(token, SEED, (err, decoder) => {
//         if (err) {
//             return res.status(401).json({
//                 ok: false,
//                 mensaje: 'token Incorrecto',
//                 errors: err
//             });
//         }

//         // esta función permite decirle al servidor que continue la ejecución de la siguiente función
//         next();
//     })

// });

// =================================================
// PUT: ACTUALIZAR USUARIO----se puede put o patch
// =================================================
// así se declara el parámetro a recibir
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    //tomar el id que llega como parámetro
    var id = req.params.id;

    //Toma los demás parámetros y los convierte en un objeto
    var body = req.body;

    //función para buscar un usuario
    Usuario.findById(id, (err, usuario) => {
        //se comprueba si hubo error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        //se comprueba si existe en bd
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe ningún usuario con ese Id' }
            });
        }

        //se mapean los campos a modificar
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        //función para guardar
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});


// =================================================
// POST: CREAR USUARIO
// =================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    //hay una libreria que convierte un objeto json recibido por post y lo convierte en un objeto
    //se llama body-parser 
    //se instala npm install body-parser --save
    //se declara bodyParser =require('boy-parser');
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcryptjs.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });

});


// =================================================
// DELETE: Borrar usuario por id
// se adicionó comoi parámetro la función de verifica 
// token, que valida si es posible o no ejecutar esta
//  unción 
// =================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    //tomar el id que llega como parámetro
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar Usuario',
                errors: err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe ningún usuario con ese Id' }
            });
        }

        usuarioEliminado.password = ':)';

        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });
    });
});

// permite exportar la ruta
module.exports = app;