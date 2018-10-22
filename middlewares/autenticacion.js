var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// =================================================
// verificar token: se ubicó estratégicamente en este punto para hacer que las funciones que hay de aquí hacia abajo 
// tengan la verificación del token
// Middleware
// sin embargo esta no es la mejor ubicación
// =================================================
exports.verificaToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token Incorrecto',
                errors: err
            });
        }

        // decoded es la información del usuario aldes serializarla
        req.usuario = decoded.usuario;

        // esta función permite decirle al servidor que continue la ejecución de la siguiente función
        next();

        // return res.status(200).json({
        //     ok: true,
        //     mensaje: 'token correcto',
        //     decoded: decoded
        // });
    });
}