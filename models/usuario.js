//el nombre del archivo por standar va en singular.
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// aqui defino la misma estructura que creé en la bd, y aqui le doy los tipos,
// indico si son requeridos, o si tiene valor por defecto, etc
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, required: [true, 'El email es obligatorio'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE' }
});

//esto me permite exportarlo (utilizarlo fuera del archivo)
module.exports = mongoose.model('Usuario', usuarioSchema);