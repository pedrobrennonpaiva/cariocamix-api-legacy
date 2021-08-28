import { Request, Response } from "express";
import { UserCouponService } from "../services/UserCouponService";

var userCouponService = new UserCouponService();

export default {

    async get(_: Request, response: Response) {

        var userCoupons = await userCouponService.get();

        response.status(200).send(userCoupons);
    },

    async getById(request: Request, response: Response) {

        var userCoupon = await userCouponService.getById(request.params.id);

        response.status(200).send(userCoupon);
    },

    async getByUserId(request: Request, response: Response) {

        var userCoupons = await userCouponService.getByUserId(request.params.userId);

        response.status(200).send(userCoupons);
    },

    async insert(request: Request, response: Response) {

        await userCouponService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await userCouponService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await userCouponService.delete(request, response);
    },
}
