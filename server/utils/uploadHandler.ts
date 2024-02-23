import multer from "multer";
import getValues from "../env";
import path from 'path'
import fs from 'fs'

/*

const songStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, getValues().UPLOADS_PATH)
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'musicfile' + '-' + uniqueSuffix + '.mp3')
    },

})

const imgStorage =  multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, path.join(getValues().UPLOADS_PATH, 'images'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now + "-" + Math.round(Math.random() * 1E9)
        cb(null, `imagecover-${uniqueSuffix.toString()}.png`)
    }
})

const songUploader = multer({ storage: songStorage, fileFilter: (_req, file, cb) => {
    console.log('filetype', file.mimetype)
    if (file.mimetype !== 'audio/mpeg') {
        return cb(new Error('filetype validation'))
    }
    cb(null, true)
}})

const songUpload = songUploader.single('song')

const coverImgUploader = multer({ storage: imgStorage, fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'image/png') {
        return cb(new Error('img filetype validation'))
    }

    cb(null, true)
}})

const coverImgUpload = coverImgUploader.single('coverImg')



*/

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, getValues().UPLOADS_PATH)
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        switch(file.mimetype) {
            case 'audio/mpeg':
                return cb(null, `musicfile-${uniqueSuffix}.mp3`)
            case 'image/png':
                return cb(null, `imagefile-${uniqueSuffix}.png`)
            default:
                console.log('did not match any')
                return cb(new Error(`mimetype ${file.mimetype} didn't match any`), '')
        }

    },

})

const upload = multer({ storage: storage, fileFilter: (_req, file, cb) => {
    console.log('filetype', file.mimetype)

    switch (file.mimetype) {
        case 'audio/mpeg':
            return cb(null, true)
        case 'image/png':
            return cb(null, true)
        default:
            return cb(new Error('Filetype validation!'))
    }
    


}})

const removeUploadFile = (filename: string) => {
    const { UPLOADS_PATH } = getValues()
    const fileLocation = path.join(UPLOADS_PATH, filename)

    fs.unlinkSync(fileLocation)
}

export {
    upload,
    removeUploadFile
}