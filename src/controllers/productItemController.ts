import { Request, Response } from "express";
import { ProductItemService } from "../services/ProductItemService";

var productItemService = new ProductItemService();

export default {

    async get(_: Request, response: Response) {

        var productItems = await productItemService.get();

        response.status(200).send(productItems);
    },

    async getById(request: Request, response: Response) {

        var productItem = await productItemService.getById(request.params.id);

        response.status(200).send(productItem);
    },

    async getByProductId(request: Request, response: Response) {

        var productItems = await productItemService.getByProductId(request.params.id);

        response.status(200).send(productItems);
    },

    async insert(request: Request, response: Response) {

        await productItemService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await productItemService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await productItemService.delete(request, response);
    },
}
