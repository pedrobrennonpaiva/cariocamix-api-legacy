import { Request, Response } from "express";
import { UserCoupon } from "../models/UserCoupon";
import db from '../database/db';
import Message from "../utils/Message";
import ExtensionMethod from "../utils/ExtensionMethods";
import { User } from "../models/User";
const UserCouponDb = db.UserCoupon;
const UserDb = db.User;
const CouponDb = db.Coupon;

export class UserCouponService {

    async get() {

        var models = await UserCouponDb.find().lean();

        for(var model of models)
        {
            var user = await UserDb.findOne({ id: model?.userId }) as User;
            
            model.user = ExtensionMethod.WithoutPassword(user);
            model.coupon = await CouponDb.findOne({ id: model?.couponId });
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await UserCouponDb.findOne({ id }).lean();

            var user = await UserDb.findOne({ id: model?.userId }) as User;
            user = ExtensionMethod.WithoutPassword(user);

            model!.user = user;
            model!.coupon = await CouponDb.findOne({ id: model?.couponId });

            return model;
        }
        catch
        {
            return null;
        }
    }

    async getByUserId(userId: string) {
        
        try
        {
            var models = await UserCouponDb.find({ userId: userId }).lean();

            var user = await UserDb.findOne({ id: userId }) as User;
            user = ExtensionMethod.WithoutPassword(user);

            for(var model of models)
            {
                model.user = user;
                model.coupon = await CouponDb.findOne({ id: model?.couponId });
            }

            return models;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new UserCoupon();
        model.userId = request.body.userId;
        model.couponId = request.body.couponId;
        model.isUsed = request.body.isUsed;

        var user = await UserDb.findOne({ id: model.userId });
        var coupon = await CouponDb.findOne({ id: model.couponId });

        if(!user || !coupon)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!user ? 'Usuário não existe! ' : ''}
                    ${!coupon ? 'Cupom não existe! ' : ''}
                `
            });
            return;
        }

        const db = new UserCouponDb(model);
        
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
                    model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldUserCoupon = await UserCouponDb.findOne({ id });
        
        var model = request.body as UserCoupon;
        model.id = oldUserCoupon?.id;
        model.registerDate = oldUserCoupon?.registerDate!;
        model.userId = model.userId ?? oldUserCoupon?.userId;
        model.couponId = model.couponId ?? oldUserCoupon?.couponId;

        var user = await UserDb.findOne({ id: model.userId });
        var coupon = await CouponDb.findOne({ id: model.couponId });

        if(!user || !coupon)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!user ? 'Usuário não existe! ' : ''}
                    ${!coupon ? 'Cupom não existe! ' : ''}
                `
            });
            return;
        }
        
        await UserCouponDb.findOneAndUpdate({ id: request.params.id }, model, { new: true }, ((err: any, UserCoupon: any) => {
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
                model
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        UserCouponDb.remove({ id }, (err: any) => {
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