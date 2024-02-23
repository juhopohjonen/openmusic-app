import { Typography } from "@mui/material"
import Title from "../Components/Title"
import RandomSongs from "../Components/RandomSongs"

const Index = () => {
    return (
        <>
            <Title title="Home" />
            <Typography variant="h1">Music service</Typography>
            <Typography variant="body1" sx={{ mb: 4 }} component='p' color='text.secondary'>
                OpenMusic is a platform where musicians around the world can upload their own music and listen to amazing songs.
            </Typography>



            <RandomSongs />
 
        </>
    )
}

export default Index