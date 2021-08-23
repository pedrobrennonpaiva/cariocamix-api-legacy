import { Request, Response } from "express";
import { StoreDayHourService } from "../services/StoreDayHourService";

var storeDayHourService = new StoreDayHourService();

export default {

    async get(_: Request, response: Response) {

        var storeDayHours = await storeDayHourService.get();

        response.status(200).send(storeDayHours);
    },

    async getById(request: Request, response: Response) {

        var storeDayHour = await storeDayHourService.getById(request.params.id);

        response.status(200).send(storeDayHour);
    },

    async insert(request: Request, response: Response) {

        await storeDayHourService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await storeDayHourService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await storeDayHourService.delete(request, response);
    },
}
