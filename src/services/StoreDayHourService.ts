import { Request, Response } from "express";
import { StoreDayHour } from "../models/StoreDayHour";
import db from '../database/db';
import Message from "../utils/Message";
const StoreDayHourDb = db.StoreDayHour;
const StoreDb = db.Store;

export class StoreDayHourService {

    async get() {

        var models = await StoreDayHourDb.find().lean();

        for(var model of models)
        {
            model.store = await StoreDb.findOne({ id: model?.storeId});
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await StoreDayHourDb.findOne({ id }).lean();

            model!.store = await StoreDb.findOne({ id: model?.storeId});

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new StoreDayHour();
        model.storeId = request.body.storeId;
        model.dayOfWeek = request.body.dayOfWeek;
        model.hourOpen = request.body.hourOpen;
        model.hourClose = request.body.hourClose;

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

        const db = new StoreDayHourDb(model);
        
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
                    message: Message.CREATE_SUCCESS('Loja', true),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldStoreDayHour = await StoreDayHourDb.findOne({ id });
        
        var model = request.body as StoreDayHour;
        model.id = oldStoreDayHour?.id;
        model.registerDate = oldStoreDayHour?.registerDate!;
        model.storeId = model.storeId ?? oldStoreDayHour?.storeId;
        model.dayOfWeek = model.dayOfWeek ?? oldStoreDayHour?.dayOfWeek;
        model.hourOpen = model.hourOpen ?? oldStoreDayHour?.hourOpen;
        model.hourClose = model.hourClose ?? oldStoreDayHour?.hourClose;

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
        
        await StoreDayHourDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, ((err: any, result: any) => {
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
                message: Message.UPDATE_SUCCESS('Loja', true),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        StoreDayHourDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('Loja', true),
            });
        });
    }
}