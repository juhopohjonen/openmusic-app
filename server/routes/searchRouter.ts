import { Router } from "express";
import SongModel from "../models/Song";
import { User } from "../types";

const searchRouter = Router()

searchRouter.post('/music', async (req, res) => {
    const { query } = req.body



    if (!query || typeof query !== 'string') {
        return res.status(400).end()
    }

    const songs = await SongModel.find({ $text: { $search: query } })
        .populate<{ artist: User }>('artist')

    return res.send(songs)
    
})

export default searchRouter