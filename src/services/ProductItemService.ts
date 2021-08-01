import { Request, Response } from "express";
import { ProductItem } from "../models/ProductItem";
import db from '../database/db';
import Message from "../utils/Message";
const ProductItemDb = db.ProductItem;
const ProductDb = db.Product;
const ItemDb = db.Item;

export class ProductItemService {

    async get() {

        var models = await ProductItemDb.find().lean();

        for(var model of models)
        {
            model.product = await ProductDb.findOne({ id: model?.productId });
            model.item = await ItemDb.findOne({ id: model?.itemId });
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await ProductItemDb.findOne({ id }).lean();

            model!.product = await ProductDb.findOne({ id: model?.productId });
            model!.item = await ItemDb.findOne({ id: model?.itemId });

            return model;
        }
        catch
        {
            return null;
        }
    }

    async getByProductId(productId: string) {

        var models = await ProductItemDb.find({ productId: productId }).lean();

        for(var model of models)
        {
            model.product = await ProductDb.findOne({ id: model?.productId });
            model.item = await ItemDb.findOne({ id: model?.itemId });
        }

        return models;
    }

    async insert(request: Request, response: Response) {

        var model = new ProductItem();
        model.productId = request.body.productId;
        model.itemId = request.body.itemId;
        model.isDefault = request.body.isDefault;
        model.price = request.body.price;

        var product = await ProductDb.findOne({ id: model.productId });
        var item = await ItemDb.findOne({ id: model.itemId });

        if(!product || !item)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!product ? 'Produto não existe! ' : ''}
                    ${!item ? 'Item não existe! ' : ''}
                `
            });
            return;
        }

        const db = new ProductItemDb(model);
        
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
                    model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldProductItem = await ProductItemDb.findOne({ id });
        
        var model = request.body as ProductItem;
        model.id = oldProductItem?.id;
        model.registerDate = oldProductItem?.registerDate!;
        model.productId = model.productId ?? oldProductItem?.productId;
        model.itemId = model.itemId ?? oldProductItem?.itemId;
        model.isDefault = model.isDefault ?? oldProductItem?.isDefault;
        model.price = model.price ?? oldProductItem?.price;

        var product = await ProductDb.findOne({ id: model.productId });
        var item = await ItemDb.findOne({ id: model.itemId });

        if(!product || !item)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!product ? 'Produto não existe! ' : ''}
                    ${!item ? 'Item não existe! ' : ''}
                `
            });
            return;
        }
        
        await ProductItemDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, ((err: any, ProductItem: any) => {
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
                model
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        ProductItemDb.remove({ id }, (err: any) => {
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