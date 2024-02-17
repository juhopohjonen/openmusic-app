import { Typography } from "@mui/material"
import axios from "axios"
import { useParams } from "react-router-dom"
import { API_BASE } from "../constants"
import { useEffect, useState } from "react"
import { AuthProps, Playlist } from "../types"
import SongList from "../Components/SongList"

const ViewPlaylist = ({ setDanger }: AuthProps) => {
    const { id } = useParams()
    if (!id) {
        return <p>404</p>
    }

    const [playlist, setPlaylist] = useState<Playlist | null>(null)

    useEffect(() => {
        axios.get<Playlist>(`${API_BASE}/api/playlist/${id}`)
            .then(res => setPlaylist(res.data))
            .catch(err => {
                setDanger('Playlist could not be found')
                console.error(err)
            })
    }, [])


    
    return (
        <>
            <Typography variant="h2" gutterBottom>View playlist</Typography>
            { 
                playlist && <SongList songs={playlist.songs} />
            }
        </>
    )
}

export default ViewPlaylist