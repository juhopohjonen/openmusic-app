import { Router } from "express";
import PlaylistModel from "../models/Playlist";
import { requireAuth } from "../middlewares";
import { parseSongList } from "../utils/songHandler";
import { Author, Song, User } from "../types";

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

playlistRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).end()
    }

    // check if public playlists exists with id query

    try {
        const list = await PlaylistModel.findOne({ _id: id, isPublic: true })
            .populate<{ author: User, songs: Song[] }>('author songs')
            .populate<{ artist: Author }>({
                path: 'songs',
                populate: {
                    path: 'artist'
                }
            })
        if (!list) {
            return res.status(404).end()
        }
        return res.send(list)
    } catch (e) {
        next(e)
    }
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