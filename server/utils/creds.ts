import getValues from "../env"
import { SignupData, UserCredintials } from "../types"

import jwt from 'jsonwebtoken'

const isSignUpBodyValid = (body: unknown): body is SignupData  => {
    if (body && typeof body === 'object' && "username" in body && body.username && typeof body.username === 'string' && "password" in body && typeof body.password === 'string') {
        return true
    }

    return false
}

const parseSignupData = (body: unknown): SignupData => {
    if (!isSignUpBodyValid(body)) {
        throw new Error('invalid data')
    }
    return body as SignupData
}   


const generateUserCreds = (username: string): UserCredintials => {
    const { expiresIn } = getValues()
    const token = jwt.sign({ username }, getValues().JWT_SECRET, {
        expiresIn
    })

    return {
        token,
        expiresIn,
        username
    }
}

export {
    parseSignupData,
    generateUserCreds
}