import { Request, Response } from "express";
import { AddressStore } from "../models/AddressStore";
import db from '../database/db';
import Message from "../utils/Message";
const AddressStoreDb = db.AddressStore;
const StoreDb = db.Store;

export class AddressStoreService {

    async get() {

        var models = await AddressStoreDb.find().lean();

        for(var model of models)
        {
            model.store = await StoreDb.findOne({ id: model?.storeId});
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await AddressStoreDb.findOne({ id }).lean();

            model!.store = await StoreDb.findOne({ id: model?.storeId});

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new AddressStore();
        model.storeId = request.body.storeId;
        model.cep = request.body.cep;
        model.addressText = request.body.addressText;
        model.complement = request.body.complement;
        model.neighborhood = request.body.neighborhood;
        model.city = request.body.city;
        model.state = request.body.state;
        model.country = request.body.country;

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

        const db = new AddressStoreDb(model);
        
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
                    message: Message.CREATE_SUCCESS('Endereço'),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldAddressStore = await AddressStoreDb.findOne({ id });
        
        var model = request.body as AddressStore;
        model.id = oldAddressStore?.id;
        model.registerDate = oldAddressStore?.registerDate!;
        model.storeId = model.storeId ?? oldAddressStore?.storeId;
        model.cep = model.cep ?? oldAddressStore?.cep;
        model.addressText = model.addressText ?? oldAddressStore?.addressText;
        model.neighborhood = model.neighborhood ?? oldAddressStore?.neighborhood;
        model.city = model.city ?? oldAddressStore?.city;
        model.state = model.state ?? oldAddressStore?.state;
        model.country = model.country ?? oldAddressStore?.country;

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
        
        await AddressStoreDb.findOneAndUpdate({ id }, model, { new: true }, ((err: any, result: any) => {
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
                message: Message.UPDATE_SUCCESS('Endereço'),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        AddressStoreDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('Endereço')
            });
        });
    }
}