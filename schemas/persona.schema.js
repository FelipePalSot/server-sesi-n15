import odm from "../config/mongoose.js";

const personaSchema = new odm.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
  },
  nro_documento: {
    type: String,
    unique: true,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  tipo_documento:{
    id_tipodoc:{
        type: Number,
        required: true,
    },
    nombre:{
        type: String,
        required: true,
    },
  },
  usuario:{
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    rol:{
        type: String,
        required: true,
    },
  },
  fecha_registro: {
    type: Date,
    default: Date.now,
  }
}, {collection:"persona", versionKey:"version"});

personaSchema.virtual('nombre_completo').get(function(){
    return `${this.nombre} ${this.apellido}`;
});

personaSchema.pre('save', function(next){
    console.log("... hook save ...");
    console.log(this.nombre);
    this.nombre=this.nombre.toUpperCase();
    this.apellido=this.apellido.toUpperCase();
    this.usuario.rol=this.usuario.rol.toLowerCase();
    return next();
});

export const Persona = odm.model('persona', personaSchema);

export const findAll = async function(){
    console.log("------------schema------------");
    const results= await Persona.find({});
    console.log(results);
    return results;
}

export const login = async function(objUsuario){
    console.log("------------schema------------");
    const results= await Persona.find({'usuario.email':objUsuario.email});
    console.log(results);
    return results;
}

export const findById = async function(id_persona){
    console.log("------------schema------------");
    const results= await Persona.find({_id:id_persona});
    console.log(results);
    return results;
}

export const create = async function(objUsuario){
    console.log("------------schema------------");
    const results= await Persona.create(objUsuario);
    console.log(results);
    return results;
}

export const update = async function(id_persona, objUsuario){
    console.log("------------schema------------");
    const results= await Persona.findByIdAndUpdate(
        id_persona, 
        {
            nombre:objUsuario.nombre,
            apellido:objUsuario.apellido,
            edad:objUsuario.edad,
            'usuario.password':objUsuario.usuario.password,
            'usuario.rol':objUsuario.usuario.rol,
        }
    );
    console.log(results);
    return results;
}

export const findEdadPromedio = async function(edadMinima){
    console.log("------------schema------------");
    const results= await Persona.aggregate([
        { $match: { edad: { $gt: edadMinima } } },
        { $group: { _id:'$usuario.rol', total:{$sum:1}, edadPromedio:{$avg:"$edad"} } }
    ]);
    console.log(results);
    return results;
}

