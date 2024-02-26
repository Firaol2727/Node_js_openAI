import multer from "multer";
import moment from "moment"; 
let storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "uploads/images");
    },
    filename: (request, file, callback) => {
        callback(null, getFilename(file));
    }
});
let getFilename = (file) => {
    return `${moment().unix()}-${file.originalname}`;
};
const MimeTypes = [ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
'application/vnd.ms-excel'];
let upload = multer({
    storage: storage,
    fileFilter: (request, file, callback) => {
        // logger.info({
        //     operation: "Uploading Image",
        //     filename: file.filename,
        //     filesize: file.size,
        //     mimetype: file.mimetype, 
        // });
        if (MimeTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new BadRequestError([
               { field: "images", message: Messages.IMAGE_INVALID_TYPE } 
            ]));
        }
    }
});
export default upload;
