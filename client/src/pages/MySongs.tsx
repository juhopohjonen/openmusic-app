import { Box, CircularProgress, Typography } from "@mui/material"
import RequireAuth from "../Components/RequireAuth"
import { AuthProps, Song } from "../types"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_BASE } from "../constants"
import SongCard from "../Components/SongCard"
import { Link } from "react-router-dom"

const MySongs = ({ auth }: AuthProps) => {

    const [songs, setSongs] = useState<Song[]>()

    if (!auth) {
        return <RequireAuth />
    }
    
    useEffect(() => {
        axios.get(`${API_BASE}/api/user/${auth.username}/songs`)
            .then(res => setSongs(res.data))
            .catch(err => console.error(err))

    }, [])

    console.log(songs)

    return (
        <>
            <RequireAuth />
            <Typography variant="h2" component='h1' gutterBottom>My songs</Typography>

            {
                songs
                    ? songs.map(song => (
                        <Box component={Link} to={`/listen/${song.id}`} sx={{ color: 'text.primary', textDecoration: 'none' }}>
                            <SongCard artist={song.artist.username} key={song.id} title={song.title} src='' isControllable={false} />
                            <br />
                        </Box>
                    ))
                    : <CircularProgress />
            }
        </>
    )
}

export default MySongs