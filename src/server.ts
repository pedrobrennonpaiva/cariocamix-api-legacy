import cors = require('cors');
import express = require('express');
import https from "https";
import fs from 'fs';
import dotenv from 'dotenv';

import routes from './routes/routes';

import userRouter from './routes/userRouter';
import adminRouter from './routes/adminRouter';
import imageRouter from './routes/imageRouter';
import itemRouter from './routes/itemRouter';
import couponRouter from './routes/couponRouter';
import paymentTypeRouter from './routes/paymentTypeRouter';
import storeRouter from './routes/storeRouter';
import addressStoreRouter from './routes/addressStoreRouter';
import deliveryTaxRouter from './routes/deliveryTaxRouter';
import productItemRouter from './routes/productItemRouter';
import categoryProductRouter from './routes/categoryProductRouter';
import categoryRouter from './routes/categoryRouter';
import productRouter from './routes/productRouter';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/image', imageRouter);
app.use('/item', itemRouter);
app.use('/coupon', couponRouter);
app.use('/paymentType', paymentTypeRouter);
app.use('/store', storeRouter);
app.use('/addressStore', addressStoreRouter);
app.use('/deliveryTax', deliveryTaxRouter);
app.use('/item', itemRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use('/categoryProduct', categoryProductRouter);
app.use('/productItem', productItemRouter);

app.listen(port);

if(process.env.NODE_ENV === 'development')
{
    const key = fs.readFileSync('./key.pem');
    const cert = fs.readFileSync('./cert.pem');
    const server = https.createServer({key: key, cert: cert }, app);
    server.listen(5001, () => { console.log('Servidor HTTPS: 5001') });
}

console.log('Servidor iniciado na porta: ' + port);