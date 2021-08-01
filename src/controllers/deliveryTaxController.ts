import { Request, Response } from "express";
import { DeliveryTaxService } from "../services/DeliveryTaxService";

var deliveryTaxService = new DeliveryTaxService();

export default {

    async get(_: Request, response: Response) {

        var deliveryTaxs = await deliveryTaxService.get();

        response.status(200).send(deliveryTaxs);
    },

    async getById(request: Request, response: Response) {

        var deliveryTax = await deliveryTaxService.getById(request.params.id);

        response.status(200).send(deliveryTax);
    },

    async insert(request: Request, response: Response) {

        await deliveryTaxService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await deliveryTaxService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await deliveryTaxService.delete(request, response);
    },
}
