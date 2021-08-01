import { Request, Response } from "express";
import { DeliveryTax } from "../models/DeliveryTax";
import db from '../database/db';
import Message from "../utils/Message";
const DeliveryTaxDb = db.DeliveryTax;
const StoreDb = db.Store;

export class DeliveryTaxService {

    async get() {

        var models = await DeliveryTaxDb.find().lean();

        for(var model of models)
        {
            model.store = await StoreDb.findOne({ id: model?.storeId});
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await DeliveryTaxDb.findOne({ id }).lean();

            model!.store = await StoreDb.findOne({ id: model?.storeId});

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new DeliveryTax();
        model.storeId = request.body.storeId;
        model.radius = request.body.radius;
        model.price = request.body.price;

        var store = await StoreDb.findOne({ id: model.storeId });
        var deliveryTaxExist = await DeliveryTaxDb.findOne({ 
            storeId: model.storeId,
            radius: model.radius, 
        });
        
        if(!store || deliveryTaxExist)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!store ? 'Loja não existe! ' : ''}
                    ${deliveryTaxExist ? 'Taxa de entrega com este raio nesta loja já existe! ' : ''}
                `
            });
            return;
        }

        const db = new DeliveryTaxDb(model);
        
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
                model.store = store;
                response.status(201).send({ 
                    success: true, 
                    message: Message.CREATE_SUCCESS('Taxa de entrega', true),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldDeliveryTax = await DeliveryTaxDb.findOne({ id });
        
        var model = request.body as DeliveryTax;
        model.id = oldDeliveryTax?.id;
        model.registerDate = oldDeliveryTax?.registerDate!;
        model.storeId = model.storeId ?? oldDeliveryTax?.storeId;
        model.radius = model.radius ?? oldDeliveryTax?.radius;
        model.price = model.price ?? oldDeliveryTax?.price;

        var store = await StoreDb.findOne({ id: model.storeId });
        
        if(!store)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!store ? 'Loja não existe! ' : ''}
                `
            });
            return;
        }
        
        await DeliveryTaxDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, 
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
                message: Message.UPDATE_SUCCESS('Taxa de entrega', true),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        DeliveryTaxDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('Taxa de entrega', true)
            });
        });
    }
}