import { Router } from "express";
import { requireAuth } from "../middlewares";

import { upload } from "../utils/uploadHandler";
import SongModel from "../models/Song";

import path from 'path'
import fs from 'fs'
import getValues from "../env";
import { User } from "../types";



const musicRouter = Router()

musicRouter.get('/', async (_req, res) => {
    const songs = await SongModel.find({})
    return res.send(songs)
})

musicRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    const song = await SongModel.findOne({ _id: id })
    if (!song) {
        return res.status(404).end()
    }

    const populatedSong = await song.populate<{ artist: User }>('artist')

    return res.send(populatedSong)

})

musicRouter.post('/', requireAuth, upload.single('song'), async (req, res) => {
    if (!req.user || !req.file || !req.body.title) {
        throw new Error
    }

    const userId = req.user._id
    const { title } = req.body

    const song = new SongModel({
        artist: userId,
        title,
        filename: req.file.filename
    })

    await song.save()
    return res.send({ song })
})

export default musicRouter