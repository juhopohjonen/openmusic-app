import { useParams } from 'react-router-dom'
import { API_BASE } from '../constants'
import SongCard from '../Components/SongCard'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Song } from '../types'
import SongCardSkeleton from '../Components/SongCardSkeleton'
import { Typography } from '@mui/material'


const ListenTo = () => {
    const { id } = useParams()
    const [song, setSong] = useState<Song | null>(null)

    useEffect(() => {
        axios.get<Song>(`${API_BASE}/api/music/${id}`)
            .then(res => setSong(res.data))
    }, [])



    console.log(song)

    return (
        <>

            <Typography gutterBottom variant='h1'>Listen to { song && song.title ? song.title : '...' }</Typography>

            {
                song ? <SongCard title={song.title} artist={song.artist.username} src={`${API_BASE}/api/stream/${id}`} /> : <SongCardSkeleton />
            }
            

        </>
    )
}

export default ListenTo