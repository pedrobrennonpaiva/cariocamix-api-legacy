import { Router } from "express";
import { auth } from "../configs/auth";
import addressController from "../controllers/addressController";

const routes = Router();

routes.get('/', addressController.get);
routes.get('/:id', addressController.getById);
routes.get('/user/:userId', addressController.getByUserId);
routes.post('/', addressController.insert);
routes.put('/:id', addressController.udpate);
routes.delete('/:id', auth.verifyJWT, addressController.delete);

export default routes;