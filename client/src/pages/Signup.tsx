import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, TextField, Typography } from "@mui/material";
import { AuthProps } from "../types";
import axios, { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuth } from "../utils";
import { API_BASE } from "../constants";
import Title from "../Components/Title";

const Signup = ({ setAuth, setDanger, setSuccess }: AuthProps) => {

    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [acceptBoxChecked, setBoxChecked] = useState(false) 

    const [incorrectUsername, setIncorrectUsername] = useState<string | false>(false) 

    const navigate = useNavigate()

    if (getAuth()) {
        return <Navigate to='/' />
    }

    useEffect(() => {
        if (username) {
            axios.post(`${API_BASE}/api/validate/username`, {
                username
            })
                .then(res => {
                    const { code } = res.data
                    setIncorrectUsername(false) 

                    switch (code) {
                        case "USER_EXISTS":
                            return setIncorrectUsername('User already exists.')
                        case "NOT_VALID":
                            return setIncorrectUsername("This username is not valid.")
                        case "VALID":
                            break
                        default:
                            return setDanger("Error in handling username validation.")
                    }
                })
                
                .catch((err: AxiosError) => {
                    console.error(err)
                    return setDanger('Error in trying to validate username.')
                })
        } else {
            setIncorrectUsername(false)
        }
    }, [username])

    const passwordsMatch = (): boolean => password === passwordRepeat

    const isFormValid = (): boolean => {
        if (!username || !password || !acceptBoxChecked || incorrectUsername || !passwordsMatch()) {
            return false
        }

        return true
    }

    const sendLoginRequest = (e: FormEvent<HTMLFormElement>): void => {
        if (!isFormValid()) {
            return
        }

        e.preventDefault()

        setLoading(true)

        axios.post(`${API_BASE}/api/user`, {
            username,
            password
        })
            .then(res => {
                const { creds } = res.data
                window.localStorage.setItem('auth', JSON.stringify({ token: creds.token, expiresIn: creds.expiresIn, username: creds.username }))
                setAuth(getAuth())
                setSuccess('Account created succeed! Welcome!')
                navigate('/')
            })
            .catch(err => {
                console.error(err.response)

                if (err && err.response && err.response.status && err.response.status === 409) {
                    return setDanger('User with given username already exists.')
                }

                return setDanger("Couldn't create user account. Please try again in a few hours.")

            })
            .then(_res => setLoading(false))
    }

    return (
        <>
            <Title title="Sign up" />

            <Typography variant='h1' gutterBottom>Sign up</Typography>

            {
                loading ? <CircularProgress /> : null
            }

            <form onSubmit={sendLoginRequest}>
                <TextField
                    placeholder="Your new username"
                    type="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    sx={{ mb: 2 }}
                    error={Boolean(incorrectUsername)}
                    helperText={
                        incorrectUsername 
                            ? incorrectUsername
                            : "Only characters a-z allowed"

                    }
                />

                <br />

                <TextField
                    type="password"
                    placeholder="An unique password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    helperText="Minium 8 characters"
                />

                <br />

                <TextField
                    type="password"
                    placeholder="Repeat password"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    sx={{ mb: 2 }}
                    error={passwordRepeat.length > 0 && !passwordsMatch()}
                    helperText={(passwordRepeat.length > 0 && !passwordsMatch()) && "Passwords don't match."}
                />

                <br />

                <FormGroup sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={acceptBoxChecked}
                                onChange={(e) =>setBoxChecked(e.target.checked)}
                            />
                        )}
                        label="I accept the privacy policy"
                    />
                </FormGroup>



                <Button
                    disabled={!isFormValid()}
                    type="submit"
                    variant="outlined"
                >
                    Sign up
                </Button>
                
            </form>
        </>
    )
}

export default Signup