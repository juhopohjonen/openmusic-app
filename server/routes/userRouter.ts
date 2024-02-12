import { Router } from "express";
import { generateUserCreds, parseSignupData } from "../utils/creds";
import UserModel from "../models/User";
const userRouter = Router()

import bcrypt from 'bcrypt'

userRouter.post('/', async (req, res) => {
    try {
        const { username, password } = parseSignupData(req.body)

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

export default userRouter