import { Typography } from "@mui/material"
import { AuthProps } from "../types"
import { Navigate } from "react-router-dom"
import Title from "../Components/Title"

const MyProfile = ({ auth }: AuthProps) => {
    if (!auth) {
        return <Navigate to='/login' />
    }

    return (
        <>
            <Title title="My profile" />
            <Typography variant="h2" component='h1'>
                Welcome to your profile, {auth.username}
            </Typography>
        </>
    )
}

export default MyProfile