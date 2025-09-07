import _express from "express";
import rseguridad from "./routes/seguridad.routes.js";
import rnotificacion from "./routes/notificacion.routes.js";

const router= _express.Router();

//... secciones ...
router.use('/seguridad', rseguridad);
router.use('/notificacion', rnotificacion);

export default router;
