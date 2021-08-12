import { model, Schema, Document } from 'mongoose';
import { Product } from '../../models/Product';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    title: { required: true, type: String },
    description: { required: false, type: String },
    image: { required: false, type: String },
    price: { required: true, type: Number },
    points: { required: false, type: Number },
    isOneItem: { required: false, type: Boolean },
    registerDate: { required: false, type: Date },
});

interface IProduct extends Product {}

const ProductDb = model<IProduct & Document>('Product', schema);

export default ProductDb;
