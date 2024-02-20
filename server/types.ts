import { ObjectId } from "mongodb"

export interface User {
    _id: ObjectId,
    username: string,
    pwdHash: string
}

export type Author = Pick<User, 'username'>

export interface SignupData {
    username: string,
    password: string
}

export interface UserCredintials {
    token: string,
    expiresIn: string,
    username: string
}

export interface Song {
    title: string,
    artist: ObjectId,
    filename: string,
    _id: ObjectId
}

export interface Comment {
    content: string,
    user: User,
    song: ObjectId
}

export interface Rating {
    grade: number,
    user: ObjectId,
    song: ObjectId
}

export interface Playlist {
    title: string,
    author: ObjectId,
    songs: [ObjectId],
    isPublic: boolean
}



export type SongIdArray = string[]