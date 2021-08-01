import { model, Schema, Document } from 'mongoose';
import { ProductItem } from '../../models/ProductItem';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    productId: { required: true, type: String },
    itemId: { required: true, type: String },
    isDefault: { required: true, type: Boolean },
    price: { required: true, type: Number },
    registerDate: { required: false, type: Date },
});

interface IProductItem extends ProductItem {}

const ProductItemDb = model<IProductItem & Document>('ProductItem', schema);

export default ProductItemDb;
