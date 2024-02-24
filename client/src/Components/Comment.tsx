import { Box, Icon, IconButton, Paper, Typography } from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveIcon from '@mui/icons-material/Delete'
import { Link } from "react-router-dom";
import { AuthProps, AuthState, CommentType } from "../types";
import axios from "axios";
import { API_BASE } from "../constants";
import { Dispatch, SetStateAction } from "react";


interface CommentElemProps extends AuthProps {
    username: string,
    content: string,
    commentId: string,
    auth: AuthState,
    songId: string,
    commentsStateChange: Dispatch<SetStateAction<CommentType[]>>,
    comments: CommentType[]
}

const CommentElem = (props: CommentElemProps) => {

    const { username, content, commentId, auth } = props

    return (
        <Paper id={commentId} sx={{ pt: 1, pl: 2, pb: 0.5, mb: 2, '&:hover': { boxShadow: 10 }, display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }}>
                <Typography component={Link} to={`/user/${username}`} sx={{ color: 'text.primary', textDecoration: 'none' }} variant="h5" gutterBottom>
                    <Icon sx={{ mt: 1, mr: 1 }}><AccountCircleIcon /></Icon>{username}
                </Typography>
                <Typography paragraph>{content}</Typography>
            </Box>

            {(auth && auth.username === username) && (
                <CommentRemoveButton {...props} />
            )}



        </Paper>
    )
}

const CommentRemoveButton = ({ auth, songId, commentId, commentsStateChange, comments, setSuccess, setDanger }: CommentElemProps) => {
    if (!auth) {
        return <></>
    }

    const removeComment = () => {
        axios.delete(`${API_BASE}/api/music/${songId}/comment/${commentId}`, { headers: {
            Authorization: `Bearer ${auth.token}`
        } })
            .then(() => {
                setSuccess('Comment removed successfully.')                

                commentsStateChange(
                    comments.filter(comment => comment.id !== commentId)
                )
            })
            .catch(err => {
                console.error(err)
                return setDanger('Something happened in removing comment.')
            })
    }

    return (
        <Box>
            <IconButton
                onClick={removeComment}
                color="error"
            >
                <RemoveIcon />
            </IconButton>
        </Box>
    )
}


export default CommentElem