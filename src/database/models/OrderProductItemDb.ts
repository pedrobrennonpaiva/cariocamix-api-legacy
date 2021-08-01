import { model, Schema, Document } from 'mongoose';
import { OrderProductItem } from '../../models/OrderProductItem';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    orderProductId: { required: true, type: String },
    productItemId: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface IOrderProductItem extends OrderProductItem {}

const OrderProductItemDb = model<IOrderProductItem & Document>('OrderProductItem', schema);

export default OrderProductItemDb;
