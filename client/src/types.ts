interface AuthStateObject {
    token: string,
    expiresIn: string,
    username: string
}

export type AuthState = AuthStateObject | null

export interface AuthProps {
    auth: AuthState,
    setAuth: React.Dispatch<React.SetStateAction<AuthState>>,


    setSuccess: Function,
    setDanger: Function,
    
    successAlert: string | null,
    dangerAlert: string | null,
}


export interface MenuItemValues {
    title: string,
    url: string,
    hideOn?: 'logged' | 'logout'
}

export interface User {
    username: string
}

export interface Song {
    title: string,
    artist: User,
    id: string
}

type CommentSongInfo = Pick<Song, "title" | "id">

export interface CommentType {
    content: string,
    user: User,
    song: CommentSongInfo,
}

export interface AlertProps {
    successAlert: string | null,
    dangerAlert: string | null,

    setSuccess: Function,
    setDanger: Function,
}


interface RatingNotFound {
    code: 'NOT_FOUND'
}

interface RatingFound {
    code: 'OK',
    grade: number
}

export type Rating = RatingFound | RatingNotFound