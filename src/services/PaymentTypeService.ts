import { Request, Response } from "express";
import { PaymentType } from "../models/PaymentType";
import db from '../database/db';
import Message from "../utils/Message";
const PaymentTypeDb = db.PaymentType;

export class PaymentTypeService {

    async get() {

        var models = await PaymentTypeDb.find().lean();

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await PaymentTypeDb.findOne({ id }).lean();

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new PaymentType();
        model.name = request.body.name;

        const db = new PaymentTypeDb(model);
        
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
                    message: Message.CREATE_SUCCESS('Tipo de pagamento'),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldPaymentType = await PaymentTypeDb.findOne({ id });
        
        var model = request.body as PaymentType;
        model.id = oldPaymentType?.id;
        model.registerDate = oldPaymentType?.registerDate!;
        model.name = model.name ?? oldPaymentType?.name;
        
        await PaymentTypeDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, 
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
                message: Message.UPDATE_SUCCESS('Tipo de pagamento'),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        PaymentTypeDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('Tipo de pagamento')
            });
        });
    }
}