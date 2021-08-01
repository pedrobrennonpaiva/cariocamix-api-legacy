import { model, Schema, Document } from 'mongoose';
import { DeliveryTax } from '../../models/DeliveryTax';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    storeId: { required: true, type: String },
    radius: { required: true, type: Number },
    price: { required: true, type: Number },
    registerDate: { required: false, type: Date },
});

interface IDeliveryTax extends DeliveryTax {}

const DeliveryTaxDb = model<IDeliveryTax & Document>('DeliveryTax', schema);

export default DeliveryTaxDb;
