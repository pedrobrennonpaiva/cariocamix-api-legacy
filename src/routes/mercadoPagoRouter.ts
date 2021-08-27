import { Router } from "express";
import { auth } from "../configs/auth";
import mercadoPagoController from "../controllers/mercadoPagoController";

const routes = Router();

// routes.get('/', itemController.get);
// routes.get('/:id', itemController.getById);
routes.post('/', mercadoPagoController.insert);
// routes.put('/:id', auth.verifyJWT, itemController.udpate);
// routes.delete('/:id', auth.verifyJWT, itemController.delete);

export default routes;