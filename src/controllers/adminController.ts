import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";

var adminService = new AdminService();

export default {

    async get(_: Request, response: Response) {

        var admins = await adminService.get();

        response.status(200).send(admins);
    },

    async getById(request: Request, response: Response) {

        var admin = await adminService.getById(request.params.id);

        response.status(200).send(admin);
    },

    async getByName(request: Request, response: Response) {

        var admins = await adminService.getByName(request.params.name);

        response.status(200).send(admins);
    },

    async getBySearch(request: Request, response: Response) {

        var admins = await adminService.getBySearch(request.params.search);

        response.status(200).send(admins);
    },

    async login(request: Request, response: Response) {

        await adminService.login(request, response);
    },

    async logout(request: Request, response: Response) {

        response.json({ 
            auth: false, 
            token: null 
        });
    },

    async resetPassword(request: Request, response: Response) {

        await adminService.resetPassword(request, response);
    },

    async insert(request: Request, response: Response) {

        await adminService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await adminService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await adminService.delete(request, response);
    },
}
