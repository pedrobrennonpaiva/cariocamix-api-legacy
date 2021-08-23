import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Banco conectado');
});

export const connect = mongoose.createConnection(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

import UserDb from './models/UserDb';
import AdminDb from './models/AdminDb';
import AddressDb from './models/AddressDb';
import AddressStoreDb from './models/AddressStoreDb';
import CategoryDb from './models/CategoryDb';
import CategoryProductDb from './models/CategoryProductDb';
import CouponDb from './models/CouponDb';
import DeliveryStatusDb from './models/DeliveryStatusDb';
import DeliveryTaxDb from './models/DeliveryTaxDb';
import ItemDb from './models/ItemDb';
import OrderDb from './models/OrderDb';
import OrderProductDb from './models/OrderProductDb';
import OrderProductItemDb from './models/OrderProductItemDb';
import PaymentStatusDb from './models/PaymentStatusDb';
import PaymentTypeDb from './models/PaymentTypeDb';
import ProductDb from './models/ProductDb';
import ProductItemDb from './models/ProductItemDb';
import StoreDb from './models/StoreDb';
import StoreDayHourDb from './models/StoreDayHourDb';
import UserCouponDb from './models/UserCouponDb';

var db = {
    connect,
    User: UserDb,
    Admin: AdminDb,
    Address: AddressDb,
    AddressStore: AddressStoreDb,
    Category: CategoryDb,
    CategoryProduct: CategoryProductDb,
    Coupon: CouponDb,
    DeliveryStatus: DeliveryStatusDb,
    DeliveryTax: DeliveryTaxDb,
    Item: ItemDb,
    Order: OrderDb,
    OrderProduct: OrderProductDb,
    OrderProductItem: OrderProductItemDb,
    PaymentStatus: PaymentStatusDb,
    PaymentType: PaymentTypeDb,
    Product: ProductDb,
    ProductItem: ProductItemDb,
    Store: StoreDb,
    StoreDayHour: StoreDayHourDb,
    UserCoupon: UserCouponDb,
};

export default db;
