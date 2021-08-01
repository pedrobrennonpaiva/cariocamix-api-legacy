import { Router } from "express";
import addressStoreController from "../controllers/addressStoreController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', addressStoreController.get);
routes.get('/:id', addressStoreController.getById);
routes.post('/', addressStoreController.insert);
routes.put('/:id', addressStoreController.udpate);
routes.delete('/:id', auth.verifyJWT, addressStoreController.delete);

export default routes;