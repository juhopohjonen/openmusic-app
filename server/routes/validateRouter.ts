import { Router } from "express";
import UserModel from "../models/User";
import { isValidUsername } from "../utils/accountHandler";

const validateRouter = Router()

validateRouter.post('/username', async (req, res) => {
    const { username } = req.body
    if (!username) {
        return res.send(400).end()
    }

    const userExists = await UserModel.exists({ username })
    if (userExists) {
        return res.send({ code: 'USER_EXISTS' })
    }

    const isUserValid = isValidUsername(username)
    if (!isUserValid) {
        return res.send({ code: "NOT_VALID" })
    }

    return res.send({ code: "VALID" })

})

export default validateRouter