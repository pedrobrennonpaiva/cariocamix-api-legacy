import { Base } from "./base/Base";
import { v4 as uuid } from 'uuid';
import { Order } from "./Order";
import { Product } from "./Product";

export class OrderProduct extends Base {

    orderId: string = uuid();

    order: Order | null = null;
    
    productId: string = uuid();
    
    product: Product | null = null;
    
    obs: string;
}
