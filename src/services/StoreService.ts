import { Request, Response } from "express";
import { Store } from "../models/Store";
import db from '../database/db';
import Message from "../utils/Message";

const StoreDb = db.Store;
const StoreDayHourDb = db.StoreDayHour;
const AddressStoreDb = db.AddressStore;

export class StoreService {

    async get() {

        var models = await StoreDb.find().lean();

        for(var model of models)
        {
            var storeDayHours = await StoreDayHourDb.find({ storeId: model?.id }).lean();
            model.storeDayHours = storeDayHours.sort((a,b) => a.dayOfWeek - b.dayOfWeek);
            model.addressStore = await AddressStoreDb.findOne({ storeId: model?.id }).lean();
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await StoreDb.findOne({ id }).lean();

            var storeDayHours = await StoreDayHourDb.find({ storeId: model?.id }).lean();
            model!.storeDayHours = storeDayHours.sort((a,b) => a.dayOfWeek - b.dayOfWeek);
            model!.addressStore = await AddressStoreDb.findOne({ storeId: model?.id }).lean();

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new Store();
        model.name = request.body.name;

        const db = new StoreDb(model);
        
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

        var oldStore = await StoreDb.findOne({ id });
        
        var model = request.body as Store;
        model.id = oldStore?.id;
        model.registerDate = oldStore?.registerDate!;
        model.name = model.name ?? oldStore?.name;
        
        await StoreDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, ((err: any, result: any) => {
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
        
        StoreDb.remove({ id }, (err: any) => {
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