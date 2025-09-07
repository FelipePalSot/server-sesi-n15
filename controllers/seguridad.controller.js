import * as sseguridad from "../services/seguridad.service.js";
import * as auth from "../config/auth.js";

export const findAll = async function(req, res) {
    console.log("------------controller------------");
   
    try{
        const usuarios = await sseguridad.findAll();
        res.json(usuarios || []);
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error obteniendo registros"});
    }
}
 

export const login = function(req, res) {
    console.log("------------controller------------");
    const reqUsuario=req.body;
    console.log(reqUsuario);
    
    sseguridad.login(reqUsuario)
    .then(usuarios => {
        //console.log("... despues de scatalogo.login()");
        if(usuarios[0]){
            console.log('nombre_completo: '+usuarios[0].nombre_completo);
            //... se valido el usuario correctamente ...
            if(usuarios[0].usuario.password==reqUsuario.password){
                let token=auth.generateToken(usuarios[0]);
                let refreshToken=auth.generateRefreshToken(usuarios[0]);
                console.log("token: "+token);
                console.log("refreshToken: "+refreshToken);
                res.json( { token, refreshToken, 
                        "user":{"id_persona":usuarios[0]._id, "email":usuarios[0].usuario.email, "rol":usuarios[0].usuario.rol}
                        } );
            }else{
                res.status(403).json( {"error":"Acceso no autorizado"} );
            }
        }
        else
            res.status(403).json( {"error":"Acceso no autorizado"} );
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({"error":"Error obteniendo registros"});
    });
};


export const refreshToken = function(req, res) {
    console.log("------------controller------------");
    const {refreshToken}=req.body;
    console.log(refreshToken);

    if (!refreshToken){
        return res.status(401).json({"error":"Refresh token requerido"});
    }

    try{
        const decoded = auth.verifyRefreshToken(refreshToken);
        console.log(decoded);
    
        sseguridad.findById(decoded.id_persona)
        .then(usuarios => {
            //console.log("... despues de scatalogo.login()");
            if(usuarios[0]){
                //... se valido el usuario correctamente ...
                let token=auth.generateToken(usuarios[0]);
                console.log("token: "+token);
                res.json( { token, 
                        "user":{"id_persona":usuarios[0]._id, "email":usuarios[0].usuario.email, "rol":usuarios[0].usuario.rol}
                        } );
            }
            else
                res.status(403).json( {"error":"Acceso no autorizado"} );
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({"error":"Error obteniendo registros"});
        });
        
    }catch(error){
        console.log('excepcion...');
        res.status(error.name=='TokenExpiredError'?401:403).json({ error: error.message });
    }
};


export const create = async function(req, res) {
    console.log("------------controller------------");
   
    try{
        const objUsuario= req.body;
        console.log(objUsuario);
        const usuarios = await sseguridad.create(objUsuario);
        res.json(usuarios || {});
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error ingresando registros"});
    }
}

export const update = async function(req, res) {
    console.log("------------controller------------");
   
    try{
        const id_persona= req.params.id;
        const objUsuario= req.body;
        console.log(id_persona);
        console.log(objUsuario);
        const usuarios = await sseguridad.update(id_persona, objUsuario);
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
        const usuarios = await sseguridad.findEdadPromedio(edadMinima);
        res.json(usuarios || []);
    }catch(error){
        console.log(error);
        res.status(500).json({"error":"Error obteniendo registros"});
    }
}

