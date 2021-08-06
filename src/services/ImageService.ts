import util from "util";
const multer = require("multer");
import { GridFsStorage } from "../../packages-temp/multer-gridfs-storage";
import crypt from "crypto";
import path from "path";

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
var uploadFilesMiddleware = util.promisify(upload);
module.exports = uploadFilesMiddleware;