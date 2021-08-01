import { Base } from "./base/Base";
import { Store } from "./Store";

export class Admin extends Base {

    name: string;

    username: string;

    birthday: Date;

    numberPhone: string;

    email: string;

    password: string | null;

    image: string;

    isActive: boolean;
    
    isRoot: boolean;

    storeId: string | null;

    store: Store | null;
}
