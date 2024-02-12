import { CircularProgress, Grid, Typography } from "@mui/material";
import { Song } from "../types";
import { Link } from "react-router-dom";
import SongCard from "./SongCard";
import { API_BASE } from "../constants";

const linkStyle = {
    color: 'white',
    textDecoration: 'none'
}

const SongList = ({ songs }: { songs: Song[] | null }) => {
    if (!songs) {
        return <CircularProgress />
    }

    return (
        <>
            <Grid container spacing={2}>
            {songs.map(song => (
                <Grid item key={song.id} component={Link} to={`/listen/${song.id}`} sx={{ textDecoration: 'none' }}>
                    <SongCard isControllable={false} title={song.title} artist={song.artist.username} src={`${API_BASE}/api/stream/${song.id}`} />
                </Grid>
            ))}
            </Grid>
        </>
    )
}

export default SongList