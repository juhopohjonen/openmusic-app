import { ObjectId } from "mongodb"
import mongoose from "mongoose"
import UserModel from "./User"
import SongModel from "./Song"
import { Comment } from "../types"

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    user: {
        type: ObjectId,
        ref: UserModel,
        required: true
    },

    song: {
        type: ObjectId,
        ref: SongModel,
        required: true   
    }

})

commentSchema.set('toJSON', {
    transform: (_doc, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.song.artist
    }
})

const CommentModel = mongoose.model<Comment>('CommentModel', commentSchema)


export default CommentModel