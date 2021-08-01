import { Base } from "./base/Base";
import { v4 as uuid } from 'uuid';
import { Product } from "./Product";
import { Item } from "./Item";

export class ProductItem extends Base {

    productId: string = uuid();

    product: Product | null = null;
    
    itemId: string = uuid();

    item: Item | null = null;
    
    isDefault: boolean;
    
    price: number;
}
