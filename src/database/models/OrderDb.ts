import { model, Schema, Document } from 'mongoose';
import { Order } from '../../models/Order';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    userId: { required: true, type: String },
    couponId: { required: false, type: String },
    total: { required: true, type: Number },
    paymentTypeId: { required: true, type: String },
    paymentStatusId: { required: false, type: String },
    deliveryStatusId: { required: false, type: String },
    deliveryTaxId: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface IOrder extends Order {}

const OrderDb = model<IOrder & Document>('Order', schema);

export default OrderDb;
