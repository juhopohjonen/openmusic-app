import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Playlist } from "../types";

const playlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: ObjectId,
        ref: 'UserModel',
        required: true
    },
    songs: [{
        type: ObjectId,
        ref: 'SongModel',
        required: true
    }],
    isPublic: {
        type: Boolean,
        required: true
    }
})

playlistSchema.set('toJSON', {
    transform: (_doc, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const PlaylistModel = mongoose.model<Playlist>('PlaylistModel', playlistSchema)

export default PlaylistModel