import { model, Schema, Document } from 'mongoose';
import { Coupon } from '../../models/Coupon';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    code: { required: true, type: String },
    isActive: { required: true, type: Boolean },
    percentage: { required: false, type: Number },
    price: { required: false, type: Number },
    registerDate: { required: false, type: Date },
});

interface ICoupon extends Coupon {}

const CouponDb = model<ICoupon & Document>('Coupon', schema);

export default CouponDb;
