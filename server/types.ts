import { ObjectId } from "mongodb"

export interface User {
    _id: ObjectId,
    username: string,
    pwdHash: string
}

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