import { Box, Button, Dialog, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { SignUpButton } from "../pages/Login"
import React, { SetStateAction } from "react"

interface LoginModalProps {
    isOpen: boolean,
    setClose: React.Dispatch<SetStateAction<boolean>>
}

const LoginModal = ({ isOpen, setClose }: LoginModalProps) => {
    return (
        <Dialog open={isOpen} onClose={setClose}>
            <Box sx={{ padding: 3 }}>
                <Typography variant='h4' component='div' align="center">Login</Typography>
                <Typography gutterBottom variant="subtitle1" align="center">An user account is required for this action.</Typography>            

                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                    <Button 
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to='/login'
                    >
                        Login
                    </Button>

                    <SignUpButton />
                </Box>
            </Box>
            
        </Dialog>

    )
}

export default LoginModal