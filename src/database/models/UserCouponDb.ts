import { model, Schema, Document } from 'mongoose';
import { UserCoupon } from '../../models/UserCoupon';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    userId: { required: true, type: String },
    couponId: { required: true, type: String },
    isUsed: { required: false, type: Boolean },
    registerDate: { required: false, type: Date },
});

interface IUserCoupon extends UserCoupon {}

const UserCouponDb = model<IUserCoupon & Document>('UserCoupon', schema);

export default UserCouponDb;
