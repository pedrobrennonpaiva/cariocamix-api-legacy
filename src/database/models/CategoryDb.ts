import { model, Schema, Document } from 'mongoose';
import { Category } from '../../models/Category';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    title: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface ICategory extends Category {}

const CategoryDb = model<ICategory & Document>('Category', schema);

export default CategoryDb;
