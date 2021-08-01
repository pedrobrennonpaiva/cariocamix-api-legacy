import { Base } from "./base/Base";
import { v4 as uuid } from 'uuid';
import { User } from "./User";
import { Coupon } from "./Coupon";

export class UserCoupon extends Base {

    userId: string = uuid();

    user: User | null = null;
    
    couponId: string = uuid();
    
    coupon: Coupon | null = null;
}
