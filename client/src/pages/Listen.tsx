import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { AuthProps, Song } from "../types"
import axios from "axios"
import { API_BASE } from "../constants"
import SongList from "../Components/SongList"
import Title from "../Components/Title"



const Listen = ({ setDanger }: AuthProps) => {
    const [songs, setSongs] = useState<Song[] | null>(null)

    useEffect(() => {

        axios.get(`${API_BASE}/api/music`)
            .then(res => setSongs(res.data.reverse()))
            .catch(e => {
                setDanger("Error in loading songs")
                console.error('virhe', e)
            })
    }, [])

    return (
        <>
            <Title title="New songs" />
            <Typography sx={{ mb: 1 }} variant="h1">
                New songs
            </Typography>

            <SongList songs={songs} />
        </>
    )
}


export default Listen