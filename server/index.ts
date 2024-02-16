import express from "express";
import getValues from "./env";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter";
import loginRouter from "./routes/loginRouter";
import musicRouter from "./routes/musicRouter";
import CORS from 'cors'
import streamRouter from "./routes/streamRouter";
import handleObjectIdCastErrors from "./utils/errorHandler";
import validateRouter from "./routes/validateRouter";
import playlistRouter from "./routes/playlistRouter";

const app = express()


app.use(express.json())

if (getValues().environment === 'dev') {
    app.use(CORS())
}

app.get('/', (_req, res) => res.send('ok'))

app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/music', musicRouter)
app.use('/api/stream', streamRouter)
app.use('/api/validate', validateRouter)
app.use('/api/playlist', playlistRouter)

app.get('/asyncerr', async (_req, res, next) => {
    try {
        throw new Error('test')
        return res.end()
    } catch (e) {
        next(e)
    }

})

app.use(handleObjectIdCastErrors)



mongoose.connect(getValues().MONGODB_URI)
    .then(() => console.log('con -> mongodb succeed'))
    .catch(e => console.error('err in mongodb conn', e))

app.listen(getValues().port, () => {
    console.log(`Listening on ${getValues().port.toString()}`)
})