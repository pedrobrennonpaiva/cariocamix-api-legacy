import { model, Schema, Document } from 'mongoose';
import { PaymentStatus } from '../../models/PaymentStatus';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    name: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface IPaymentStatus extends PaymentStatus {}

const PaymentStatusDb = model<IPaymentStatus & Document>('PaymentStatus', schema);

export default PaymentStatusDb;
