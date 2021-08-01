import { Request, Response } from "express";
import { CategoryProductService } from "../services/CategoryProductService";

var categoryProductService = new CategoryProductService();

export default {

    async get(_: Request, response: Response) {

        var categoryProducts = await categoryProductService.get();

        response.status(200).send(categoryProducts);
    },

    async getById(request: Request, response: Response) {

        var categoryProduct = await categoryProductService.getById(request.params.id);

        response.status(200).send(categoryProduct);
    },

    async insert(request: Request, response: Response) {

        await categoryProductService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await categoryProductService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await categoryProductService.delete(request, response);
    },
}
