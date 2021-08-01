import { Request, Response } from "express";
import { UserService } from "../services/UserService";

var userService = new UserService();

const upload = require("../services/ImageService");
import mongoose from 'mongoose';
import { GridFSBucket } from "mongodb";

import db from '../database/db';

export default {

    async get(_: Request, response: Response) {

        var users = await userService.get();

        response.status(200).send(users);
    },

    async getById(request: Request, response: Response) {

        var user = await userService.getById(request.params.id);

        response.status(200).send(user);
    },

    async getByName(request: Request, response: Response) {

        var users = await userService.getByName(request.params.name);

        response.status(200).send(users);
    },

    async getBySearch(request: Request, response: Response) {

        var users = await userService.getBySearch(request.params.search);

        response.status(200).send(users);
    },

    async login(request: Request, response: Response) {

        await userService.login(request, response);
    },

    async resetPassword(request: Request, response: Response) {

        await userService.resetPassword(request, response);
    },

    async insert(request: Request, response: Response) {

        await userService.insert(request, response);
    },

    async udpate(request: Request, response: Response) {

        await userService.update(request, response);
    },

    async delete(request: Request, response: Response) {

        await userService.delete(request, response);
    },

    async upload(request: any, response: Response) {

        try {
            await upload(request, response);
            
            console.log(request.file);
            if (request.file === undefined) {
                return response.send({ 
                    success: false, 
                    message: 'Você precisa selecionar uma imagem!',
                });
            }

            request.file.fileUrl = `${request.protocol}://${request.headers.host}/user/upload/browser/${request.file.filename}`;

            return response.status(201).send(request.file);
        } 
        catch (error) {
            console.log(error);
            return response.status(400).send({ 
                success: false, 
                message: 'Ocorreu um erro ao inserir a imagem!',
                error: error
            });
        }
    },

    async uploadByFilename(request: any, response: Response) {

        let gfs;
        
        gfs = new mongoose.mongo.GridFSBucket(db.connect.db, {
            bucketName: "uploads"
        });

        gfs.find({ filename: request.params.filename }).toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return response.status(200).json({
                    success: false,
                    message: 'No files available',
                });
            }

            response.status(200).json({
                success: true,
                file: files[0],
            });
        });

    },

    async uploadByFilenameBrowser(request: any, response: Response) {

        const connect = mongoose.createConnection("mongodb+srv://sermilitar-api:nxsBRCC8LQN1RuN9@cluster-sermilitar.toi1o.mongodb.net/serMilitar?retryWrites=true&w=majority", 
            { useNewUrlParser: true, useUnifiedTopology: true 
        });
        let gfs: GridFSBucket;
        
        connect.once("open", () => {
            gfs = new mongoose.mongo.GridFSBucket(connect.db, {
                bucketName: "uploads"
            });

            gfs.find({ filename: request.params.filename }).toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return response.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }

                if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                    gfs.openDownloadStreamByName(request.params.filename).pipe(response);
                } else {
                    response.status(404).json({
                        err: 'Not an image',
                    });
                }
            });
        });
    },
}
