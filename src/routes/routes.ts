import { Router } from "express";
import sendEmailController from "../controllers/sendEmailController";

const routes = Router();

routes.get('/sendEmail', sendEmailController.sendGridEmail);

export default routes;