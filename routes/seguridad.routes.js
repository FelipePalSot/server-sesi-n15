import _express from "express";
import * as cseguridad from "../controllers/seguridad.controller.js";
import * as mauth from "../middleware/auth.middleware.js";
const router= _express.Router();

//router.get('/findAll', mauth.authMiddleware(["admin"]), cseguridad.findAll);
router.get('/', cseguridad.findAll);

router.post('/login', cseguridad.login);

router.post('/refresh-token', cseguridad.refreshToken);

router.post('/', cseguridad.create);

router.put('/:id', cseguridad.update);

router.get('/edad-promedio', cseguridad.findEdadPromedio);

export default router;
