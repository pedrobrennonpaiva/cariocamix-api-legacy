import { Router } from "express";
import userController from "../controllers/userController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', userController.get);
routes.get('/:id', userController.getById);
routes.get('/name/:name', userController.getByName);
routes.get('/search/:search', userController.getBySearch);
routes.post('/authenticate', userController.login);
routes.post('/resetPassword/:id/:newPassword', userController.resetPassword);
routes.post('/', userController.insert);
routes.put('/:id', auth.verifyJWT, userController.udpate);
routes.delete('/:id', auth.verifyJWT, userController.delete);

export default routes;