//el nombre del archivo por standar va en singular.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// aqui defino la misma estructura que creé en la bd, y aqui le doy los tipos,
// indico si son requeridos, o si tiene valor por defecto, etc
var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }//este hace una relación con la entidad usuario
}, { collection: 'hospitales' });//con esto se modifica el nombre que se genera en la collección en mongo db. 
//nomalmente solo le agrega una s, por lo que quedaría hospitals

//esto me permite exportarlo (utilizarlo fuera del archivo)
module.exports = mongoose.model('Hospital', hospitalSchema);