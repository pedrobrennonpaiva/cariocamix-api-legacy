import { Base } from "./base/Base";
import { v4 as uuid } from 'uuid';
import { Store } from "./Store";

export class AddressStore extends Base {

    storeId: string = uuid();

    store: Store | null = null;

    cep: string;
    
    addressText: string;
    
    complement: string;
    
    neighborhood: string;
    
    city: string;

    state: string;

    country: string;
}
