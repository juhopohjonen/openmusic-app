import { Button, Typography } from "@mui/material"
import { AuthProps } from '../types'

const Index = ({ auth, logout }: AuthProps) => {
    return (
        <>
            <Typography variant="h1">Music service</Typography>
            <Typography variant="body1" sx={{ mb: 4 }} component='p' color='text.secondary'>
                OpenMusic is a platform where musicians around the world can upload their own music and listen to amazing songs.
            </Typography>

            {
                !auth ? (
                    <></>
                ) : <Button variant="outlined" color="error" onClick={() => logout()}>Logout</Button>
            }
 
        </>
    )
}

export default Index