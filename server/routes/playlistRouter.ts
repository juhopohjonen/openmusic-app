import { Router } from "express";
import PlaylistModel from "../models/Playlist";
import { requireAuth } from "../middlewares";
import { parseSongList } from "../utils/songHandler";
import { Song, User } from "../types";

const playlistRouter = Router()

playlistRouter.get('/my', requireAuth, async (req, res) => {
    if (!req.user) {
        return res.status(401).end()
    }

    const myPlaylists = await PlaylistModel.find({
        author: req.user._id
    }).populate('author songs')

    return res.send(myPlaylists)

})

playlistRouter.post('/', requireAuth, async (req, res) => {
    if (!req.user) {
        return res.status(401).end()
    }

    const { title, songIdArr, isPublic } = req.body
    if (!title || !songIdArr) {
        return res.status(400).end()
    }


    try {
        // validate songs (type and exists in db?)
        const songList = await parseSongList(songIdArr)
        const songIds = songList.map(song => song?._id && song._id)

        const playlist = new PlaylistModel({
            author: req.user._id,
            songs: songIds,
            title: title,
            isPublic: isPublic ? true : false
        })
        
        await playlist.save()
        await playlist.populate<{ author: User, songs: Song[] }>('author songs')
        
        return res.send(playlist)
    } catch (e) {
        console.error(e)
        return res.status(400).end()
    }

})

export default playlistRouter