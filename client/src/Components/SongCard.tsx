import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material"
import { useRef, useState } from "react"

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import LoopIcon from '@mui/icons-material/Loop';

import { Link } from "react-router-dom";
import { Song } from "../types";
import { API_BASE } from "../constants";

interface SongCardProps extends Song {
    isControllable?: boolean
}

const SongCard = ({ title, artist, id, isControllable=true }: SongCardProps) => {

    const src = `${API_BASE}/api/stream/song/${id}`


    const [isPlaying, setPlaying] = useState(false)
    const [isLoop, setLoop] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    const [fullImage, setFullImage] = useState(false)
    const fullImageCheck = () => setFullImage(!fullImage)

    const changeLoop = () => setLoop(!isLoop)


    if (isPlaying && audioRef.current) {
        audioRef.current.play()
    } else if (audioRef.current) {
        audioRef.current.pause()
    }

    const changePlayStatus = () => {
        if (isPlaying) {
            return setPlaying(false)
        }

        return setPlaying(true)
    }

    const toAudioStart = () => {
        if (!audioRef.current) {
            return
        }

        audioRef.current.currentTime = 0
    }

    if (audioRef && audioRef.current) {
        audioRef.current.onended = () => {
            if (isLoop) {
                toAudioStart()
                setPlaying(true)
                if (audioRef.current) {
                    audioRef.current.play()
                }

                return
            }

            toAudioStart()
            setPlaying(false)
        }
    }

    return (
        <Card sx={{ display: 'flex', width: '300px', minHeight: '150px' }}>

            <CardMedia
                component="img"
                sx={{ width: fullImage ? 200 : 120, transition: '1s', height: 200 }}
                src={`${src}/cover`}
                alt="Live from space album cover"
                onClick={fullImageCheck}
            />


            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                

                <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography variant='h5' component='div' sx={{ textDecoration: 'none' }}>
                    {title}
                </Typography>

                {
                    isControllable ? (
                        <Typography component={Link} to={`/user/${artist.username}`} variant="subtitle1" color="text.secondary">
                            {artist.username}
                        </Typography>
                    ) : <UncontrollableUserInfo username={artist.username} />
                }


                
                </CardContent>

                {
                    isControllable && (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            <IconButton onClick={toAudioStart} aria-label="previous">
                                <SkipPreviousIcon />
                            </IconButton>
                            <IconButton onClick={changePlayStatus} aria-label="play/pause">
                                {
                                    isPlaying ? <PauseIcon sx={{ height: 38, width: 38 }} /> : <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                                }
                                
                            </IconButton>

                            <IconButton aria-label="loop" onClick={changeLoop}>
                                <LoopIcon color={isLoop ? 'primary' : 'inherit'} />
                            </IconButton>


                            </Box>

                        </>
                    )
                }



            </Box>

            {isControllable && <audio src={src} ref={audioRef} hidden />}
        </Card>
    )
}

const UncontrollableUserInfo = ({ username }: { username: string }) => {
    return <Typography variant="subtitle1" color="text.secondary">by {username}</Typography>
}


 
export default SongCard