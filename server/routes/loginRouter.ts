import { Router } from "express"; 
import { generateUserCreds, parseSignupData } from "../utils/creds";
import UserModel from "../models/User";

import bcrypt from 'bcrypt'

const loginRouter = Router()

loginRouter.post('/', async (req, res) => {
    try {
        const { username, password } = parseSignupData(req.body)
        const user = await UserModel.findOne({ username: username })

        if (!user) {
            return res.status(404).end()
        }

        const isValidPass: boolean = await bcrypt.compare(password, user.pwdHash)

        if (!isValidPass) {
            return res.status(404).end()
        }

        const creds = generateUserCreds(username)
        return res.send({ creds })

    } catch (e) {
        return res.status(400).end()
    }
})

export default loginRouter