import { Router } from "express";
import imageController from "../controllers/imageController";

const routes = Router();

routes.post('/upload', imageController.upload);
routes.get('/upload/browser/:filename', imageController.uploadByFilenameBrowser);
// routes.get('/upload/:filename', imageController.uploadByFilename);

export default routes;