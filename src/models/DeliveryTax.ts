import { Base } from "./base/Base";
import { v4 as uuid } from 'uuid';
import { Store } from "./Store";

export class DeliveryTax extends Base {

    storeId: string = uuid();

    store: Store | null = null;
    
    radius: number;
    
    price: number;
}
