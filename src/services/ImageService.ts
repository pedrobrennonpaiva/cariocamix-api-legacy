import util from "util";
const multer = require("multer");
import { GridFsStorage } from "../../packages-temp/multer-gridfs-storage";
import { GridFSBucket } from "mongodb";
import mongoose from 'mongoose';

var storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req: any, file: any) => {
    console.log(file);
    var filename = `${Date.now()}-cariocamix-${file.originalname}`;

    return {
        bucketName: "uploads",
        filename,
        fileUrl: `${req.protocol}://${req.headers.host}/user/upload/browser/${filename}`
    };
    // return new Promise((resolve, reject) => {
    //     crypt.randomBytes(16, (err: any, buf: any) => {
    //       if (err) {
    //         return reject(err);
    //       }
    //       const filename = buf.toString("hex") + path.extname(file.originalname);
    //       const fileInfo = {
    //         filename: filename,
    //         bucketName: "uploads"
    //       };
    //       resolve(fileInfo);
    //     });
    //   });
  }
});

var upload = multer({ storage }).single("file");
export var uploadFilesMiddleware = util.promisify(upload);

export class ImageService {

  async delete(filename: string) {

    const connect = mongoose.createConnection(process.env.MONGODB_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    let gfs: GridFSBucket;

    return new Promise((resolve, reject) => {
        connect.once("open", async () => {
          gfs = new mongoose.mongo.GridFSBucket(connect.db, {
              bucketName: "uploads"
          });

          const images = await gfs.find({ filename: filename }).toArray();

          if (images.length === 0) {
            reject('Arquivo não encontrado');
          }
          else
          {
            Promise.all(
              images.map((img) => {
                return gfs.delete(img._id);
              })
            );
            resolve('');
          }
      });
    });
  }
}