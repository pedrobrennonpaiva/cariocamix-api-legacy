import { model, Schema, Document } from 'mongoose';
import { CategoryProduct } from '../../models/CategoryProduct';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    categoryId: { required: true, type: String },
    productId: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface ICategoryProduct extends CategoryProduct {}

const CategoryProductDb = model<ICategoryProduct & Document>('CategoryProduct', schema);

export default CategoryProductDb;
