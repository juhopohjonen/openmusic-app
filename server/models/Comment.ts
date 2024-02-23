import { ObjectId } from "mongodb"
import mongoose from "mongoose"
import UserModel from "./User"
import SongModel from "./Song"
import { Comment } from "../types"

const MAX_COMMENT_LENGTH = 75

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        validate: (content: string) => content.length > 0 && content.length <= MAX_COMMENT_LENGTH
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