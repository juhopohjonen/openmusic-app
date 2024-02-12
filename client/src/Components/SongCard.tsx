import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material"
import { useRef, useState } from "react"

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import LoopIcon from '@mui/icons-material/Loop';

import example from './example.png'


const SongCard = ({ title, artist, src, isControllable=true }: { title: string, artist: string, src: string, isControllable?: boolean }) => {

    const [isPlaying, setPlaying] = useState(false)
    const [isLoop, setLoop] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

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
        <Card sx={{ display: 'flex', width: '300px', height: '150px' }}>

            <CardMedia
                component="img"
                sx={{ width: 100 }}
                image={example}
                alt="Live from space album cover"
            />

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                

                <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography variant='h5' component='div' sx={{ textDecoration: 'none' }}>
                    {title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component='div'>
                    {artist}
                </Typography>
                
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

            <audio src={src} ref={audioRef} hidden />
        </Card>
    )
}

export default SongCard