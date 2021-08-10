import { Router } from "express";
import categoryProductController from "../controllers/categoryProductController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', categoryProductController.get);
routes.get('/:id', categoryProductController.getById);
routes.post('/', categoryProductController.insert);
routes.put('/:id', auth.verifyJWT, categoryProductController.udpate);
routes.delete('/:id', auth.verifyJWT, categoryProductController.delete);

export default routes;