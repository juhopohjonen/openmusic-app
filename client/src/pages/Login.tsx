import { Button, Divider, TextField, Typography } from "@mui/material"
import axios from "axios"
import { FormEvent, useEffect, useState } from "react"
import { API_BASE } from "../constants"
import { Link, useNavigate } from "react-router-dom"
import { AuthProps } from "../types"
import { getAuth } from "../utils"

import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Login = ({ setAuth, setDanger, setSuccess }: AuthProps) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (getAuth()) {
            navigate('/')
        }

        console.log('auth', getAuth())

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
           <Typography variant="h1" gutterBottom>Login</Typography> 

            {
                loading ? <p>loading</p> : null
            }

           <form onSubmit={(e) => sendLoginRequest(e)}>
            <TextField sx={{ mb: 2 }} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <br />
            <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" sx={{ mb: 2 }} />

            <br />

            <Button variant="outlined" type="submit">Login</Button>

            
           </form>

           <Divider sx={{ width: 300, mt: 2, maxWidth: '100%', mb: 2 }} />

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

        </>
    )
}

export default Login