import * as snotificacion from "../services/notificacion.service.js";
import * as auth from "../config/auth.js";

export const findByEmail = async function(req, res) {
    console.log("------------controller------------");
   
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
    console.log("------------controller------------");
   
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
