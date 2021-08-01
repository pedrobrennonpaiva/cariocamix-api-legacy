import { model, Schema, Document } from 'mongoose';
import { Address } from '../../models/Address';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    userId: { required: true, type: String },
    cep: { required: true, type: String },
    addressText: { required: true, type: String },
    complement: { required: false, type: String },
    neighborhood: { required: true, type: String },
    city: { required: true, type: String },
    state: { required: true, type: String },
    country: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface IAddress extends Address {}

const AddressDb = model<IAddress & Document>('Address', schema);

export default AddressDb;
