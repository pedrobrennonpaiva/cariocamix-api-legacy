import { model, Schema, Document } from 'mongoose';
import { PaymentType } from '../../models/PaymentType';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    name: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface IPaymentType extends PaymentType {}

const PaymentTypeDb = model<IPaymentType & Document>('PaymentType', schema);

export default PaymentTypeDb;
