import { Request, Response } from "express";
import { CouponService } from "../services/CouponService";

var couponService = new CouponService();

export default {

    async get(_: Request, response: Response) {

        var coupons = await couponService.get();

        response.status(200).send(coupons);
    },

    async getById(request: Request, response: Response) {

        var coupon = await couponService.getById(request.params.id);

        response.status(200).send(coupon);
    },

    async getByCode(request: Request, response: Response) {

        var coupons = await couponService.getByCode(request.params.code);

        response.status(200).send(coupons);
    },

    async insert(request: Request, response: Response) {

        await couponService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await couponService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await couponService.delete(request, response);
    },
}
