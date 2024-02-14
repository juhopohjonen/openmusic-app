import { Typography } from "@mui/material"
import { AuthProps } from "../types"
import { Navigate } from "react-router-dom"

const MyProfile = ({ auth }: AuthProps) => {
    if (!auth) {
        return <Navigate to='/login' />
    }

    return (
        <>
            <Typography variant="h2" component='h1'>
                Welcome to your profile, {auth.username}
            </Typography>
        </>
    )
}

export default MyProfile