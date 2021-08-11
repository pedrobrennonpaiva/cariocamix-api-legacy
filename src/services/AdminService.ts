import { Request, Response } from "express";
import { Admin } from "../models/Admin";

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

import db from '../database/db';
import ExtensionMethod from "../utils/ExtensionMethods";
import Message from "../utils/Message";
import { Store } from "../models/Store";
import { EmailService } from "./EmailService";
import { EmailHtml } from "../utils/EmailHtml";
import StringRandom from "../utils/StringRandom";
const AdminDb = db.Admin;
const StoreDb = db.Store;

export class AdminService {

    async get() {

        var admins = await AdminDb.find().lean();

        for(var admin of admins)
        {
            admin.store = admin.storeId ? await StoreDb.findOne({ id: admin?.storeId}) : null;
        }

        return ExtensionMethod.WithoutPasswordsAdmin(admins);
    }

    async getById(id: string) {
        
        try
        {
            var admin = await AdminDb.findOne({ id }).lean() as Admin;

            admin!.store = admin.storeId ? await StoreDb.findOne({ id: admin?.storeId}) : null;

            return ExtensionMethod.WithoutPasswordAdmin(admin);
        }
        catch
        {
            return null;
        }
    }

    async getByEmail(email: string) {
        
        try
        {
            var admins = await AdminDb.find({"email" : email});

            return ExtensionMethod.WithoutPasswordsAdmin(admins);
        }
        catch
        {
            return null;
        }
    }

    async getByUsername(username: string) {
        
        try
        {
            var admins = await AdminDb.find({ username });

            return ExtensionMethod.WithoutPasswordsAdmin(admins);
        }
        catch
        {
            return null;
        }
    }

    async getByName(name: string) {
        
        try
        {
            var admins = await AdminDb.find({"name" : name}).lean();

            for(var admin of admins)
            {
                admin.store = admin.storeId ? await StoreDb.findOne({ id: admin?.storeId}) : null;
            }

            return ExtensionMethod.WithoutPasswordsAdmin(admins);
        }
        catch
        {
            return null;
        }
    }

    async getBySearch(search: string) {
        
        try
        {
            var admins = await AdminDb.find({
                $or: [
                    {
                    name: {$regex : search}
                    },
                    {
                    email: {$regex : search}
                    },
                    {
                    username: {$regex : search}
                    }
                ]
            }).lean();

            for(var admin of admins)
            {
                admin.store = admin.storeId ? await StoreDb.findOne({ id: admin?.storeId}) : null;
            }

            return ExtensionMethod.WithoutPasswordsAdmin(admins);
        }
        catch
        {
            return null;
        }
    }

    async login(request: Request, response: Response) {

        var username = request.body.username;
        var password = request.body.password;

        var admin = await AdminDb.findOne({ username }).lean();

        if(!admin)
        {
            admin = await AdminDb.findOne({ 'email' : username }).lean();
        }

        if (admin && bcrypt.compareSync(password, admin.password)) {

            var data = new Date();
            var tokenExpires = new Date(data.valueOf() - (data.getTimezoneOffset() * 60000));
            tokenExpires.setDate(tokenExpires.getDate() + 7);

            const token = jwt.sign({ sub: admin.id }, process.env.SECRET, { expiresIn: '7d' });

            admin.store = admin?.storeId ? await StoreDb.findOne({ id: admin?.storeId }) : null;
            
            return response.json({
                ...ExtensionMethod.WithoutPasswordAdmin(admin),
                token,
                tokenExpires
            });
        }
        
        response.status(400).json({message: 'Login inválido!'});
          
    }

    async resetPassword(request: Request, response: Response) {
        
        var id = request.params.id;
        var newPassword = request.params.newPassword;

        var admin = await AdminDb.findOne({ id }) as Admin;

        if(admin == null)
        {
            response.status(400).send({ 
                success: false, 
                message: 'Admin não encontrado',
            });
        }

        admin.password = bcrypt.hashSync(newPassword, 8);

        await AdminDb.findOneAndUpdate(
            { id: request.params.id }, 
            admin, 
            { new: true }, 
            (async (err: any, admin: any) => {
            if(err)
            {
                response.status(400).send({ 
                    success: false, 
                    message: Message.UPDATE_ERROR,
                    error: err
                });
            }

            admin.store = admin?.storeId ? await StoreDb.findOne({ id: admin?.storeId }) : null;

            EmailService.sendEmail(
                admin.email, 
                Message.UPDATE_SUCCESS('Senha', true),
                EmailHtml.resetPasswordUser(admin.name)
            );

            response.status(200).send({ 
                success: true, 
                message: Message.UPDATE_SUCCESS('Senha', true),
                admin: ExtensionMethod.WithoutPasswordAdmin(admin)
            });
        }));
    }

    async insert(request: Request, response: Response) {

        var admin = new Admin();
        admin.name = request.body.name;
        admin.username = request.body.username;
        admin.birthday = request.body.birthday;
        admin.numberPhone = request.body.numberPhone;
        admin.email = request.body.email;
        admin.isActive = request.body.isActive ?? true;
        admin.isRoot = request.body.isRoot;
        admin.storeId = request.body.storeId;
        
        var randomPass = StringRandom.randomPassword(8);
        admin.password = request.body.password ? bcrypt.hashSync(request.body.password, 8) :
                            bcrypt.hashSync(randomPass, 8);

        var emailExist = await this.getByEmail(admin.email);
        var usernameExist = await this.getByUsername(admin.username);
        
        if((emailExist && emailExist.length > 0) || (usernameExist && usernameExist.length > 0))
        {
            response.status(400).send({ 
                success: false, 
                message: 'Já existe um admin com este e-mail ou username!',
            });
        }
        
        var store = new Store();

        if(admin.storeId)
        {
            store = await StoreDb.findOne({ id: admin.storeId }) as Store;

            if(!store)
            {
                response.status(400).send({ 
                    success: false, 
                    message: `
                        ${!store ? 'Loja não existe! ' : ''}
                    `
                });
                return;
            }
        }

        const db = new AdminDb(admin);
        
        db.save((err: any) => {
            if (err) {
                console.log(err);
                response.status(400).send({ 
                    success: false, 
                    message: Message.CREATE_ERROR,
                    error: err
                });
            }
            else {

                EmailService.sendEmail(
                    admin.email, 
                    Message.CREATE_SUCCESS('Admin'),
                    EmailHtml.insertUser(
                        admin.name, 
                        admin.email, 
                        request.body.password ? null : randomPass
                    )
                );

                admin.store = store;
                response.status(201).send({ 
                    success: true, 
                    message: Message.CREATE_SUCCESS('Admin'),
                    admin: ExtensionMethod.WithoutPasswordAdmin(admin)
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldAdmin = await AdminDb.findOne({ id });
        
        var us = request.body as Admin;
        us.id = oldAdmin?.id;
        us.registerDate = oldAdmin?.registerDate!;
        us.name = us.name ?? oldAdmin?.name;
        us.birthday = us.birthday ?? oldAdmin?.birthday;
        us.numberPhone = us.numberPhone ?? oldAdmin?.numberPhone;
        us.email = us.email ?? oldAdmin?.email;
        us.isActive = us.isActive ?? oldAdmin?.isActive;
        us.isRoot = us.isRoot ?? oldAdmin?.isRoot;
        us.image = oldAdmin?.image!;
        us.password = oldAdmin?.password!;
        
        var emailExist = await this.getByEmail(us.email);
        var usernameExist = await this.getByUsername(us.username);
        
        if((us.email != oldAdmin?.email && emailExist && emailExist.length > 0) || 
           (us.username != oldAdmin?.username && usernameExist && usernameExist.length > 0))
        {
            response.status(400).send({ 
                success: false, 
                message: 'Já existe um admin com este e-mail ou username!',
            });
        }

        var store = new Store();

        if(us.storeId && us.storeId !== oldAdmin?.storeId)
        {
            store = await StoreDb.findOne({ id: oldAdmin?.storeId }) as Store;

            if(!store)
            {
                response.status(400).send({ 
                    success: false, 
                    message: `
                        ${!store ? 'Loja não existe! ' : ''}
                    `
                });
                return;
            }
        }
        
        await AdminDb.findOneAndUpdate({ id: request.params.id }, us, { new: true }, ((err: any, admin: any) => {
            if(err)
            {
                response.status(400).send({ 
                    success: false, 
                    message: Message.UPDATE_ERROR,
                    error: err
                });
            }

            admin.store = store;

            EmailService.sendEmail(
                admin.email, 
                Message.UPDATE_SUCCESS('Admin'),
                EmailHtml.updateUser(admin.name)
            );

            response.status(200).send({ 
                success: true, 
                message: Message.UPDATE_SUCCESS('Admin'),
                admin: ExtensionMethod.WithoutPasswordAdmin(admin)
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        AdminDb.remove({ id }, (err: any) => {
            if(err)
            {
                response.status(400).send({ 
                    success: false, 
                    message: Message.DELETE_ERROR,
                    error: err
                });
            }

            response.status(200).send({ 
                success: true, 
                message: Message.DELETE_SUCCESS('Admin')
            });
        });
    }
}