import { Button, TextField, Typography } from "@mui/material"
import axios from "axios"
import { FormEvent, useEffect, useState } from "react"
import { API_BASE } from "../constants"
import { useNavigate } from "react-router-dom"
import { AuthState } from "../types"
import { getAuth } from "../utils"

const Login = ({ setAuth }: { auth: AuthState, setAuth: React.Dispatch<React.SetStateAction<AuthState>> }) => {
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
                setAuth(getAuth())
                navigate('/')
            })
            .catch(err => {
                console.error(err)
            })
            .then(_res => setLoading(false))
    }

    return (
        <>
           <Typography variant="h1">Login</Typography> 

            {
                loading ? <p>loading</p> : null
            }

           <form onSubmit={(e) => sendLoginRequest(e)}>
            <TextField sx={{ mb: 2 }} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <br />
            <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" sx={{ mb: 2 }} />

            <br />

            <Button variant="contained" type="submit">Login</Button>
           </form>
        </>
    )
}

export default Login