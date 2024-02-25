import ShareIcon from '@mui/icons-material/Share';
import { IconButton } from '@mui/material';
import { Song } from '../types';
import { CLIENT_URI } from '../constants';

const ShareSongButton = ({ song }: { song: Song }) => {
    const doesDeviceAllowShare = Boolean(navigator.share)
    const listenToUri = `${CLIENT_URI}/listen/${song.id}`


    if (!doesDeviceAllowShare) {
        return <></>
    }

    const share = () => {
        navigator.share({
            title: `Listen to ${song.title} at OpenMusic!`,
            url: listenToUri
        })
    }

    return (
        <>
            <IconButton onClick={share}>
                <ShareIcon />
            </IconButton>
        </>
    )  
}

export default ShareSongButton