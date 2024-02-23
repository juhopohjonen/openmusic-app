import { Icon, Paper, Typography } from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";


const CommentElem = ({ username, content }: { username: string, content: string }) => {
    return (
        <Paper sx={{ pt: 1, pl: 2, pb: 0.5, mb: 2, '&:hover': { boxShadow: 10 } }}>
                <Typography component={Link} to={`/user/${username}`} sx={{ color: 'text.primary', textDecoration: 'none' }} variant="h5" gutterBottom>
                    <Icon sx={{ mt: 1, mr: 1 }}><AccountCircleIcon /></Icon>{username}
                </Typography>
                <Typography paragraph>{content}</Typography>
        </Paper>
    )
}

export default CommentElem