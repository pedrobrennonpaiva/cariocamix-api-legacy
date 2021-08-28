import { Request, Response } from "express";
import { AddressService } from "../services/AddressService";

var addressService = new AddressService();

export default {

    async get(_: Request, response: Response) {

        var addresses = await addressService.get();

        response.status(200).send(addresses);
    },

    async getById(request: Request, response: Response) {

        var address = await addressService.getById(request.params.id);

        response.status(200).send(address);
    },

    async getByUserId(request: Request, response: Response) {

        var address = await addressService.getByUserId(request.params.userId);

        response.status(200).send(address);
    },

    async insert(request: Request, response: Response) {

        await addressService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await addressService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await addressService.delete(request, response);
    },
}
