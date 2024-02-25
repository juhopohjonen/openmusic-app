import { Box, Button, Divider, Paper, TextField, Typography } from "@mui/material"
import axios from "axios"
import { FormEvent, useEffect, useState } from "react"
import { API_BASE } from "../constants"
import { Link, useNavigate } from "react-router-dom"
import { AuthProps } from "../types"
import { getAuth } from "../utils"

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Title from "../Components/Title"
import { LoadingButton } from "@mui/lab"

const Login = ({ setAuth, setDanger, setSuccess }: AuthProps) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (getAuth()) {
            navigate('/')
        }

    }, [])



    const sendLoginRequest = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault()

        setLoading(true)

        axios.post(`${API_BASE}/api/login`, {
            username,
            password
        })
            .then(res => {
                const { creds } = res.data
                window.localStorage.setItem('auth', JSON.stringify({ token: creds.token, expiresIn: creds.expiresIn, username: creds.username }))

                const auth = getAuth()

                setAuth(auth)

                setSuccess(`You have successfullly logged in as ${auth?.username}`)
                navigate('/')
            })
            .catch(err => {
                let dangerMessage = "User couldn't be found with specified username and password."

                console.error(err)
                setDanger(dangerMessage)
            })
            .then(_res => setLoading(false))
    }

    return (
        <>
            <Title title="Login" />
            <Paper elevation={1} sx={{ p: 2 }}>
           <Box component='form' onSubmit={(e) => sendLoginRequest(e)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="h3" component='h1' gutterBottom>Login</Typography> 

            <TextField sx={{ mb: 2 }} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" sx={{ mb: 2 }} />


            {loading ? (<LoadingButton loading variant="outlined">Login</LoadingButton>) : <Button variant="outlined" type="submit">Login</Button>}

            

            
           </Box>
           </Paper>


           <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
           <Divider sx={{ width: 500, mt: 4, maxWidth: '100%', mb: 2 }} />


            <Typography
                component='h2'
                variant='h5'
                gutterBottom
            >
                    No user account - yet?
            </Typography>
            <Typography
                    variant="body1"
                    color='text.secondary'
                    gutterBottom

                >
                    Create one for free.
                </Typography>



            </Box>

        </>
    )
}

export const SignUpButton = () => (
    <Button 
        startIcon={<PersonAddIcon />}
        variant="outlined"
        color="secondary"
        sx={{ mt: 1 }}
        component={Link}
        to='/signup'
    >
        Sign up
    </Button>
)

export default Login