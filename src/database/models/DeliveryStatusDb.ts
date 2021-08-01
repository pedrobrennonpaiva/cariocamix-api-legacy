import { model, Schema, Document } from 'mongoose';
import { DeliveryStatus } from '../../models/DeliveryStatus';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    name: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface IDeliveryStatus extends DeliveryStatus {}

const DeliveryStatusDb = model<IDeliveryStatus & Document>('DeliveryStatus', schema);

export default DeliveryStatusDb;
