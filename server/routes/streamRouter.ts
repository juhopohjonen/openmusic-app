import { Router } from "express"
import SongModel from "../models/Song"
import path from 'path'
import getValues from "../env"
import fs from 'fs'

const streamRouter = Router()

streamRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const song = await SongModel.findOne({ _id: id })

        if (!song) {
            return res.status(404).end()
        }
    
        const { filename } = song
        const filePath = path.join(getValues().UPLOADS_PATH, filename)
    
        //res.writeHead(200, {"Content-Type": "mime/mp3"})
    
        console.log('inreadstream')
        return res.sendFile(filePath)
    } catch (e) {
        next(e)
    }


})

export default streamRouter