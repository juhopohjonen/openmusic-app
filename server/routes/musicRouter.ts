import { Router } from "express";
import { requireAuth } from "../middlewares";

import { removeUploadFile, upload } from "../utils/uploadHandler";
import SongModel from "../models/Song";
import { User, Song } from "../types";
import CommentModel from "../models/Comment";
import RatingModel from "../models/Rating";
import { isUserAuthor } from "../utils/songHandler";

const musicRouter = Router()

musicRouter.get('/', async (req, res) => {
    const songs = await SongModel.find({}).populate<{ artist: User }>('artist')
    return res.send(songs)
})

musicRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const song = await SongModel.findOne({ _id: id })
        if (!song) {
            return res.status(404).end()
        }
    
        const populatedSong = await song.populate<{ artist: User }>('artist')
    
        return res.send(populatedSong)
    } catch (err) {
        next(err)
    }
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

musicRouter.delete('/:id', requireAuth, async (req, res, next) => {
    const { id } = req.params
    if (!req.user || !id) {
        return res.status(400).end()
    }

    try {
        const song = await SongModel.findById(id)
        if (!song) {
            return res.status(404).end()
        }


        if (!isUserAuthor(req.user, song)) {
            return res.status(401).end()
        }

        await SongModel.deleteOne({ _id: song._id })
        removeUploadFile(song.filename)
        return res.status(204).end()
    } catch (e) {
        next(e)
    }
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

    const populatedComment = await comment.populate<{ user: User, song: Song }>('user song')
    return res.send(populatedComment)

})

musicRouter.get('/:id/comment', async (req, res) => {
    const { id } = req.params
    

    try {
        const comments = await CommentModel.find({ song: id }).populate<{ user: User, song: Song }>('user song')
        return res.send(comments)
    } catch (e) {
        return res.status(404).end()
    }



})

musicRouter.get('/:id/rating', async (req, res, next) => {
    const { id } = req.params
    
    try {
        const rates = await RatingModel.find({ song: id })

        const grades = rates.map(rate => rate.grade)

        // reduce grades to array, calc average, round to 1 decimal
        const avg: number = Number((grades.reduce((prev, cur) => prev + cur, 0) / grades.length).toFixed(1))
    
        return res.send({ avg })
    } catch (e) {
        next(e)
    }

})

musicRouter.post('/:id/rating', requireAuth, async (req, res, next) => {
    const { user } = req
    const { grade } = req.body
    const { id } = req.params

    if (!user) {
        return res.status(401).end()
    }

    if (!grade) {
        return res.status(400).end()
    }

    const song = await SongModel.findById(id)
    if (!song) {
        return res.status(404).end()
    }

    const ratingAlreadyExists = await RatingModel.exists({ user: user._id, song: song._id })
    if (ratingAlreadyExists) {
        return res.status(409).end()
    }

    try {
        const rating = new RatingModel({
            grade,
            user: user._id,
            song: song._id
        })

        await rating.save()

        return res.send({ grade: rating.grade, code: 'OK' })
    } catch (e) {
        next(e)
    }
})

musicRouter.get('/:id/my-rating', requireAuth, async (req, res, next) => {
    const { id } = req.params
    const user = req.user
    if (!id || !user) {
        return res.status(400).end()
    }


    try {
        // check if already user has rated this song 
        const rating = await RatingModel.findOne({ song: id, user: user._id })
        if (!rating) {
            return res.send({ code: 'NO_RATING' })
        }

        return res.send({ grade: rating.grade, code: 'OK'})
    } catch (e) {
        next(e)
    }
})

musicRouter.put('/:id/my-rating', requireAuth, async (req, res, next) => {
    const { id } = req.params
    const user = req.user
    const { grade } = req.body

    if (!id || !user || !grade) {
        return res.status(400).end()
    }


    try {
        // check if already user has rated this song 
        const rating = await RatingModel.findOne({ song: id, user: user._id })
        if (!rating) {
            return res.send({ code: 'NO_RATING' })
        }

        rating.grade = grade;

        await rating.save()

        return res.send({ grade: rating.grade, code: 'OK'})
    } catch (e) {
        next(e)
    }
})

export default musicRouter