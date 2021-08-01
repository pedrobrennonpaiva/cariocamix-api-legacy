import { Request, Response } from "express";
import { Item } from "../models/Item";
import db from '../database/db';
import Message from "../utils/Message";
const ItemDb = db.Item;

export class ItemService {

    async get() {

        var models = await ItemDb.find().lean();

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await ItemDb.findOne({ id }).lean();

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new Item();
        model.price = request.body.price;
        model.title = request.body.title;

        const db = new ItemDb(model);
        
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
                    message: Message.CREATE_SUCCESS('Item'),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldItem = await ItemDb.findOne({ id });
        
        var model = request.body as Item;
        model.id = oldItem?.id;
        model.registerDate = oldItem?.registerDate!;
        model.title = model.title ?? oldItem?.title;
        model.price = model.price ?? oldItem?.price;
        
        await ItemDb.findOneAndUpdate({ id }, model, { new: true }, ((err: any, result: any) => {
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
                message: Message.UPDATE_SUCCESS('Item'),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        ItemDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('Item')
            });
        });
    }
}