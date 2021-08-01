import { Base } from "./base/Base";
import { v4 as uuid } from 'uuid';
import { Category } from "./Category";
import { Product } from "./Product";

export class CategoryProduct extends Base {

    categoryId: string = uuid();

    category: Category | null = null;
    
    productId: string = uuid();

    product: Product | null = null;
}
