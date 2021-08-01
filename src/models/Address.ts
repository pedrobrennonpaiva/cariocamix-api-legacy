import { Base } from "./base/Base";
import { v4 as uuid } from 'uuid';
import { User } from "./User";

export class Address extends Base {

    userId: string = uuid();

    user: User | null = null;

    cep: string;
    
    addressText: string;
    
    complement: string;
    
    neighborhood: string;
    
    city: string;

    state: string;

    country: string;
}
