import multer from "multer";
import getValues from "../env";


const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, getValues().UPLOADS_PATH)
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'musicfile' + '-' + uniqueSuffix + '.mp3')
    },

})

const upload = multer({ storage: storage, fileFilter: (_req, file, cb) => {
    console.log('filetype', file.mimetype)
    if (file.mimetype !== 'audio/mpeg') {
        return cb(new Error('filetype validation'))
    }
    cb(null, true)
}})

export {
    upload
}