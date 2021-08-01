import { Request, Response } from "express";
import { DeliveryStatus } from "../models/DeliveryStatus";
import db from '../database/db';
import Message from "../utils/Message";
const DeliveryStatusDb = db.DeliveryStatus;

export class DeliveryStatusService {

    async get() {

        var models = await DeliveryStatusDb.find().lean();

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await DeliveryStatusDb.findOne({ id }).lean();

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new DeliveryStatus();
        model.name = request.body.name;

        const db = new DeliveryStatusDb(model);
        
        db.save((err: any) => {
            if (err) {
                console.log(err);
                response.status(400).send({ 
                    success: false, 
                    message: Message.CREATE_ERROR,
                    error: err
                });
            }
            else {
                response.status(201).send({ 
                    success: true, 
                    message: Message.CREATE_SUCCESS('Status'),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldDeliveryStatus = await DeliveryStatusDb.findOne({ id });
        
        var model = request.body as DeliveryStatus;
        model.id = oldDeliveryStatus?.id;
        model.registerDate = oldDeliveryStatus?.registerDate!;
        model.name = model.name ?? oldDeliveryStatus?.name;
        
        await DeliveryStatusDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, 
            ((err: any, result: any) => {
            if(err)
            {
                response.status(400).send({ 
                    success: false, 
                    message: Message.UPDATE_ERROR,
                    error: err
                });
            }

            response.status(200).send({ 
                success: true, 
                message: Message.UPDATE_SUCCESS('Status'),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        DeliveryStatusDb.remove({ id }, (err: any) => {
            if(err)
            {
                response.status(400).send({ 
                    success: false, 
                    message: Message.DELETE_ERROR,
                    error: err
                });
            }

            response.status(200).send({ 
                success: true, 
                message: Message.DELETE_SUCCESS('Status')
            });
        });
    }
}