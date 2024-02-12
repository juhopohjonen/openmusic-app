// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from "express"
import { User } from "../../types"

declare module 'express-serve-static-core' {
    export interface Request {
        user?: User
    }
}