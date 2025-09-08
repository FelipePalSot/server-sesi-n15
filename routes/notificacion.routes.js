import _express from "express";
import * as cnotificacion from "../controllers/notificacion.controller.js";
import * as mauth from "../middleware/auth.middleware.js";
const router= _express.Router();

// Marca una notificación como leída
router.patch('/:id/leer', cnotificacion.leer);

//router.get('/findAll', mauth.authMiddleware(["admin"]), cseguridad.findAll);
router.get('/:id', cnotificacion.findByEmail);

router.post('/', cnotificacion.create);

export default router;
