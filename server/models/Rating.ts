import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Rating } from "../types";

const ratingSchema = new mongoose.Schema({
    grade: {
        type: Number,
        required: true,
        validate: {
            validator: (grade: number) => {
                if (grade > 5 || grade < 1) {
                    return false
                }
                
                return true
            },
            message: 'not a valid grade.'
        }
    },

    user: {
        type: ObjectId,
        ref: 'UserModel',
        unique: true
    },

    song: {
        type: ObjectId,
        ref: 'SongModel'
    }
})

ratingSchema.set('toJSON', {
    transform: (_doc, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.user
        delete returnedObject.song
    }
})

const RatingModel = mongoose.model<Rating>('RatingModel', ratingSchema)
export default RatingModel