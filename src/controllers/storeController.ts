import { Request, Response } from "express";
import { StoreService } from "../services/StoreService";

var storeService = new StoreService();

export default {

    async get(_: Request, response: Response) {

        var stores = await storeService.get();

        response.status(200).send(stores);
    },

    async getById(request: Request, response: Response) {

        var store = await storeService.getById(request.params.id);

        response.status(200).send(store);
    },

    async insert(request: Request, response: Response) {

        await storeService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await storeService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await storeService.delete(request, response);
    },
}
