import { CircularProgress, Typography } from "@mui/material";
import { Song } from "../types";
import { Link } from "react-router-dom";

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
            {songs.map(song => (
                <Typography paragraph key={song.id}><Link style={linkStyle} to={`/listen/${song.id}`}>{song.title}</Link></Typography>
            ))}
        </>
    )
}

export default SongList