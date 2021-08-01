import { Router } from "express";
import productController from "../controllers/productController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', productController.get);
routes.get('/:id', productController.getById);
routes.post('/', productController.insert);
routes.put('/:id', productController.udpate);
routes.delete('/:id', auth.verifyJWT, productController.delete);

export default routes;