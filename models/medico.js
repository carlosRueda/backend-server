//el nombre del archivo por standar va en singular.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// aqui defino la misma estructura que creé en la bd, y aqui le doy los tipos,
// indico si son requeridos, o si tiene valor por defecto, etc
var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }
    });

//esto me permite exportarlo (utilizarlo fuera del archivo)
module.exports = mongoose.model('Medico', medicoSchema);