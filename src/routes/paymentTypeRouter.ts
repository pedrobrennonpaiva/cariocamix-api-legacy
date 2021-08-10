import { Router } from "express";
import paymentTypeController from "../controllers/paymentTypeController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', paymentTypeController.get);
routes.get('/:id', paymentTypeController.getById);
routes.post('/', paymentTypeController.insert);
routes.put('/:id', auth.verifyJWT, paymentTypeController.udpate);
routes.delete('/:id', auth.verifyJWT, paymentTypeController.delete);

export default routes;