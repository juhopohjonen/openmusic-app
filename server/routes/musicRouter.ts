import { Router } from "express";
import { requireAuth } from "../middlewares";

import { upload } from "../utils/uploadHandler";
import SongModel from "../models/Song";
import { User, Song } from "../types";
import CommentModel from "../models/Comment";



const musicRouter = Router()

musicRouter.get('/', async (_req, res) => {
    const songs = await SongModel.find({}).populate<{ artist: User }>('artist')
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

musicRouter.post('/:id/comment', requireAuth, async (req, res) => {

    if (!req.params.id) {
        return res.status(400).end()
    }

    const { id } = req.params
    const { commentText } = req.body 
    
    if (!commentText) {
        return res.status(400).end()
    }

    if (!req.user) {
        throw Error
    }

    // check exists -> find song by id
    const song = await SongModel.findById(id)
    if (!song) {
        return res.status(404).end()
    }

    const comment = new CommentModel({
        song: song._id,
        user: req.user._id,
        content: commentText
    })

    await comment.save()

    let populatedComment = await comment.populate<{ user: User, song: Song }>('user song')
    return res.send(populatedComment)

})

musicRouter.get('/:id/comment', async (req, res) => {
    const { id } = req.params
    const comments = await CommentModel.find({ song: id }).populate<{ user: User, song: Song }>('user song')


    return res.send(comments)
})

export default musicRouter