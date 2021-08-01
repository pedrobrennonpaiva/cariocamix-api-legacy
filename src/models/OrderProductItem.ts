import { Base } from "./base/Base";
import { v4 as uuid } from 'uuid';
import { OrderProduct } from "./OrderProduct";
import { ProductItem } from "./ProductItem";

export class OrderProductItem extends Base {

    orderProductId: string = uuid();

    orderProduct: OrderProduct | null = null;
    
    productItemId: string = uuid();

    productItem: ProductItem | null = null;
}
