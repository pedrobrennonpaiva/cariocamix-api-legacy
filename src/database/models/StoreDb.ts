import { model, Schema, Document } from 'mongoose';
import { Store } from '../../models/Store';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    name: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface IStore extends Store {}

const StoreDb = model<IStore & Document>('Store', schema);

export default StoreDb;
