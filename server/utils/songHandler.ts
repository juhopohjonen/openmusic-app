import SongModel from "../models/Song"
import { Song, User } from "../types"

const parseSongList = async (arr: unknown) => {
    const songs = []

    if (!Array.isArray(arr)) {
        throw new Error('not arr!')
    }

    for (let i = 0; i < arr.length; i++) {
        const id = arr[i]
        const song = await SongModel.findById(id).populate<{ artist: User }>('artist')
        songs.push(song)

        if (!song) {
            throw new Error('Song not found!')
        }
        
    }


    return songs

}

const isUserAuthor = (user: User, song: Song): boolean => {
    console.log(user._id, song.artist, user._id === song.artist)
    

    if (user._id.toString() === song.artist.toString()) {
        return true
    }

    return false
}


export {
    parseSongList,
    isUserAuthor
}