import { Request, Response } from "express";
import { AddressStoreService } from "../services/AddressStoreService";

var addressStoreService = new AddressStoreService();

export default {

    async get(_: Request, response: Response) {

        var addressStores = await addressStoreService.get();

        response.status(200).send(addressStores);
    },

    async getById(request: Request, response: Response) {

        var addressStore = await addressStoreService.getById(request.params.id);

        response.status(200).send(addressStore);
    },

    async insert(request: Request, response: Response) {

        await addressStoreService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await addressStoreService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await addressStoreService.delete(request, response);
    },
}
