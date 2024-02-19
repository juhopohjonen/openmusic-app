import { Typography } from "@mui/material"
import RequireAuth from "../Components/RequireAuth"
import { AuthProps } from "../types"

import UserSongs from "../Components/UserSongs"
import Title from "../Components/Title"

const MySongs = (props: AuthProps) => {

    if (!props.auth) {
        return <RequireAuth />
    }
    


    return (
        <>
            <Title title="My songs" />

            <RequireAuth />
            <Typography variant="h2" component='h1' gutterBottom>My songs</Typography>

            <UserSongs {...props} username={props.auth.username} />
        </>
    )
}

export default MySongs