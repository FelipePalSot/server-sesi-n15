import * as schemaPersona from "../schemas/persona.schema.js";

export const findAll = async function() {
    console.log("------------service------------");
    //let results= await modelPersona.findAll();
    let results= await schemaPersona.findAll();
    console.log("luego del modelo");
    console.log(results);
    return results;
};

export const login = async function(objUsuario) {
    console.log("------------service------------");
    //let results= await modelPersona.login(objUsuario);
    let results= await schemaPersona.login(objUsuario);
    console.log("luego del modelo");
    console.log(results);
    return results;
};

export const findById = async function(id_persona) {
    console.log("------------service------------");
    //let results= await modelPersona.findById(id_persona);
    let results= await schemaPersona.findById(id_persona);
    return results;
};

export const create = async function(objUsuario) {
    console.log("------------service------------");
    //let results= await modelPersona.findById(id_persona);
    let results= await schemaPersona.create(objUsuario);
    return results;
};

export const update = async function(id_persona, objUsuario) {
    console.log("------------service------------");
    //let results= await modelPersona.findById(id_persona);
    await schemaPersona.update(id_persona, objUsuario);
    let results= await schemaPersona.findById(id_persona);
    return results;
};

export const findEdadPromedio = async function(edadMinima) {
    console.log("------------service------------");
    let results= await schemaPersona.findEdadPromedio(edadMinima);
    return results;
};

