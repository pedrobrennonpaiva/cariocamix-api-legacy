import { model, Schema, Document } from 'mongoose';
import { Item } from '../../models/Item';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    title: { required: true, type: String },
    price: { required: true, type: Number },
    registerDate: { required: false, type: Date },
});

interface IItem extends Item {}

const ItemDb = model<IItem & Document>('Item', schema);

export default ItemDb;
