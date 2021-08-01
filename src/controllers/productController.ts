import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

var productService = new ProductService();

export default {

    async get(_: Request, response: Response) {

        var products = await productService.get();

        response.status(200).send(products);
    },

    async getById(request: Request, response: Response) {

        var product = await productService.getById(request.params.id);

        response.status(200).send(product);
    },

    async insert(request: Request, response: Response) {

        await productService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await productService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await productService.delete(request, response);
    },
}
