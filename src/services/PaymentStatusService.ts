import { Request, Response } from "express";
import { PaymentStatus } from "../models/PaymentStatus";
import db from '../database/db';
import Message from "../utils/Message";
const PaymentStatusDb = db.PaymentStatus;

export class PaymentStatusService {

    async get() {

        var models = await PaymentStatusDb.find().lean();

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await PaymentStatusDb.findOne({ id }).lean();

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new PaymentStatus();
        model.name = request.body.name;

        const db = new PaymentStatusDb(model);
        
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

        var oldPaymentStatus = await PaymentStatusDb.findOne({ id });
        
        var model = request.body as PaymentStatus;
        model.id = oldPaymentStatus?.id;
        model.registerDate = oldPaymentStatus?.registerDate!;
        model.name = model.name ?? oldPaymentStatus?.name;
        
        await PaymentStatusDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, 
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
        
        PaymentStatusDb.remove({ id }, (err: any) => {
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