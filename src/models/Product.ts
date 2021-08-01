import { Base } from "./base/Base";
import { CategoryProduct } from "./CategoryProduct";
import { ProductItem } from "./ProductItem";

export class Product extends Base {

    title: string;
    
    description: string;
    
    image: string;
    
    price: number;

    points: number;

    isOneItem: boolean;

    categoryProductsId: string[] | null = null;

    categoryProducts: CategoryProduct[] | null = null;

    productItemsId: string[] | null = null;

    productItems: ProductItem[] | null = null;
}
