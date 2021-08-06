import { Request, Response } from "express";
import { UserService } from "../services/UserService";

var userService = new UserService();

export default {

    async get(_: Request, response: Response) {

        var users = await userService.get();

        response.status(200).send(users);
    },

    async getById(request: Request, response: Response) {

        var user = await userService.getById(request.params.id);

        response.status(200).send(user);
    },

    async getByName(request: Request, response: Response) {

        var users = await userService.getByName(request.params.name);

        response.status(200).send(users);
    },

    async getBySearch(request: Request, response: Response) {

        var users = await userService.getBySearch(request.params.search);

        response.status(200).send(users);
    },

    async login(request: Request, response: Response) {

        await userService.login(request, response);
    },

    async resetPassword(request: Request, response: Response) {

        await userService.resetPassword(request, response);
    },

    async insert(request: Request, response: Response) {

        await userService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await userService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await userService.delete(request, response);
    },
}
