import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE } from '../constants'
import SongCard from '../Components/SongCard'
import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthProps, CommentType, Playlist, Song } from '../types'
import SongCardSkeleton from '../Components/SongCardSkeleton'
import { Divider, Grid, Icon, IconButton, Menu, MenuItem, Paper, TextField, Tooltip, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import CommentElem from '../Components/Comment'
import { getAuth } from '../utils'
import RateSong from '../Components/RateSong'

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';



const ListenTo = (authProps: AuthProps) => {

    const { setDanger } = authProps

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
                song ? <SongInfo {...authProps} songId={id} title={song.title} artist={song.artist.username} src={`${API_BASE}/api/stream/${id}`} /> : <SongCardSkeleton />
            }

            <CommentList songId={id} />
            
            </Paper>

        </>
    )
}

interface SongCardProps extends AuthProps {
    title: string, 
    artist: string, 
    src: string, 
    songId: string | undefined
}

const SongInfo = (songCardProps: SongCardProps) => {
    return (
        <Grid container spacing={2}>
            <Grid item>
                <SongCard {...songCardProps} />
            </Grid>

            <Grid item sx={{ flexGrow: 1 }}>
                <RateSong songId={songCardProps.songId} />
            </Grid>

            <Grid item>
                <AddtoPlaylist {...songCardProps} />
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

const AddtoPlaylist = (authProps: SongCardProps) => {

    const { auth } = authProps

    if (!auth) {
        return (
            <Tooltip title="You have to be logged in to manage playlists">
                <Icon sx={{ color: 'text.secondary' }}>
                    <PlaylistAddIcon />
                </Icon>
            </Tooltip>
        )
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const isMenuOpen = Boolean(anchorEl)
    const handleMenuOpenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget)
    }

    const [playlists, setPlaylists] = useState<Playlist[] | null>(null)
    useEffect(() => {
        axios.get<Playlist[]>(`${API_BASE}/api/playlist/my`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(res => setPlaylists(res.data))
            .catch(err => {
                console.error(err)
            })
    }, [])

    return (
        <>
            <IconButton onClick={handleMenuOpenClick}>
                <PlaylistAddIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={() => setAnchorEl(null)}
            >
                <Typography gutterBottom sx={{ ml: 2, mr: 2 }} variant='body1' component='div'>Add to playlist</Typography>
                <Divider />

                {playlists && playlists.map(playlist => <PlaylistItem playlist={playlist} authProps={authProps} />)}
            </Menu>
        </>
    )
}

const PlaylistItem = ({ playlist, authProps }: { playlist: Playlist, authProps: SongCardProps }) => {
    if (!authProps.auth) {
        return <></>
    }

    const addToList = () => {
        axios.post(`${API_BASE}/api/playlist/${playlist.id}/${authProps.songId}`, { }, {
            headers: {
                Authorization: `Bearer ${authProps.auth?.token}`
            }
        })
            .then(res => {
                console.log(res)
                authProps.setSuccess(`${authProps.title} added to playlist ${playlist.title}`)
            }) 
            .catch(err => {
                console.error(err)
                if (err.response && err.response.status && err.response.status === 409) {
                    return authProps.setDanger('Song already exists in playlist')
                }

                authProps.setDanger('Unknown error')
            })
    }

    return (
        <MenuItem onClick={addToList}>{playlist.title}</MenuItem>
    )
}

export default ListenTo