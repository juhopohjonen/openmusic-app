import { jwtDecode } from "jwt-decode";
import { AuthState, AutocompleteOption, Song } from "./types";

const isAuthObject = (auth: unknown): auth is AuthState => {
    if (auth && typeof auth === 'object' && "token" in auth && "expiresIn" in auth && "username" in auth && typeof auth.token === 'string' && typeof auth.expiresIn === 'string' && typeof auth.username === 'string') {
        return true
    }

    return false
}

const getAuth = (): AuthState => {
    const storageItem: string | null = window.localStorage.getItem('auth')
    if (!storageItem) {
        return null
    }


    try {
        const parsedStorageItem = JSON.parse(storageItem)

        if (isAuthObject(parsedStorageItem) && isTokenValid(parsedStorageItem?.token)) {
            return parsedStorageItem as AuthState
        }
        
    } catch (e) {
        return null
    }

    return null
}

const logoutUser = (setAuth: React.Dispatch<React.SetStateAction<AuthState>>) => {
    window.localStorage.removeItem('auth')
    setAuth(null)
}


const setStateWithTimeout = (setFunc: React.Dispatch<React.SetStateAction<string>>, msg: string) => {
    setFunc(msg)

    setTimeout(() => {
        setFunc('')
    }, 3000)
}

const isTokenValid = (token: string | undefined): boolean => {
    if (!token) {
        return false
    }

    try {
        const decoded = jwtDecode(token)

        if (!decoded.exp) {
            return false 
        }
     
        if (decoded.exp * 1000 < new Date().getTime()) {
            return false
        } 
    
        return true
    } catch (e) {
        console.error('error in parsing, might be expired')
        return false
    }

}

const getFullTitle = (title: string) => `${title} - OpenMusic`

const songsToAutocompleteOptions = (songs: Song[]) : AutocompleteOption[] => {
    const options = songs.map(opt => {
        return {
            label: opt.title,
            id: opt.id
        }
    })

    console.log('options')

    return options
}

export {
    getAuth,
    logoutUser,
    setStateWithTimeout,
    isTokenValid,
    getFullTitle,
    songsToAutocompleteOptions
}