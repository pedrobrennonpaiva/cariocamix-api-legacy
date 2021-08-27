import { Request, Response } from "express";
import { MercadoPagoService } from "../services/MercadoPagoService";

const mercadoPagoService = new MercadoPagoService();

export default {

    async get(_: Request, response: Response) {
    },

    async getById(request: Request, response: Response) {
    },

    async insert(request: Request, response: Response) {

        await mercadoPagoService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {
    },

    async delete(request: Request, response: Response) {
    },
}
