import { Router } from "express";
import { auth } from "../configs/auth";
import imageController from "../controllers/imageController";

const routes = Router();

routes.post('/upload', imageController.upload);
routes.get('/upload/browser/:filename', imageController.uploadByFilenameBrowser);
routes.delete('/upload/:filename', auth.verifyJWT, imageController.deleteUpload);

export default routes;