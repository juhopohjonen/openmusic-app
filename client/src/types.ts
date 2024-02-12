interface AuthStateObject {
    token: string,
    expiresIn: string,
    username: string
}

export type AuthState = AuthStateObject | null

export interface AuthProps {
    auth: AuthState,
    setAuth: React.Dispatch<React.SetStateAction<AuthState>>
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