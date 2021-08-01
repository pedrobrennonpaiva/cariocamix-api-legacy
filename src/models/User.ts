import { Base } from "./base/Base";

export class User extends Base {

    name: string;

    username: string;

    birthday: Date;
    
    cpf: string;
    
    email: string;
    
    password: string | null;
    
    numberPhone: string;

    points: number;

    image: string;
}
