// Requires ---> es para importar librerias propias o de terceros
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

// inicializar variables
var app = express();
var Medico = require('../models/Medico');

// rutas-->define elpath....q es el slash para la ruta
// el segundo parametro es el callback function y tiene 3 parámetros
//    el request:
//    el response:
//    el next: le dice a express q cuando se ejecute continúe con otra función....normalmente se usa solo con midlewares.
//             en los demás casi no se usan
// =================================================
// GET: aquí se Obtienen todos los Medicos almacenados 
// =================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital', 'nombre')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Médico(s)',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo)=>{
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });
            });
});

// =================================================
// PUT: ACTUALIZAR Médico----se puede put o patch
// =================================================
// así se declara el parámetro a recibir
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    //tomar el id que llega como parámetro
    var id = req.params.id;

    //Toma los demás parámetros y los convierte en un objeto
    var body = req.body;

    //función para buscar un medico
    Medico.findById(id, (err, medico) => {
        //se comprueba si hubo error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Médico',
                errors: err
            });
        }

        //se comprueba si existe en bd
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Médico con el id ' + id + ' no existe',
                errors: { message: 'No existe ningún Médico con ese Id' }
            });
        }

        //se mapean los campos a modificar
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        //función para guardar
        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Médico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});


// =================================================
// POST: CREAR MÉDICO
// =================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    //hay una libreria que convierte un objeto json recibido por post y lo convierte en un objeto
    //se llama body-parser 
    //se instala npm install body-parser --save
    //se declara bodyParser =require('boy-parser');
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital,
        img: body.img,
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Médico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
        });
    });

});


// =================================================
// DELETE: Borrar médico por id
// se adicionó comoi parámetro la función de verifica 
// token, que valida si es posible o no ejecutar esta
//  unción 
// =================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    //tomar el id que llega como parámetro
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar Médico',
                errors: err
            });
        }

        if (!medicoEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Médico con el id ' + id + ' no existe',
                errors: { message: 'No existe ningún Médico con ese Id' }
            });
        }


        res.status(200).json({
            ok: true,
            medico: medicoEliminado
        });
    });
});

// permite exportar la ruta
module.exports = app;