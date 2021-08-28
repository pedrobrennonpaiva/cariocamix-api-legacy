import { Request, Response } from "express";
import { Address } from "../models/Address";
import db from '../database/db';
import Message from "../utils/Message";
import ExtensionMethod from "../utils/ExtensionMethods";
import { User } from "../models/User";
const AddressDb = db.Address;
const UserDb = db.User;

export class AddressService {

    async get() {

        var models = await AddressDb.find().lean();

        for(var model of models)
        {
            var user = await UserDb.findOne({ id: model?.userId }) as User;
            model.user = ExtensionMethod.WithoutPassword(user);
        }

        return models;
    }

    async getById(id: string) {
        
        try
        {
            var model = await AddressDb.findOne({ id }).lean();

            var user = await UserDb.findOne({ id: model?.userId }) as User;
            model!.user = ExtensionMethod.WithoutPassword(user);

            return model;
        }
        catch
        {
            return null;
        }
    }

    async getByUserId(userId: string) {
        
        try
        {
            var models = await AddressDb.find({ userId: userId }).lean();

            var user = await UserDb.findOne({ id: userId }) as User;
            user = ExtensionMethod.WithoutPassword(user);

            for(var model of models)
            {
                model.user = user;
            }

            return models;
        }
        catch
        {
            return null;
        }
    }

    async insert(request: Request, response: Response) {

        var model = new Address();
        model.userId = request.body.userId;
        model.cep = request.body.cep;
        model.addressText = request.body.addressText;
        model.complement = request.body.complement;
        model.neighborhood = request.body.neighborhood;
        model.city = request.body.city;
        model.state = request.body.state;
        model.country = request.body.country;

        var user = await UserDb.findOne({ id: model.userId });

        if(!user)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!user ? 'Usuário não existe! ' : ''}
                `
            });
            return;
        }

        const db = new AddressDb(model);
        
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
                response.status(201).send({ 
                    success: true, 
                    message: Message.CREATE_SUCCESS('Endereço'),
                    data: model
                });
            }
        });
    }

    async update(request: Request, response: Response) {

        var id = request.params.id;

        var oldAddress = await AddressDb.findOne({ id });
        
        var model = request.body as Address;
        model.id = oldAddress?.id;
        model.registerDate = oldAddress?.registerDate!;
        model.userId = model.userId ?? oldAddress?.userId;
        model.cep = model.cep ?? oldAddress?.cep;
        model.addressText = model.addressText ?? oldAddress?.addressText;
        model.neighborhood = model.neighborhood ?? oldAddress?.neighborhood;
        model.city = model.city ?? oldAddress?.city;
        model.state = model.state ?? oldAddress?.state;
        model.country = model.country ?? oldAddress?.country;

        var user = await UserDb.findOne({ id: model.userId });
        
        if(!user)
        {
            response.status(400).send({ 
                success: false, 
                message: `
                    ${!user ? 'Usuário não existe! ' : ''}
                `
            });
            return;
        }
        
        await AddressDb.findOneAndUpdate({ id }, model, { new: true }, ((err: any, result: any) => {
            if(err)
            {
                response.status(400).send({ 
                    success: false, 
                    message: Message.UPDATE_ERROR,
                    error: err
                });
            }

            response.status(200).send({ 
                success: true, 
                message: Message.UPDATE_SUCCESS('Endereço'),
                data: result
            });
        }));
    }

    async delete(request: Request, response: Response) {

        var id = request.params.id;
        
        AddressDb.remove({ id }, (err: any) => {
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
                message: Message.DELETE_SUCCESS('Endereço')
            });
        });
    }
}