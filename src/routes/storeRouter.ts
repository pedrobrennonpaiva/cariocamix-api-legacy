import { Router } from "express";
import storeController from "../controllers/storeController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', storeController.get);
routes.get('/:id', storeController.getById);
routes.post('/', storeController.insert);
routes.put('/:id', auth.verifyJWT, storeController.udpate);
routes.delete('/:id', auth.verifyJWT, storeController.delete);

export default routes;