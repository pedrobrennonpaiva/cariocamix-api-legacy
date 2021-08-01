import { model, Schema, Document } from 'mongoose';
import { Admin } from '../../models/Admin';

var adminSchema = new Schema({
    id: { required: false, type: String, unique: true },
    name: { required: true, type: String },
    username: { required: false, type: String, unique: true },
    birthday: { required: false, type: Date },
    numberPhone: { required: false, type: String },
    email: { required: true, type: String, unique: true },
    password: { required: true, type: String },
    image: { required: false, type: String },
    registerDate: { required: false, type: Date },
    isActive: { required: false, type: Boolean },
    isRoot: { required: false, type: Boolean },
    storeId: { required: false, type: String },
});

interface IAdmin extends Admin {}

const AdminDb = model<IAdmin & Document>('Admin', adminSchema);

export default AdminDb;
