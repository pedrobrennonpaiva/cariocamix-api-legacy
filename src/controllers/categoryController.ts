import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";

var categoryService = new CategoryService();

export default {

    async get(_: Request, response: Response) {

        var categorys = await categoryService.get();

        response.status(200).send(categorys);
    },

    async getById(request: Request, response: Response) {

        var category = await categoryService.getById(request.params.id);

        response.status(200).send(category);
    },

    async insert(request: Request, response: Response) {

        await categoryService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await categoryService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await categoryService.delete(request, response);
    },
}
