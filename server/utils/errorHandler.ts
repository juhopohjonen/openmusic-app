import { NextFunction, Request, Response } from "express"

const handleObjectIdCastErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const isCastError = 
        err.name === 'CastError'

    if (isCastError) {
        return res.status(404).send({ err: "Couldn't be found." })
    }

    console.error('unknown error', err)

    next(err)
}

export default handleObjectIdCastErrors