import { Router } from "express";
import storeDayHourController from "../controllers/storeDayHourController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', storeDayHourController.get);
routes.get('/:id', storeDayHourController.getById);
routes.post('/', storeDayHourController.insert);
routes.put('/:id', auth.verifyJWT, storeDayHourController.udpate);
routes.delete('/:id', auth.verifyJWT, storeDayHourController.delete);

export default routes;