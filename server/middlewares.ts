import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import getValues from "./env";
import UserModel from "./models/User";
import axios from "axios";

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

const requireCaptcha = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.get('HCAPTCHA_TOKEN')) {
        return res.status(400).send({
            msg: "HCAPTCHA_TOKEN -header is required."
        })
    }

    // verify token by hcaptcha api

    const HCAPTCHA_TOKEN = req.get('HCAPTCHA_TOKEN')
    
    try {
        const captchaReq = await axios.post('https://api.hcaptcha.com/siteverify', {
            response: HCAPTCHA_TOKEN,
            secret: getValues().HCAPTCHA_SECRET
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

        const { success } = captchaReq.data
        if (!success) {
            return res.status(498).send({ msg: 'Captcha token invalid.' })
        }

        next()
    } catch (e) {
        console.error('captcha err: ', e)
        return res.status(401).end()
    }



}

export {
    requireAuth,
    requireCaptcha
}