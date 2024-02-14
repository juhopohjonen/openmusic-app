import UserModel from "../models/User"

const doesAccountExist = async (username: string): Promise<boolean> => {
    const account = await UserModel.findOne({ username })
    if (account) {
        return true
    }

    return false
}

export {
    doesAccountExist
}