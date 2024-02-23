import { CircularProgress, Grid } from "@mui/material";
import { Song } from "../types";
import { Link } from "react-router-dom";
import SongCard from "./SongCard";



const SongList = ({ songs }: { songs: Song[] | null }) => {
    if (!songs) {
        return <CircularProgress />
    }

    return (
        <>
            <Grid container spacing={2}>
            {songs.map(song => (
                <Grid item key={song.id} component={Link} to={`/listen/${song.id}`} sx={{ textDecoration: 'none' }}>
                    <SongCard isControllable={false} {...song} />
                </Grid>
            ))}
            </Grid>
        </>
    )
}

export default SongList