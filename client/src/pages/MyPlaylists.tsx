import { Box, Button, Card, CardContent, Dialog, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import { AuthProps, Playlist, AutocompleteOption } from "../types"
import { Link, Navigate } from "react-router-dom"
import { SyntheticEvent, useEffect, useState } from "react"
import axios from "axios"
import { API_BASE } from "../constants"
import SongSearch from "../Components/SongSearch"

import AddCircleIcon from '@mui/icons-material/AddCircle';
import Title from "../Components/Title"
const MyPlaylists = (authProps: AuthProps) => {
    const { auth, setDanger } = authProps

    if (!auth) {
        return <Navigate to='/' />
    }

    const [playlists, setPlaylists] = useState<Playlist[] | null>(null)
    const [createDialog, setCreate] = useState(false)

    const closeCreator = () => setCreate(false)
    const addToPlaylist = (newPlaylist: Playlist) => {
        if (!playlists || playlists.length === 0) {
            return setPlaylists([newPlaylist])
        }

        setPlaylists([...playlists, newPlaylist])
    }

    useEffect(() => {
        axios.get<Playlist[]>(`${API_BASE }/api/playlist/my`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(res => setPlaylists(res.data))
            .catch(err => {
                console.error(err)
                setDanger('Virhe tapahtui!')
            })
    }, [])

    console.log(playlists)


    return (
        <>
            <Title title="My playlists" />
            <Typography variant="h3" component='h1'>My playlists</Typography>
            {
                playlists 
                    ? playlists.map(playlist => <PlaylistCard key={playlist.id} {...playlist} />)
                    : <p>loading</p>
            }


            <Button onClick={() => setCreate(true)} sx={{ mt: 2 }} variant="outlined">Create new</Button>

            <Dialog onClose={() => setCreate(false)} open={createDialog}>
                <DialogTitle>
                    Create a new playlist
                </DialogTitle>


                <Box sx={{ paddingLeft: 2, paddingRight: 2, paddingBottom: 2 }}>
                
                <PlaylistCreator {...authProps} closeCreator={closeCreator} addToPlaylist={addToPlaylist} />

                </Box>

            </Dialog>

        </>
    )
}

interface PlaylistCreatorProps extends AuthProps {
    closeCreator: Function,
    addToPlaylist: Function

}

const PlaylistCreator = ({ auth, setDanger, closeCreator, addToPlaylist }: PlaylistCreatorProps) => {
    const [song, setSong] = useState<AutocompleteOption | null>(null)
    const [selectedSongs, setSelectedSongs] = useState<AutocompleteOption[]>([])

    console.log(selectedSongs)

    if (!auth) {
        return <></>
    }

    const isValidSong = (): boolean => song ? true : false

    const selectSong = () => {
        console.log('in function selectsong', song)

        if (!song) {
            return
        }

        setSelectedSongs([...selectedSongs, song])
        setSong(null)
    }

    const [name, setName] = useState('')

    const createPlaylist = (e: SyntheticEvent) => {
        e.preventDefault()

        axios.post<Playlist>(`${API_BASE}/api/playlist`, {
            title: name,
            songIdArr: selectedSongs.map(song => song.id),
            isPublic: true
        }, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(res => {
                addToPlaylist(res.data)
            })
            .catch(err => {
                console.error(err)
                setDanger('Error in creating playlist.')
            })
            .then(() => closeCreator())
    }

    const isValidPlaylist = name && selectedSongs.length > 0
    
    const changePlaylistName = (targetValue: string) => {
        if (targetValue.length < 30) {
            setName(targetValue)
        }
    }


    return (
        <form onSubmit={createPlaylist}>
            <TextField
                autoFocus

                label="Name of playlist"


                value={name}
                onChange={(e) => changePlaylistName(e.target.value)}
                sx={{ mb: 1 }}
                
            />

            <br />


            <Box sx={{ mb: 1 }}>
                <SelectedSongs selectedSongs={selectedSongs} />
            </Box>

            <Grid container sx={{ mt: 0.5 }}>
                <Grid item xs={9}>
                    <SongSearch
                        song={song}
                        setSong={setSong}
                        width='100%'
                        label="Select song"
                    />
                </Grid>

                <Grid item>
                    <IconButton 
                        sx={{ mt: 1, ml: 1 }}
                        onClick={selectSong}
                        disabled={!isValidSong()}
                    >
                        <AddCircleIcon />
                    </IconButton>
                </Grid>
            </Grid>


            <Button disabled={!isValidPlaylist} sx={{ mt: 1.5 }} variant="contained" type="submit">Create</Button>
        </form>
    )
}

const PlaylistCard = ({ title, songs, id }: Playlist) => {
    return (
        <Card sx={{ mt: 1, mb: 1 }}>
            <CardContent>
                <Box component={Link} to={`/playlists/${id}`} sx={{ color: 'white', textDecoration: 'none' }}>
                    <Typography variant="h5" component='div'>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{songs.length} songs</Typography>

                </Box>
            </CardContent>
        </Card>
    )
}

const SelectedSongs = (props: { selectedSongs: AutocompleteOption[] }) => {
    if (props.selectedSongs.length === 0) {
        return <></>
    }

    return (
        <>
            <Typography variant="h6">Selected songs</Typography>
            <SongList {...props} />
        </>
    )
}

const SongList = ({ selectedSongs }: { selectedSongs: AutocompleteOption[] }) => {


    return selectedSongs.map(song => (
        <Box key={song.id}>
            <Typography variant='body2' color="text.secondary">{song.label}</Typography>
        </Box>
    ))
}


export default MyPlaylists