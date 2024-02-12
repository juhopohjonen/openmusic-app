import { Button, TextField, Typography, styled } from "@mui/material"
import RequireAuth from "../Components/RequireAuth.tsx"
import { getAuth } from "../utils.ts"

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { API_BASE } from "../constants.ts";
import { AuthProps } from "../types.ts";
import { Navigate } from "react-router-dom";


const Upload = ({ auth }: AuthProps) => {

    if (!auth) {
        return (
            <>
                <Navigate to='/login' />
            </>
        )
    }

    const sendUploadRequest = (song: any, songTitle: any) => {
        const formData = new FormData()
        formData.append("song", song)
        formData.append("title", songTitle)


        console.log(auth.token)

        axios.post(`${API_BASE}/api/music`, formData, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                "Content-Type": 'multipart/form-data'
            }
        })
    }

    return (
        <>
            <RequireAuth />
            <Typography gutterBottom variant="h1">
                Upload music
            </Typography>

            <UploadMusicForm sendReqFunc={sendUploadRequest} /> 
        </>
    )
}

const UploadMusicForm = ({ sendReqFunc }: { sendReqFunc: Function }) => {
    const [songName, setSongName] = useState('')
    const [songInput, setSongInput] = useState<File | null>(null)

    // see https://mui.com/material-ui/react-button/#file-upload

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });
      
    const fileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files){
            setSongInput(e.target.files[0])
        }
    }

    const isFormValid = (): boolean => {
        if (!songInput || !songName) {
            return false
        }

        return true
    }

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!isFormValid()) {
            return
        }

        sendReqFunc(songInput, songName)
    }

    return (
        <form onSubmit={submitForm}>
            <TextField
                type="text"
                placeholder="Song title"
                sx={{ mb: 2 }}
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
            />

            <Typography gutterBottom paragraph>Your artist name will be shown as <i>{getAuth()?.username}</i>.</Typography>

            <Button component="label" color="success" variant="outlined" startIcon={<CloudUploadIcon />}>
                Upload song
                <VisuallyHiddenInput onChange={fileChange} type="file" />
            </Button>

            {
                songInput ? <p>file "{songInput.name}" is loaded</p> : <p>please upload file</p>
            }

            <Button
                disabled={!isFormValid()}
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                type="submit"
            >
                Publish
            </Button>
        </form>
    )
}

export default Upload