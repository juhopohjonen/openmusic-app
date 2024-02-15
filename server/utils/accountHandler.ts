import UserModel from "../models/User"

const VALID_USERNAME_REGEX = /^[a-z0-9_\-]+$/

const doesAccountExist = async (username: string): Promise<boolean> => {
    const account = await UserModel.findOne({ username })
    if (account) {
        return true
    }

    return false
}

const isValidUsername = (username: string): boolean => {
    return VALID_USERNAME_REGEX.test(username)
}

export {
    doesAccountExist,
    isValidUsername
}