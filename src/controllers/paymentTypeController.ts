import { Request, Response } from "express";
import { PaymentTypeService } from "../services/PaymentTypeService";

var paymentTypeService = new PaymentTypeService();

export default {

    async get(_: Request, response: Response) {

        var paymentTypes = await paymentTypeService.get();

        response.status(200).send(paymentTypes);
    },

    async getById(request: Request, response: Response) {

        var paymentType = await paymentTypeService.getById(request.params.id);

        response.status(200).send(paymentType);
    },

    async insert(request: Request, response: Response) {

        await paymentTypeService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await paymentTypeService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await paymentTypeService.delete(request, response);
    },
}
