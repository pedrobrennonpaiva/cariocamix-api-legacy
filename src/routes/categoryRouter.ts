import { Router } from "express";
import categoryController from "../controllers/categoryController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', categoryController.get);
routes.get('/:id', categoryController.getById);
routes.post('/', categoryController.insert);
routes.put('/:id', auth.verifyJWT, categoryController.udpate);
routes.delete('/:id', auth.verifyJWT, categoryController.delete);

export default routes;