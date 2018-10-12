//el nombre del archivo por standar va en singular.
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

// aqui defino la misma estructura que creé en la bd, y aqui le doy los tipos,
// indico si son requeridos, o si tiene valor por defecto, etc
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El email es obligatorio'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

// CON ESTO SE HACE UN MENSAJE GENERAL PARA TODOS LOS CAMPOS QUE TENGAN UNIQUE: TRUE
// LA OPCIÓN {PATH} TOMA AUTOMÁTICAMENTE EL NOMBRE DEL CAMPO
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único.' });


//esto me permite exportarlo (utilizarlo fuera del archivo)
module.exports = mongoose.model('Usuario', usuarioSchema);