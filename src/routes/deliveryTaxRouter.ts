import { Router } from "express";
import deliveryTaxController from "../controllers/deliveryTaxController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', deliveryTaxController.get);
routes.get('/:id', deliveryTaxController.getById);
routes.post('/', deliveryTaxController.insert);
routes.put('/:id', deliveryTaxController.udpate);
routes.delete('/:id', auth.verifyJWT, deliveryTaxController.delete);

export default routes;