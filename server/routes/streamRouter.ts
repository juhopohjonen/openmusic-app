import { Router } from "express"
import SongModel from "../models/Song"
import path from 'path'
import getValues from "../env"
import fs from 'fs'

const streamRouter = Router()

streamRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    const song = await SongModel.findOne({ _id: id })

    if (!song) {
        return res.status(404).end()
    }

    const { filename } = song
    const filePath = path.join(getValues().UPLOADS_PATH, filename)

    res.writeHead(200, {"Content-Type": "mime/mp3"})

    return fs.createReadStream(filePath).pipe(res)

})

export default streamRouter