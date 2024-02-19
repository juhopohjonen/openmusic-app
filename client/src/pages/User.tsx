import { Typography } from "@mui/material"
import { Navigate, useParams } from "react-router-dom"
import UserSongs from "../Components/UserSongs"
import { AuthProps } from "../types"
import Title from "../Components/Title"

const User = (authProps: AuthProps) => {
    const { username } = useParams()
    if (!username) {
        return <Navigate to='/' />
    }

    return (
        <>
            <Title title={username} />
            <Typography variant="h2" component='h1' gutterBottom>User {username}</Typography>
            <Typography variant="h5" component='p' gutterBottom>User {username}'s songs</Typography>
            <UserSongs {...authProps} username={username} />
        </>
    )
}

export default User
