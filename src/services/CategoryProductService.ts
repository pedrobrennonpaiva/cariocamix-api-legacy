import { Request, Response } from "express";
import { CategoryProduct } from "../models/CategoryProduct";
import db from '../database/db';
import Message from "../utils/Message";
const CategoryProductDb = db.CategoryProduct;
const CategoryDb = db.Category;
const ProductDb = db.Product;

export class CategoryProductService {

    async get() {

        var models = await CategoryProductDb.find().lean();

        for(var model of models)
        {
            model.category = await CategoryDb.findOne({ id: model?.categoryId});
            model.product = await ProductDb.findOne({ id: model?.productId});
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await CategoryProductDb.findOne({ id }).lean();

            model!.category = await CategoryDb.findOne({ id: model?.categoryId});
            model!.product = await ProductDb.findOne({ id: model?.productId});

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new CategoryProduct();
        model.categoryId = request.body.categoryId;
        model.productId = request.body.productId;

        var category = await CategoryDb.findOne({ id: model.categoryId });
        var product = await ProductDb.findOne({ id: model.productId });

        if(!category || !product)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!category ? 'Categoria não existe! ' : ''}
                    ${!product ? 'Produto não existe! ' : ''}
                `
            });
            return;
        }

        const db = new CategoryProductDb(model);
        
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
                    message: Message.CREATE_SUCCESS('CategoriaProduto'),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldCategoryProduct = await CategoryProductDb.findOne({ id });
        
        var model = request.body as CategoryProduct;
        model.id = oldCategoryProduct?.id;
        model.registerDate = oldCategoryProduct?.registerDate!;
        model.categoryId = model.categoryId ?? oldCategoryProduct?.categoryId;
        model.productId = model.productId ?? oldCategoryProduct?.productId;

        var category = await CategoryDb.findOne({ id: model.categoryId });
        var product = await ProductDb.findOne({ id: model.productId });

        if(!category || !product)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!category ? 'Categoria não existe! ' : ''}
                    ${!product ? 'Produto não existe! ' : ''}
                `
            });
            return;
        }
        
        await CategoryProductDb.findOneAndUpdate({ id }, model, { new: true }, ((err: any, result: any) => {
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
                message: Message.UPDATE_SUCCESS('CategoriaProduto'),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        CategoryProductDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('CategoriaProduto')
            });
        });
    }
}