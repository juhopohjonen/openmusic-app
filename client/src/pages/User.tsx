import { Typography } from "@mui/material"
import { Navigate, useParams } from "react-router-dom"
import UserSongs from "../Components/UserSongs"
import { AuthProps } from "../types"

const User = (authProps: AuthProps) => {
    const { username } = useParams()
    if (!username) {
        return <Navigate to='/' />
    }

    return (
        <>
            <Typography variant="h2" component='h1' gutterBottom>User {username}</Typography>
            <Typography variant="h5" component='p' gutterBottom>User {username}'s songs</Typography>
            <UserSongs {...authProps} username={username} />
        </>
    )
}

export default User
