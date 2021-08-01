import { model, Schema, Document } from 'mongoose';
import { User } from '../../models/User';

var userSchema = new Schema({
    id: { required: false, type: String, unique: true },
    name: { required: true, type: String },
    username: { required: false, type: String, unique: true },
    birthday: { required: true, type: Date },
    cpf: { required: true, type: String, unique: true },
    numberPhone: { required: true, type: String},
    image: { required: false, type: String},
    points: { required: false, type: Number },
    email: { required: true, type: String, unique: true },
    password: { required: true, type: String },
    registerDate: { required: false, type: Date }
});

interface IUser extends User {}

const UserDb = model<IUser & Document>('User', userSchema);

export default UserDb;
