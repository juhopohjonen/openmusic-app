import { useEffect, useState } from "react"
import { Song } from "../types"
import axios from "axios"
import { API_BASE } from "../constants"
import { Box, Card, CardContent, CardMedia, Fade, Grid, Typography, Zoom } from "@mui/material"
import { Link } from "react-router-dom"

const getRandomSongs = (songs: Song[]) => {
    return songs.sort(() => 0.5 - Math.random()).slice(0, 3)
}

const RandomSongs = () => {
    const [songs, setSongs] = useState<Song[] | null>([])

    useEffect(() => {
        axios.get<Song[]>(`${API_BASE}/api/music/`)
            .then(res => setSongs(getRandomSongs(res.data)))
            .catch(err => {
                return console.log('err!', err)
            })
    }, [])


    if (!songs || songs.length === 0) {
        return <></>
    }

    const getDelay = (index: number) => `${(250 * (index + 1)).toString()}ms`

    return (
        <Fade in={songs.length > 0}>
            <Box>
                <Typography variant="h5" component='div' gutterBottom>
                    Some of our song catalog.
                </Typography>

                <Box sx={{ mt: 2, mb: 1 }}>
                    <Grid sx={{ display: 'flex' }} container spacing={2} >

                        {songs && songs.map((song, i) => (
                            <Grid component={Link} to={`/listen/${song.id}`} sx={{ textDecoration: 'none' }} item key={song.id} xs={4}>
                                <Zoom in={true} style={{ transitionDelay: getDelay(i) }}>
                                    <Box>
                                        <SongHero song={song} />
                                    </Box>
                                </Zoom>
                            </Grid>
                        ))}

                    </Grid>
                </Box>
            </Box>
        </Fade>
    )
}

const SongHero = ({ song }: { song: Song }) => (

    <Card>
        <CardMedia
            image={`${API_BASE}/api/stream/song/${song.id}/cover`}
            sx={{ height: 100, width: '100%' }}
        />

        <CardContent>
            <Typography variant="h6" component='div'>
                {song.title}
            </Typography>
        </CardContent>
    </Card>
)

export default RandomSongs