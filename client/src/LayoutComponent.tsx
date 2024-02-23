import { Alert, AppBar, Box, Button, Collapse, Container, CssBaseline, Divider, IconButton, Menu, MenuItem, ThemeProvider, Toolbar, Typography, createTheme } from "@mui/material"
import { Link, Outlet } from "react-router-dom"
import { Helmet } from 'react-helmet'

import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from "react";

import UploadIcon from '@mui/icons-material/Upload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AlertProps, AuthProps, MenuItemValues } from "./types";

import '@fontsource/roboto/500.css';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#18ff9b'
        },
        secondary: {
            main: '#fc77c7'
        }
    },

})


const Layout = (props: AuthProps) => {
    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>OpenMusic</title>
            </Helmet>

            <CssBaseline />
            <Navbar {...props} />
            <Alerts {...props} />

            <Container sx={{ mt: 5, mb: 4 }}>
                <Outlet />
            </Container>
        </ThemeProvider>
    )
}

const Alerts = ({ successAlert, dangerAlert }: AlertProps) => {
    return (
        <>
            <AnimatedAlert
                msg={successAlert}
                severity="success"
            />

            <AnimatedAlert
                msg={dangerAlert}
                severity="error"
            />


        </>
    )
}

const AnimatedAlert = ({ msg, severity }: { msg: string | null, severity: 'error' | 'success' }) => (
    <div>
        <Collapse in={Boolean(msg)}>
            {
                
                <Alert
                    severity={severity}
                >
                    {msg && msg}
                </Alert>
                
            }
        </Collapse>
    </div>
)

const MenuItems = ({ setItems }: { setItems?: MenuItemValues[] }) => {
    interface MenuItemValues {
        title: string,
        url: string,
        requireLogin?: boolean
    }

    const menuItems: MenuItemValues[] = [
        {
            title: 'Home',
            url: '/'
        },
        {
            title: 'Listen',
            url: '/listen'
        },
    ]

    let items: MenuItemValues[] = setItems || menuItems

    return (
        <>
            {items.map(item => (
                <MenuItem component={Link} key={item.title} to={item.url}>{item.title}</MenuItem>
            ))}
        </>
    )
}

const Navbar = ({ auth, logout }: AuthProps) => {

    const [anchor, setAnchor] = useState<null | HTMLElement>(null)
    const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null)

    const loggedInMenu: MenuItemValues[] = [
        {
            url: '/profile',
            title: 'My profile'
        },
        {
            url: '/playlists/my',
            title: 'My playlists'
        }
    ]

    const loggedOutMenu: MenuItemValues[] = [
        {
            url: '/login',
            title: 'Login'
        },

        {
            url: '/signup',
            title: 'Sign up'
        }
    ]

    
    const closeMenu = () => {
        setAnchor(null)
        setUserAnchor(null)
    }

    const openMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchor(e.currentTarget)
    }

    const openUserMenu = (e: React.MouseEvent<HTMLElement>) => {
        setUserAnchor(e.currentTarget)
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={openMenu}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    anchorEl={anchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={Boolean(anchor)}
                    onClose={closeMenu}
                >
                    <MenuItems />
                </Menu>

                <Typography component={Link} color='text.primary' to='/' variant="h6" sx={{ flexGrow: 1, textDecoration: 'none' }}>OpenMusic</Typography>

                {
                    auth && ( 
                        <IconButton component={Link} to='/upload'>
                            <UploadIcon />
                        </IconButton>
                    )

                }
                
                {
                    auth ? (
                        <IconButton onClick={openUserMenu} sx={{ ml: 1 }}>
                            <AccountCircleIcon />
                        </IconButton>
                        
                        
                    ) : <Button component={Link} to='/login' variant="contained">Sign in</Button>
                }


                <Menu
                    anchorEl={userAnchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    open={Boolean(userAnchor)}
                    onClose={closeMenu}
                >
                    {auth ? <MenuItems setItems={loggedInMenu} /> : <MenuItems setItems={loggedOutMenu} /> }

                    <Divider />

                    <Box sx={{ paddingLeft: 1, paddingRight: 1, marginTop: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            sx={{ width: '100%' }}
                            onClick={() => logout()}
                        >
                            Logout
                        </Button>
                    </Box>

                </Menu>

            </Toolbar>
        </AppBar>
    )
}

export default Layout