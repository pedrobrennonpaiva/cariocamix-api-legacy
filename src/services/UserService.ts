import { Request, Response } from "express";
import { User } from "../models/User";

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

import db from '../database/db';
import ExtensionMethod from "../utils/ExtensionMethods";
import Message from "../utils/Message";
import StringRandom from "../utils/StringRandom";
import { EmailService } from "./EmailService";
import { EmailHtml } from "../utils/EmailHtml";
const UserDb = db.User;

export class UserService {

    async get() {

        var users = await UserDb.find();

        return ExtensionMethod.WithoutPasswords(users);
    }

    async getById(id: string) {
        
        try
        {
            var user = await UserDb.findOne({ id }) as User;

            return ExtensionMethod.WithoutPassword(user);
        }
        catch
        {
            return null;
        }
    }

    async getByName(name: string) {
        
        try
        {
            var users = await UserDb.find({"name" : name});

            return ExtensionMethod.WithoutPasswords(users);
        }
        catch
        {
            return null;
        }
    }

    async getByEmail(email: string) {
        
        try
        {
            var users = await UserDb.find({"email" : email});

            return ExtensionMethod.WithoutPasswords(users);
        }
        catch
        {
            return null;
        }
    }

    async getByUsername(username: string) {
        
        try
        {
            var users = await UserDb.find({ username });

            return ExtensionMethod.WithoutPasswords(users);
        }
        catch
        {
            return null;
        }
    }

    async getBySearch(search: string) {
        
        try
        {
            var users = await UserDb.find({
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
              });

            return ExtensionMethod.WithoutPasswords(users);
        }
        catch
        {
            return null;
        }
    }

    async login(request: Request, response: Response) {

        var username = request.body.username;
        var password = request.body.password;

        var user = await UserDb.findOne({ username });

        if(!user)
        {
            user = await UserDb.findOne({ 'email' : username });
        }

        if (user && bcrypt.compareSync(password, user.password)) {

            var data = new Date();
            var tokenExpires = new Date(data.valueOf() - (data.getTimezoneOffset() * 60000));
            tokenExpires.setDate(tokenExpires.getDate() + 7);

            const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '7d' });
            
            return response.json({
                ...ExtensionMethod.WithoutPassword(user.toJSON()),
                token,
                tokenExpires
            });
        }
        
        response.status(400).send({message: 'Login inválido!'});
    }

    async resetPassword(request: Request, response: Response) {
        
        var id = request.params.id;
        var newPassword = request.params.newPassword;

        var user = await UserDb.findOne({ id }) as User;

        if(user == null)
        {
            response.status(400).send({ 
                success: false, 
                message: 'Usuário não encontrado',
            });
        }

        user.password = bcrypt.hashSync(newPassword, 8);

        await UserDb.findOneAndUpdate(
            { id: request.params.id }, 
            user, 
            { new: true }, 
            ((err: any, user: any) => {
            if(err)
            {
                response.status(400).send({ 
                    success: false, 
                    message: Message.UPDATE_ERROR,
                    error: err
                });
            }

            EmailService.sendEmail(
                user.email, 
                Message.UPDATE_SUCCESS('Senha', true),
                EmailHtml.resetPasswordUser(user.name)
            );

            response.status(200).send({ 
                success: true, 
                message: Message.UPDATE_SUCCESS('Senha', true),
                user: ExtensionMethod.WithoutPassword(user)
            });
        }));
    }

    async insert(request: Request, response: Response) {

        var user = new User();
        user.name = request.body.name;
        user.username = request.body.username;
        user.birthday = request.body.birthday;
        user.cpf = request.body.cpf;
        user.numberPhone = request.body.numberPhone;
        user.email = request.body.email;

        var randomPass = StringRandom.randomPassword(8);
        user.password = request.body.password ? bcrypt.hashSync(request.body.password, 8) :
                            bcrypt.hashSync(randomPass, 8);

        if(!this.getByEmail(user.email) || !this.getByUsername(user.username))
        {
            response.status(400).send({ 
                success: false, 
                message: 'Já existe um usuário com este e-mail ou username!',
            });
        }

        const db = new UserDb(user);
        
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
                    user.email, 
                    Message.CREATE_SUCCESS('Usuário'),
                    EmailHtml.insertUser(
                        user.name, 
                        user.email, 
                        request.body.password ? null : randomPass
                    )
                );

                response.status(201).send({ 
                    success: true, 
                    message: Message.CREATE_SUCCESS("Usuário"),
                    user: ExtensionMethod.WithoutPassword(user)
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldUser = await UserDb.findOne({ id });
        
        var us = request.body as User;
        us.id = oldUser?.id;
        us.registerDate = oldUser?.registerDate!;
        us.name = us.name ?? oldUser?.name;
        us.birthday = us.birthday ?? oldUser?.birthday;
        us.cpf = us.cpf ?? oldUser?.cpf;
        us.numberPhone = us.numberPhone ?? oldUser?.numberPhone;
        us.email = us.email ?? oldUser?.email;
        us.image = oldUser?.image!;
        us.password = oldUser?.password!;

        if((us.email != oldUser?.email && !this.getByEmail(us.email)) || 
            (us.username != oldUser?.username && !this.getByUsername(us.username)))
        {
            response.status(400).send({ 
                success: false, 
                message: 'Já existe um usuário com este e-mail ou username!',
            });
        }
        
        await UserDb.findOneAndUpdate({ id: request.params.id }, us, { new: true }, ((err: any, user: any) => {
            if(err)
            {
                response.status(400).send({ 
                    success: false, 
                    message: Message.UPDATE_ERROR,
                    error: err
                });
            }

            EmailService.sendEmail(
                user.email, 
                Message.UPDATE_SUCCESS('Usuário'),
                EmailHtml.updateUser(user.name)
            );

            response.status(200).send({ 
                success: true, 
                message: Message.UPDATE_SUCCESS('Usuário'),
                user: ExtensionMethod.WithoutPassword(user)
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        UserDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('Usuário'),
            });
        });
    }
}