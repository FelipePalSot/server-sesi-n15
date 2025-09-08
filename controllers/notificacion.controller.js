import * as snotificacion from "../services/notificacion.service.js";
import * as auth from "../config/auth.js";

export const findByEmail = async function(req, res) {
    console.log("------------controller 1------------");
   
    try{
        const email= req.params.id;
        console.log(email);
        const notificaciones = await snotificacion.findByEmail(email);
        res.json(notificaciones || []);
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error obteniendo registros"});
    }
}

export const create = async function(req, res) {
    console.log("------------controller 2------------");
   
    try{
        const objNotificacion= req.body;
        console.log(objNotificacion);
        const notificaciones = await snotificacion.create(objNotificacion);
        res.json(notificaciones || {});
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error ingresando registros"});
    }
}

export const leer = async function(req, res) {
    console.log("------------controller 3------------");
    try{
        const id_notificacion = req.params.id;
        console.log(id_notificacion);
        const result = await snotificacion.leer(id_notificacion);
        const doc = Array.isArray(result) ? result[0] : result; // tu schema.findById devuelve array
        res.json(doc || {});
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error actualizando registro"});
    }
};

/*
export const update = async function(req, res) {
    console.log("------------controller------------");
   
    try{
        const id_persona= req.params.id;
        const objUsuario= req.body;
        console.log(id_persona);
        console.log(objUsuario);
        const usuarios = await snotificacion.update(id_persona, objUsuario);
        res.json(usuarios || {});
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error ingresando registros"});
    }
}

export const findEdadPromedio = async function(req, res) {
    console.log("------------controller------------");
    try{
        const edadMinima= req.body.edadMinima;
        console.log(edadMinima);
        const usuarios = await snotificacion.findEdadPromedio(edadMinima);
        res.json(usuarios || []);
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error obteniendo registros"});
    }
}
*/
