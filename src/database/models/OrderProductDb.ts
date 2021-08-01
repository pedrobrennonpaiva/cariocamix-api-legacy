import { model, Schema, Document } from 'mongoose';
import { OrderProduct } from '../../models/OrderProduct';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    orderId: { required: true, type: String },
    productId: { required: true, type: String },
    obs: { required: false, type: String },
    registerDate: { required: false, type: Date },
});

interface IOrderProduct extends OrderProduct {}

const OrderProductDb = model<IOrderProduct & Document>('OrderProduct', schema);

export default OrderProductDb;
