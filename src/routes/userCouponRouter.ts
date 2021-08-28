import { Router } from "express";
import userCouponController from "../controllers/userCouponController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', userCouponController.get);
routes.get('/:id', userCouponController.getById);
routes.get('user/:userId', userCouponController.getByUserId);
routes.post('/', userCouponController.insert);
routes.put('/:id', auth.verifyJWT, userCouponController.udpate);
routes.delete('/:id', auth.verifyJWT, userCouponController.delete);

export default routes;