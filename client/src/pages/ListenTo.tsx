import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE } from '../constants'
import SongCard from '../Components/SongCard'
import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthProps, CommentType, Song } from '../types'
import SongCardSkeleton from '../Components/SongCardSkeleton'
import { Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import CommentElem from '../Components/Comment'
import { getAuth } from '../utils'
import RateSong from '../Components/RateSong'



const ListenTo = ({ setDanger }: AuthProps) => {
    const { id } = useParams()
    const [song, setSong] = useState<Song | null>(null)

    useEffect(() => {
        axios.get<Song>(`${API_BASE}/api/music/${id}`)
            .then(res => setSong(res.data))
            .catch(err => {
                console.error(err)
                setDanger('This song could not be found. It might be removed or not exist.')
            })
    }, [])



    console.log(song)

    return (
        <>

            <Typography gutterBottom variant='h2' component='h1'>Listen to <b>{ song && song.title ? song.title : '...' }</b></Typography>

            <Paper
                sx={{ padding: 2 }}
                elevation={3}
            >




            {
                song ? <SongInfo songId={id} title={song.title} artist={song.artist.username} src={`${API_BASE}/api/stream/${id}`} /> : <SongCardSkeleton />
            }

            <CommentList songId={id} />
            
            </Paper>

        </>
    )
}

const SongInfo = (songCardProps: { title: string, artist: string, src: string, songId: string | undefined }) => {
    return (
        <Grid container spacing={2}>
            <Grid item>
                <SongCard {...songCardProps} />
            </Grid>

            <Grid item sx={{ flexGrow: 1 }}>
                <RateSong songId={songCardProps.songId} />
            </Grid>
        </Grid>
    )
}

const CommentList = ({ songId }: { songId: string | undefined }) => {

    const navigate = useNavigate()

    const COMMENT_API = `${API_BASE}/api/music/${songId}/comment`

    const [comments, setComments] = useState<CommentType[]>([])
    useEffect(() => {
        axios.get(COMMENT_API)
            .then(res => setComments(res.data))
            .catch(err => {
                console.error('virhe kommentteja ladatessa', err)
            })
    }, [])

    const [newComInput, setNewComInput] = useState('')

    const sendComment = (e: FormEvent<HTMLFormElement>) => {
        setNewComInput('')

        if (!getAuth()) {
            navigate('/login')
        }

        e.preventDefault()

        axios.post(COMMENT_API, {
            commentText: newComInput
        }, {
            headers: {
                Authorization: `Bearer ${getAuth()?.token}`
            }
        })
            .then(res => setComments([...comments, res.data]))
            .catch(err => console.error(err))
    }

    return (
        <Paper elevation={10} sx={{ p: 2, mt: 2 }}>
            <Typography variant='h5' component='div' gutterBottom>Comments</Typography>

            {comments.map((c, i) => <CommentElem key={`${c.user.username}-key-${i}`} content={c.content} username={c.user.username} /> )}


            <Grid container component='form' onSubmit={sendComment}>

                <Grid item>
                <TextField
                    placeholder='Write a comment...'
                    value={newComInput}
                    onChange={(e) => setNewComInput(e.target.value)}
                />
                </Grid>

                <Grid item>
                    <IconButton disabled={!newComInput} type='submit' sx={{ mt: 1, ml: 1 }}>
                        <SendIcon />
                    </IconButton>
                </Grid>

            </Grid>


        </Paper>
    )
}

export default ListenTo