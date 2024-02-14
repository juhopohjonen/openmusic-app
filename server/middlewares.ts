import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import getValues from "./env";
import UserModel from "./models/User";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.get('Authorization')) {
        return res.status(400).end()
    }

    // verify bearer token auth header is valid and decode

    try {
        const token = req.get('Authorization')?.split(" ")[1]

        if (!token) {
            throw new Error
        }

        const decodedJWT = jwt.verify(token, getValues().JWT_SECRET)
        if (typeof decodedJWT !== 'object' || !("username" in decodedJWT)) {
            throw new Error('Jwt was valid and signed with right secret, but its contents were invalid!')
        }

        const { username } = decodedJWT
        const user = await UserModel.findOne({ username })

        if (!user) {
            throw new Error('no user!')
        }

        req.user = user

    } catch (e) {
        console.error('error in parsing auth header', e)
        return res.status(401).send({ err: 'invalid header' })
    }

    next()
}

export {
    requireAuth
}