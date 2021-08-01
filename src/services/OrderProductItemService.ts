import { Request, Response } from "express";
import { OrderProductItem } from "../models/OrderProductItem";
import db from '../database/db';
import Message from "../utils/Message";
const OrderProductItemDb = db.OrderProductItem;
const OrderProductDb = db.OrderProduct;
const ProductItemDb = db.ProductItem;

export class OrderProductItemService {

    async get() {

        var models = await OrderProductItemDb.find().lean();

        for(var model of models)
        {
            model.orderProduct = await OrderProductDb.findOne({ id: model?.orderProductId});
            model.productItem = await ProductItemDb.findOne({ id: model?.productItemId});
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await OrderProductItemDb.findOne({ id }).lean();

            model!.orderProduct = await OrderProductDb.findOne({ id: model?.orderProductId});
            model!.productItem = await ProductItemDb.findOne({ id: model?.productItemId});

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new OrderProductItem();
        model.orderProductId = request.body.orderProductId;
        model.productItemId = request.body.productItemId;

        var orderProduct = await OrderProductDb.findOne({ id: model.orderProductId });
        var productItem = await ProductItemDb.findOne({ id: model.productItemId });

        if(!orderProduct || !productItem)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!orderProduct ? 'OrdemProduto não existe! ' : ''}
                    ${!productItem ? 'ItemProduto não existe! ' : ''}
                `
            });
            return;
        }

        const db = new OrderProductItemDb(model);
        
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
                    message: Message.CREATE_SUCCESS('OrdemProdutoItemProduto'),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldOrderProductItem = await OrderProductItemDb.findOne({ id });
        
        var model = request.body as OrderProductItem;
        model.id = oldOrderProductItem?.id;
        model.registerDate = oldOrderProductItem?.registerDate!;
        model.orderProductId = model.orderProductId ?? oldOrderProductItem?.orderProductId;
        model.productItemId = model.productItemId ?? oldOrderProductItem?.productItemId;

        var orderProduct = await OrderProductDb.findOne({ id: model.orderProductId });
        var productItem = await ProductItemDb.findOne({ id: model.productItemId });

        if(!orderProduct || !productItem)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!orderProduct ? 'OrdemProduto não existe! ' : ''}
                    ${!productItem ? 'ItemProduto não existe! ' : ''}
                `
            });
            return;
        }
        
        await OrderProductItemDb.findOneAndUpdate({ id }, model, { new: true }, ((err: any, result: any) => {
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
                message: Message.UPDATE_SUCCESS('OrdemProdutoItemProduto'),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        OrderProductItemDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('OrdemProdutoItemProduto')
            });
        });
    }
}