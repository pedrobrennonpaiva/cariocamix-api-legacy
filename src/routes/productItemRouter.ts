import { Router } from "express";
import productItemController from "../controllers/productItemController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', productItemController.get);
routes.get('/:id', productItemController.getById);
routes.get('/product/:id', productItemController.getByProductId);
routes.post('/', productItemController.insert);
routes.put('/:id', productItemController.udpate);
routes.delete('/:id', auth.verifyJWT, productItemController.delete);

export default routes;