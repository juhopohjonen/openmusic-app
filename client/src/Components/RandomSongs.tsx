import { useEffect, useState } from "react"
import { Song } from "../types"
import axios from "axios"
import { API_BASE } from "../constants"
import { Box, Card, CardContent, CardMedia, Grid, Grow, Skeleton, Typography } from "@mui/material"
import { Link } from "react-router-dom"

const getRandomSongs = (songs: Song[]) => {
    return songs.sort(() => 0.5 - Math.random()).slice(0, 3)
}

const RandomSongs = ({ showHeader=true}: { showHeader?: boolean }) => {
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


    return (
        <Grow in={songs.length > 0} timeout={1000}>
            <Box>
                {showHeader && (
                    <Typography variant="h5" component='div' gutterBottom>
                        Some of our song catalog.
                    </Typography>
                )}
                <Box sx={{ mt: 2, mb: 1 }}>
                    <Grid container spacing={2} >

                        {songs && songs.map((song) => (
                            <Grid component={Link} to={`/listen/${song.id}`} sx={{ textDecoration: 'none' }} item key={song.id} xs={4}>
                                <Box>
                                    <SongHero song={song} />
                                </Box>
                            </Grid>
                        ))}

                    </Grid>
                </Box>
            </Box>
        </Grow>
    )
}

const SongHero = ({ song }: { song: Song }) => {

    const [isLoaded, setLoaded] = useState(false)

    return (
        <Card
            sx={
                { '&:hover': {
                    border: 1,
                    borderColor: 'primary.main',
                    borderWidth: 1.5,
                },
                transition: 'border 0.3s linear',
            }}
        >
            {!isLoaded && <Skeleton variant="rectangular" animation="wave" height={100} width='100%' />}
            
            <CardMedia
                image={`${API_BASE}/api/stream/song/${song.id}/cover`}
                sx={{ height: 100, width: '100%', display: isLoaded ? '' : 'none' }}
                component='img'
                onLoad={() => setLoaded(true)}
            />



            <CardContent>
                <Typography variant="h6" component='div'>
                    {song.title}
                </Typography>
            </CardContent>
        </Card>

    )

}

export default RandomSongs