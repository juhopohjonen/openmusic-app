import { useEffect, useState } from "react"
import { AuthProps, Song } from "../types"
import { Box, Button, CircularProgress } from "@mui/material"
import SongCard from "./SongCard"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_BASE } from "../constants"

interface UserSongsProps extends AuthProps {
    username: string
}

const UserSongs = ({ username, setDanger }: UserSongsProps) => {
    const [songs, setSongs] = useState<Song[]>()
    const [hasFailed, setFailed] = useState(false)

    useEffect(() => {
        axios.get(`${API_BASE}/api/user/${username}/songs`)
            .then(res => setSongs(res.data))
            .catch(err => {
                console.error(err)
                setDanger(`User account '${username}' couldn't be found.`)
                setSongs([])
                setFailed(true)
            })
    }, [])

    return (
        <>
            {songs
            ? songs.map(song => (
                <Box key={song.id} component={Link} to={`/listen/${song.id}`} sx={{ color: 'text.primary', textDecoration: 'none' }}>
                    <SongCard artist={song.artist.username} key={song.id} title={song.title} src='' isControllable={false} />
                    <br />
                </Box>
            ))
            : <CircularProgress />}

            {hasFailed && <Button component={Link} to='/' variant="outlined" sx={{ mt: 2 }} color="warning">Return to homepage</Button>}
        </>
    )
}

export default UserSongs