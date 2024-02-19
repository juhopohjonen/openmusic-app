import { Request, Response } from "express"

const handleMongooseErrors = (err: Error, req: Request, res: Response) => {
    const isCastError = 
        err.name === 'CastError'

    if (isCastError) {
        return res.status(404).send({ err: "Couldn't be found." })
    }

    if (err.name === 'ValidationError') {
        return res.status(400).send({ err: 'Invalid request' })
    }

    console.error('unhandled error', err)
    res.status(500).send({ err: 'Something went wrong on our side.' })
}

export default handleMongooseErrors