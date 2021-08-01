import { model, Schema, Document } from 'mongoose';
import { AddressStore } from '../../models/AddressStore';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    storeId: { required: true, type: String },
    cep: { required: true, type: String },
    addressText: { required: true, type: String },
    complement: { required: false, type: String },
    neighborhood: { required: true, type: String },
    city: { required: true, type: String },
    state: { required: true, type: String },
    country: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface IAddressStore extends AddressStore {}

const AddressStoreDb = model<IAddressStore & Document>('AddressStore', schema);

export default AddressStoreDb;
