import { AuthState } from "./types";

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
        
        console.log('completed storageitem str/null test')

        if (isAuthObject(parsedStorageItem)) {
            console.log('completed isauthobject guard')

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
    console.log('setting..')
    setFunc(msg)

    setTimeout(() => {
        setFunc('')
    }, 3000)
} 

export {
    getAuth,
    logoutUser,
    setStateWithTimeout
}