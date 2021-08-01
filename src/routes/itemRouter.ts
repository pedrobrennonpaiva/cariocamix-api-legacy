import { Router } from "express";
import itemController from "../controllers/itemController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', itemController.get);
routes.get('/:id', itemController.getById);
routes.post('/', itemController.insert);
routes.put('/:id', itemController.udpate);
routes.delete('/:id', auth.verifyJWT, itemController.delete);

export default routes;