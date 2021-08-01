import { Request, Response } from "express";
import { OrderProduct } from "../models/OrderProduct";
import db from '../database/db';
import Message from "../utils/Message";
const OrderProductDb = db.OrderProduct;
const OrderDb = db.Order;
const ProductDb = db.Product;

export class OrderProductService {

    async get() {

        var models = await OrderProductDb.find().lean();

        for(var model of models)
        {
            model.order = await OrderDb.findOne({ id: model?.orderId});
            model.product = await ProductDb.findOne({ id: model?.productId});
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await OrderProductDb.findOne({ id }).lean();

            model!.order = await OrderDb.findOne({ id: model?.orderId});
            model!.product = await ProductDb.findOne({ id: model?.productId});

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new OrderProduct();
        model.orderId = request.body.orderId;
        model.productId = request.body.productId;
        model.obs = request.body.obs;

        var order = await OrderDb.findOne({ id: model.orderId });
        var product = await ProductDb.findOne({ id: model.productId });

        if(!order || !product)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!order ? 'Categoria não existe! ' : ''}
                    ${!product ? 'Produto não existe! ' : ''}
                `
            });
            return;
        }

        const db = new OrderProductDb(model);
        
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
                    message: Message.CREATE_SUCCESS('OrdemProduto'),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldOrderProduct = await OrderProductDb.findOne({ id });
        
        var model = request.body as OrderProduct;
        model.id = oldOrderProduct?.id;
        model.registerDate = oldOrderProduct?.registerDate!;
        model.orderId = model.orderId ?? oldOrderProduct?.orderId;
        model.productId = model.productId ?? oldOrderProduct?.productId;

        var order = await OrderDb.findOne({ id: model.orderId });
        var product = await ProductDb.findOne({ id: model.productId });

        if(!order || !product)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!order ? 'Categoria não existe! ' : ''}
                    ${!product ? 'Produto não existe! ' : ''}
                `
            });
            return;
        }
        
        await OrderProductDb.findOneAndUpdate({ id }, model, { new: true }, ((err: any, result: any) => {
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
                message: Message.UPDATE_SUCCESS('OrdemProduto'),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        OrderProductDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('OrdemProduto')
            });
        });
    }
}