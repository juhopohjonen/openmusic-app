import { IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import axios from "axios"
import { useParams } from "react-router-dom"
import { API_BASE } from "../constants"
import { SetStateAction, useEffect, useRef, useState } from "react"
import { AuthProps, Playlist, Song } from "../types"

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Title from "../Components/Title"


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
            <Title title={playlist ? playlist.title : 'View playlist'} />
            <Typography variant="h2" sx={{ mb: 0.5 }}>View playlist <b>{playlist && playlist.title}</b></Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>This playlist is created by {playlist && playlist.author.username}</Typography>
            { 
                playlist && <PlaylistSongList songs={playlist.songs} />
            }

        </>
    )
}

export const PlaylistSongList = ({ songs }: { songs: Song[] }) => {
    const [songIdPlaying, setSongIdPlaying] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    const src =
        songIdPlaying 
            ? `${API_BASE}/api/stream/song/${songIdPlaying}`
            : null



    

    useEffect(() => {
        if (songIdPlaying && audioRef.current !== null) {
            audioRef.current.play()
            audioRef.current.onended = () => {
                const songIds = songs.map(s => s.id)
    
                const currentIndex = songIds.indexOf(songIdPlaying)
    
                console.log(currentIndex, songIds.length)

                // continue to next song after playing song
                
                if (currentIndex + 1 > (songIds.length - 1)) {
                    return setSongIdPlaying(songs[0].id)
                }
    
                setSongIdPlaying(songs[currentIndex + 1].id)
            }
        }


    }, [songIdPlaying])



    return (
        <>
            <List sx={{ bgcolor: 'background.paper' }}>
                {songs.map(song => (
                    <PlaylistSong 
                        song={song} 
                        songIdPlaying={songIdPlaying} 
                        setSongIdPlaying={setSongIdPlaying}
                        key={song.id}
                    />
                ))}
            </List>

            {
                src && <audio src={src} ref={audioRef} hidden />
            }
        </>
    )
}

interface PlaylistSongProps {
    song: Song,
    songIdPlaying: string | null,
    setSongIdPlaying: React.Dispatch<SetStateAction<string | null>>,
}

const PlaylistSong = ({ song, songIdPlaying, setSongIdPlaying }: PlaylistSongProps) => {


    const thisSongPlaying = songIdPlaying === song.id
    const changePlayState = () => {
        if (thisSongPlaying) {
            return setSongIdPlaying(null)
        }

        setSongIdPlaying(song.id)
    }

    const titleColor =
        thisSongPlaying ? 'primary.main' : undefined



    return (
        <ListItem>

            <ListItemIcon>
                <IconButton onClick={changePlayState}>
                    {
                        thisSongPlaying ? <PauseIcon /> : <PlayArrowIcon />

                    }
                </IconButton>
            </ListItemIcon>
            <ListItemText
                primaryTypographyProps={{
                    color: titleColor
                }}

                primary={song.title}
                secondary={`by ${song.artist.username}`}
            />
        </ListItem>
    )
}


export default ViewPlaylist