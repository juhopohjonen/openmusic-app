import { Router } from "express";
import { generateUserCreds, parseSignupData } from "../utils/creds";
import UserModel from "../models/User";
const userRouter = Router()

import bcrypt from 'bcrypt'
import SongModel from "../models/Song";
import { doesAccountExist } from "../utils/accountHandler";
import { User } from "../types";
import { requireCaptcha } from "../middlewares";

userRouter.post('/', requireCaptcha, async (req, res) => {
    try {
        const { username, password } = parseSignupData(req.body)
        const accountExists: boolean = await doesAccountExist(username)

        if (accountExists) {
            return res.status(409).send({ err: 'Account already exists with specified username.' })
        }

        const pwdHash = await bcrypt.hash(password, 12)

        const user = new UserModel({
            username,
            pwdHash
        })

        await user.save()

        const creds = generateUserCreds(user.username)
        return res.send({ creds })

    } catch (e) {
        return res.send({ e: 'invalid data!' })
    }

})

userRouter.get('/:username/songs', async (req, res) => {
    const { username } = req.params

    const user = await UserModel.findOne({ username })
    if (!user) {
        return res.status(404).send({ err: 'no user found' })
    }

    const songs = await SongModel.find({ artist: user._id }).populate<{ artist: User }>('artist')
    return res.send(songs)
})

export default userRouter