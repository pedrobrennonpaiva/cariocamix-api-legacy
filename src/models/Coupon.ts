import { Base } from "./base/Base";

export class Coupon extends Base {

    code: string;

    isActive: boolean;

    percentage: number;

    price: number;
}
