import { Request, Response } from "express";
import { Coupon } from "../models/Coupon";
import db from '../database/db';
import Message from "../utils/Message";
const CouponDb = db.Coupon;

export class CouponService {

    async get() {

        var models = await CouponDb.find();

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await CouponDb.findOne({ id }).lean();

            return model;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new Coupon();
        model.code = request.body.code;
        model.isActive = request.body.isActive;

        const db = new CouponDb(model);
        
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
                    message: Message.CREATE_SUCCESS('Cupom'),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldCoupon = await CouponDb.findOne({ id });
        
        var model = request.body as Coupon;
        model.id = oldCoupon?.id;
        model.registerDate = oldCoupon?.registerDate!;
        model.code = model.code ?? oldCoupon?.code;
        model.isActive = model.isActive ?? oldCoupon?.isActive;
        
        await CouponDb.findOneAndUpdate({ id }, model, { new: true }, ((err: any, result: any) => {
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
                message: Message.UPDATE_SUCCESS('Cupom'),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        CouponDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('Cupom')
            });
        });
    }
}