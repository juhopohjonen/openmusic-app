import { Button, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { AuthProps } from '../types'
import { logoutUser } from "../utils"

const Index = ({ auth, setAuth }: AuthProps) => {
    return (
        <>
            <Typography variant="h1">Music service</Typography>
            <Typography variant="body1" sx={{ mb: 4 }} component='p' color='text.secondary'>
                OpenMusic is a platform where musicians around the world can upload their own music and listen to amazing songs.
            </Typography>

            {
                !auth ? (
                    <></>
                ) : <Button variant="outlined" color="error" onClick={() => logoutUser(setAuth)}>Logout</Button>
            }
 
        </>
    )
}

export default Index