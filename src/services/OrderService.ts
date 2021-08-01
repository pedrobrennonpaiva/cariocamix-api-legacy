import { Request, Response } from "express";
import { Order } from "../models/Order";
import db from '../database/db';
import Message from "../utils/Message";
const OrderDb = db.Order;
const UserDb = db.User;
const CouponDb = db.Coupon;
const PaymentTypeDb = db.PaymentType;
const PaymentStatusDb = db.PaymentStatus;
const DeliveryStatusDb = db.DeliveryStatus;
const DeliveryTaxDb = db.DeliveryTax;

export class OrderService {

    async get() {
        
        var models = await OrderDb.find().lean();
        
        for(var model of models)
        {
            model.user = await UserDb.findOne({ id: model?.userId});
            model.coupon = await CouponDb.findOne({ id: model?.couponId});
            model.paymentType = await PaymentTypeDb.findOne({ id: model?.paymentTypeId});
            model.paymentStatus = await PaymentStatusDb.findOne({ id: model?.paymentStatusId});
            model.deliveryStatus = await DeliveryStatusDb.findOne({ id: model?.deliveryStatusId});
            model.deliveryTax = await DeliveryTaxDb.findOne({ id: model?.deliveryTaxId});
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await OrderDb.findOne({ id }).lean();

            model!.user = await UserDb.findOne({ id: model?.userId});
            model!.coupon = await CouponDb.findOne({ id: model?.couponId});
            model!.paymentType = await PaymentTypeDb.findOne({ id: model?.paymentTypeId});
            model!.paymentStatus = await PaymentStatusDb.findOne({ id: model?.paymentStatusId});
            model!.deliveryStatus = await DeliveryStatusDb.findOne({ id: model?.deliveryStatusId});
            model!.deliveryTax = await DeliveryTaxDb.findOne({ id: model?.deliveryTaxId});

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new Order();
        model.total = request.body.total;
        model.userId = request.body.userId;
        model.couponId = request.body.couponId;
        model.paymentTypeId = request.body.paymentTypeId;
        model.paymentStatusId = request.body.paymentStatusId;
        model.deliveryStatusId = request.body.deliveryStatusId;
        model.deliveryTaxId = request.body.deliveryTaxId;

        var user = await UserDb.findOne({ id: model.userId });
        var coupon = await CouponDb.findOne({ id: model.couponId });
        var paymentType = await PaymentTypeDb.findOne({ id: model?.paymentTypeId});
        var paymentStatus = await PaymentStatusDb.findOne({ id: model?.paymentStatusId});
        var deliveryStatus = await DeliveryStatusDb.findOne({ id: model?.deliveryStatusId});
        var deliveryTax = await DeliveryTaxDb.findOne({ id: model?.deliveryTaxId});

        if(!user || !coupon || !paymentType || !paymentStatus || 
            !deliveryStatus || !deliveryTax)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!user ? 'Usuário não existe! ' : ''}
                    ${!coupon ? 'Cupom não existe! ' : ''}
                    ${!paymentType ? 'Tipo de pagamento não existe! ' : ''}
                    ${!paymentStatus ? 'Status do pagamento não existe! ' : ''}
                    ${!deliveryStatus ? 'Status da entrega não existe! ' : ''}
                    ${!deliveryTax ? 'Taxa de entrega não existe! ' : ''}
                `
            });
            return;
        }

        const db = new OrderDb(model);
        
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
                    message: Message.CREATE_SUCCESS('Pedido'),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldOrder = await OrderDb.findOne({ id });
        
        var model = request.body as Order;
        model.id = oldOrder?.id;
        model.registerDate = oldOrder?.registerDate!;
        model.total = model.total ?? oldOrder?.total;
        model.userId = model.userId ?? oldOrder?.userId;
        model.couponId = model.couponId ?? oldOrder?.couponId;
        model.paymentTypeId = model.paymentTypeId ?? oldOrder?.paymentTypeId;
        model.paymentStatusId = model.paymentStatusId ?? oldOrder?.paymentStatusId;
        model.deliveryStatusId = model.deliveryStatusId ?? oldOrder?.deliveryStatusId;
        model.deliveryTaxId = model.deliveryTaxId ?? oldOrder?.deliveryTaxId;

        var user = await UserDb.findOne({ id: model.userId });
        var coupon = await CouponDb.findOne({ id: model.couponId });
        var paymentType = await PaymentTypeDb.findOne({ id: model?.paymentTypeId});
        var paymentStatus = await PaymentStatusDb.findOne({ id: model?.paymentStatusId});
        var deliveryStatus = await DeliveryStatusDb.findOne({ id: model?.deliveryStatusId});
        var deliveryTax = await DeliveryTaxDb.findOne({ id: model?.deliveryTaxId});

        if(!user || !coupon || !paymentType || !paymentStatus || 
            !deliveryStatus || !deliveryTax)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!user ? 'Usuário não existe! ' : ''}
                    ${!coupon ? 'Cupom não existe! ' : ''}
                    ${!paymentType ? 'Tipo de pagamento não existe! ' : ''}
                    ${!paymentStatus ? 'Status do pagamento não existe! ' : ''}
                    ${!deliveryStatus ? 'Status da entrega não existe! ' : ''}
                    ${!deliveryTax ? 'Taxa de entrega não existe! ' : ''}
                `
            });
            return;
        }
        
        await OrderDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, 
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
                message: Message.UPDATE_SUCCESS('Pedido'),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        OrderDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('Pedido')
            });
        });
    }
}