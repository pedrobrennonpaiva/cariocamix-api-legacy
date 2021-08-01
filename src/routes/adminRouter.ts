import { Router } from "express";
import adminController from "../controllers/adminController";
import { auth } from "../configs/auth";

const routes = Router();

routes.get('/', adminController.get);
routes.get('/:id', adminController.getById);
routes.get('/name/:name', adminController.getByName);
routes.get('/search/:search', adminController.getBySearch);
routes.post('/authenticate', adminController.login);
routes.post('/logout', adminController.logout);
routes.post('/resetPassword/:id/:newPassword', adminController.resetPassword);
routes.post('/', adminController.insert);
routes.put('/:id', auth.verifyJWT, adminController.udpate);
routes.delete('/:id', auth.verifyJWT, adminController.delete);

export default routes;