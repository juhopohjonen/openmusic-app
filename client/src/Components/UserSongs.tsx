import { useEffect, useState } from "react"
import { AuthProps, Song } from "../types"
import { Button, CircularProgress, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_BASE } from "../constants"
import { PlaylistSongList } from "../pages/ViewPlaylist"

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
            {songs ? <PlaylistSongList songs={songs} /> : <CircularProgress />}
            {hasFailed && <FailDisplayer />}

            
        </>
    )
}

const FailDisplayer = () => {
    return (
        <>
            <Typography paragraph>
                This user couldn't be found. You can return to homepage.
            </Typography>

            <Button component={Link} to='/' variant="outlined" sx={{ mt: 2 }} color="warning">Return to homepage</Button>
        </>
    )
}

export default UserSongs