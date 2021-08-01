import { Request, Response } from "express";
import { Category } from "../models/Category";
import db from '../database/db';
import Message from "../utils/Message";
const CategoryDb = db.Category;

export class CategoryService {

    async get() {

        var models = await CategoryDb.find().lean();

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await CategoryDb.findOne({ id }).lean();

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new Category();
        model.title = request.body.title;

        const db = new CategoryDb(model);
        
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
                    message: Message.CREATE_SUCCESS('Categoria', true),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldCategory = await CategoryDb.findOne({ id });
        
        var model = request.body as Category;
        model.id = oldCategory?.id;
        model.registerDate = oldCategory?.registerDate!;
        model.title = model.title ?? oldCategory?.title;
        
        await CategoryDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, 
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
                message: Message.UPDATE_SUCCESS('Categoria', true),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        CategoryDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('Categoria', true)
            });
        });
    }
}