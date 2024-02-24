import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE } from '../constants'
import SongCard from '../Components/SongCard'
import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthProps, CommentType, Playlist, Song } from '../types'
import SongCardSkeleton from '../Components/SongCardSkeleton'
import { Box, Button, Divider, Grid, Icon, IconButton, Menu, MenuItem, Paper, TextField, Tooltip, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import CommentElem from '../Components/Comment'
import { getAuth } from '../utils'
import RateSong from '../Components/RateSong'

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Title from '../Components/Title'



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


    return (
        <>
            <Title title={song ? song.title : 'Listen to song'} />
            <Typography gutterBottom variant='h2' component='h1'>Listen to <b>{ song && song.title ? song.title : '...' }</b></Typography>

            <Paper
                sx={{ padding: 2 }}
                elevation={3}
            >




            {
                song ? <SongInfo {...authProps} song={song} /> : <SongCardSkeleton />
            }

            <CommentList {...authProps} songId={id} />
            
            </Paper>



        </>
    )
}

const SongAuthorMenu = ({ auth, song, setSuccess, setDanger }: SongCardProps) => {

    if (!auth) {
        return
    }

    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    const navigate = useNavigate()


    const removeSong = () => {
        axios.delete(`${API_BASE}/api/music/${song.id}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(() => {
                setSuccess('Successfully removed song.')
                navigate('/')
            })
            .catch(err => {
                console.error(err)
                setDanger('Something happened in removing the song.')
            })
    }

    return (
        <>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
                <MoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
            >
                <Button onClick={removeSong} sx={{ mr: 1, ml: 1 }} variant='contained' color='error'>Remove song</Button>
            </Menu>
        </>
    )
}

interface SongCardProps extends AuthProps {
    song: Song
}

const SongInfo = (songCardProps: SongCardProps) => {
    const { song, auth } = songCardProps

    const isUserArtist = 
        song.artist.username === auth?.username


    return (
        <Grid container spacing={2}>
            <Grid item>
                <SongCard {...song} />
            </Grid>

            <Grid item sx={{ flexGrow: 1 }}>
                <RateSong songId={song.id} />
            </Grid>

            <Grid item>
                
                {isUserArtist && <SongAuthorMenu {...songCardProps}  />}

                
                <AddtoPlaylist {...songCardProps} />
            </Grid>
        </Grid>
    )
}

interface CommentListProps extends AuthProps  {
    songId: string | undefined
}

const CommentList = (commentListProps: CommentListProps) => {
    const { songId, auth } = commentListProps

    if (!songId) {
        return <></>
    }


    const MAX_COMMENT_LENGTH = 75

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

    const newComInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        if (value.length > MAX_COMMENT_LENGTH) {
            return
        }

        setNewComInput(value)

    }

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

            {comments.map((c, i) => (
                <CommentElem 
                    {...commentListProps} 
                    songId={songId} 
                    auth={auth} 
                    key={`${c.user.username}-key-${i}`} 
                    commentId={c.id} 
                    content={c.content} 
                    username={c.user.username} 
                    commentsStateChange={setComments}
                    comments={comments}
                />
            ) )}


            <Grid sx={{ mt: 2 }} container component='form' onSubmit={sendComment}>

                <Grid item xs={8}>
                    <Box>
                        <TextField
                            placeholder='Write a comment...'
                            value={newComInput}
                            onChange={newComInputChange}
                            fullWidth
                        />
                    </Box>
                </Grid>

                <Grid item sx={{ flexGrow: 1 }}>
                    <IconButton disabled={!newComInput} type='submit' sx={{ mt: 1, ml: 1 }}>
                        <SendIcon />
                    </IconButton>
                </Grid>

                <CommentLengthDisplay length={newComInput.length} maxLength={MAX_COMMENT_LENGTH} />

            </Grid>


        </Paper>
    )
}

const CommentLengthDisplay = ({ length, maxLength=50 }: { length: number, maxLength?: number }) => (
    <Grid item>
        <Typography variant='body2' color="text.secondary" sx={{ mt: 2 }}>{length} / {maxLength}</Typography>
    </Grid>
)

const AddtoPlaylist = (authProps: SongCardProps) => {

    const { auth } = authProps

    if (!auth) {
        return (
            <Tooltip title="You have to be logged in to manage playlists" enterTouchDelay={50}>
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

                {playlists && playlists.map(playlist => <PlaylistItem key={playlist.id} playlist={playlist} authProps={authProps} />)}
            </Menu>
        </>
    )
}

const PlaylistItem = ({ playlist, authProps }: { playlist: Playlist, authProps: SongCardProps }) => {
    if (!authProps.auth) {
        return <></>
    }

    const addToList = () => {
        axios.post(`${API_BASE}/api/playlist/${playlist.id}/${authProps.song.id}`, { }, {
            headers: {
                Authorization: `Bearer ${authProps.auth?.token}`
            }
        })
            .then(res => {
                console.log(res)
                authProps.setSuccess(`${authProps.song.title} added to playlist ${playlist.title}`)
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