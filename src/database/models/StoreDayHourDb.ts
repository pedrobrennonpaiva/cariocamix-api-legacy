import { model, Schema, Document } from 'mongoose';
import { StoreDayHour } from '../../models/StoreDayHour';

var schema = new Schema({
    id: { required: false, type: String, unique: true },
    storeId: { required: true, type: String },
    dayOfWeek: { required: true, type: Number },
    hourOpen: { required: true, type: String },
    hourClose: { required: true, type: String },
    registerDate: { required: false, type: Date },
});

interface IStoreDayHour extends StoreDayHour {}

const StoreDayHourDb = model<IStoreDayHour & Document>('StoreDayHour', schema);

export default StoreDayHourDb;
