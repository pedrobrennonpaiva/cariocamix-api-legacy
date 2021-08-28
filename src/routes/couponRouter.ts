import { Router } from "express";
import couponController from "../controllers/couponController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', couponController.get);
routes.get('/:id', couponController.getById);
routes.get('/code/:code', couponController.getByCode);
routes.post('/', couponController.insert);
routes.put('/:id', auth.verifyJWT, couponController.udpate);
routes.delete('/:id', auth.verifyJWT, couponController.delete);

export default routes;