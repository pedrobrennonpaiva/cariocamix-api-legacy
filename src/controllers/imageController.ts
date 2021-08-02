import { Response } from "express";
import { GridFSBucket } from "mongodb";
import mongoose from 'mongoose';
import db, { connect } from '../database/db';
const upload = require("../services/ImageService");

export default {

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

            request.file.fileUrl = `${request.protocol}://${request.headers.host}/image/upload/browser/${request.file.filename}`;

            return response.status(201).send({ 
                success: true, 
                message: 'Imagem adicionada com sucesso!',
                image: request.file
            });
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
            if (!files![0] || files?.length === 0) {
                return response.status(404).json({
                    success: false,
                    message: 'Sem arquivos disponíveis!',
                });
            }

            response.status(200).json({
                success: true,
                file: files![0],
            });
        });

    },

    async uploadByFilenameBrowser(request: any, response: Response) {

        const connect = mongoose.createConnection(process.env.MONGODB_URI, { useNewUrlParser: true });
        let gfs: GridFSBucket;
        
        connect.once("open", () => {
            gfs = new mongoose.mongo.GridFSBucket(connect.db, {
                bucketName: "uploads"
            });

            gfs.find({ filename: request.params.filename }).toArray((err, files) => {
                if(files === undefined)
                {
                    return response.status(400).json({
                        success: false,
                        message: 'Nenhum arquivo encontrado!',
                    });
                }

                if (!files[0] || files.length === 0) {
                    return response.status(404).json({
                        success: false,
                        message: 'Sem arquivos disponíveis!',
                    });
                }

                if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                    gfs.openDownloadStreamByName(request.params.filename).pipe(response);
                } else {
                    response.status(404).json({
                        success: false,
                        message: 'Não é uma imagem!',
                    });
                }
            });
        });
    },
}
