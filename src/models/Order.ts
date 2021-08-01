import { Base } from "./base/Base";
import { v4 as uuid } from 'uuid';
import { User } from "./User";
import { PaymentType } from "./PaymentType";
import { PaymentStatus } from "./PaymentStatus";
import { DeliveryTax } from "./DeliveryTax";
import { DeliveryStatus } from "./DeliveryStatus";
import { Coupon } from "./Coupon";

export class Order extends Base {

    userId: string = uuid();

    user: User | null = null;
    
    couponId: string;
    
    coupon: Coupon | null = null;
    
    total: number;
    
    paymentTypeId: string = uuid();
    
    paymentType: PaymentType | null = null;
    
    paymentStatusId: string;
    
    paymentStatus: PaymentStatus | null = null;
    
    deliveryStatusId: string;
    
    deliveryStatus: DeliveryStatus | null = null;
    
    deliveryTaxId: string = uuid();
    
    deliveryTax: DeliveryTax | null = null;
}
