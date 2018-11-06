// Requires ---> es para importar librerias propias o de terceros
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

// inicializar variables
var app = express();
var Hospital = require('../models/hospital');

// rutas-->define elpath....q es el slash para la ruta
// el segundo parametro es el callback function y tiene 3 parámetros
//    el request:
//    el response:
//    el next: le dice a express q cuando se ejecute continúe con otra función....normalmente se usa solo con midlewares.
//             en los demás casi no se usan
// =================================================
// GET: aquí se Obtienen todos los hospitales almacenados 
// =================================================
app.get('/', (req, res, next) => {

    Hospital.find({})
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital(es)',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales
                });


            });
});

// =================================================
// PUT: ACTUALIZAR HOSPITAL----se puede put o patch
// =================================================
// así se declara el parámetro a recibir
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    //tomar el id que llega como parámetro
    var id = req.params.id;

    //Toma los demás parámetros y los convierte en un objeto
    var body = req.body;

    //función para buscar un hospital
    Hospital.findById(id, (err, hospital) => {
        //se comprueba si hubo error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        //se comprueba si existe en bd
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe ningún hospital con ese Id' }
            });
        }

        //se mapean los campos a modificar
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        //función para guardar
        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});


// =================================================
// POST: CREAR HOSPITAL
// =================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    //hay una libreria que convierte un objeto json recibido por post y lo convierte en un objeto
    //se llama body-parser 
    //se instala npm install body-parser --save
    //se declara bodyParser =require('body-parser');
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
        });
    });

});

// =================================================
// DELETE: Borrar hospital por id
// se adicionó como parámetro la función de verifica 
// token, que valida si es posible o no ejecutar esta
// función 
// =================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    //tomar el id que llega como parámetro
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar Hospital',
                errors: err
            });
        }

        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe ningún Hospital con ese Id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado
        });
    });
});

// permite exportar la ruta
module.exports = app;