import multer from "multer";
import getValues from "../env";

// todo: validate filetypes

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, getValues().UPLOADS_PATH)
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'musicfile' + '-' + uniqueSuffix + '.mp3')
    }
})

const upload = multer({ storage: storage })

export {
    upload
}