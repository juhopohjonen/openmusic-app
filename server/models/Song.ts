import mongoose, { Types } from "mongoose";
import { Song } from "../types";

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    filename: {
        type: String,
        required: true
    }
})

songSchema.index({ title: 'text' })

songSchema.set('toJSON', {
    transform: (_doc, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.filename
    }
})

const SongModel = mongoose.model<Song>('SongModel', songSchema)

export default SongModel