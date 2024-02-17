import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Song } from "../types"
import axios from "axios"
import { API_BASE } from "../constants"
import SongList from "../Components/SongList"


const Listen = () => {
    const [songs, setSongs] = useState<Song[] | null>(null)

    useEffect(() => {
        axios.get(`${API_BASE}/api/music`)
            .then(res => setSongs(res.data))
            .catch(e => {
                console.error('virhe', e)
            })
    }, [])

    return (
        <>
            <Typography sx={{ mb: 1 }} variant="h1">
                New songs
            </Typography>

            <SongList songs={songs} />
        </>
    )
}


export default Listen