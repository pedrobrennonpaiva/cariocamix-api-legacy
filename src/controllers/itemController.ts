import { Request, Response } from "express";
import { ItemService } from "../services/ItemService";

var itemService = new ItemService();

export default {

    async get(_: Request, response: Response) {

        var items = await itemService.get();

        response.status(200).send(items);
    },

    async getById(request: Request, response: Response) {

        var item = await itemService.getById(request.params.id);

        response.status(200).send(item);
    },

    async insert(request: Request, response: Response) {

        await itemService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await itemService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await itemService.delete(request, response);
    },
}
