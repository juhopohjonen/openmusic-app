import { AppBar, Container, CssBaseline, IconButton, Menu, MenuItem, ThemeProvider, Toolbar, Typography, createTheme } from "@mui/material"
import { Link, Outlet } from "react-router-dom"

import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from "react";

import UploadIcon from '@mui/icons-material/Upload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// the 

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
})

const Layout = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar />

            <Container sx={{ mt: 5 }}>
                <Outlet />
            </Container>
        </ThemeProvider>
    )
}

const MenuItems = ({ menuType }: { menuType: 'main' | 'user' }) => {
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

    const userMenuItems: MenuItemValues[] = [
        {
            title: 'Login',
            url: '/login'
        },
        {
            title: 'Signup',
            url: '/signup'
        }
    ]

    let items: MenuItemValues[] = []
    switch (menuType) {
        case 'main':
            items = menuItems
            break
        case 'user':
            items = userMenuItems
            break
    }

    return (
        <>
            {items.map(item => (
                <MenuItem component={Link} key={item.title} to={item.url}>{item.title}</MenuItem>
            ))}
        </>
    )
}

const Navbar = () => {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null)
    const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null)
    
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
                    <MenuItems menuType="main" />
                </Menu>

                <Typography component={Link} color='text.primary' to='/' variant="h6" sx={{ flexGrow: 1, textDecoration: 'none' }}>OpenMusic</Typography>

                <IconButton component={Link} to='/upload'>
                    <UploadIcon />
                </IconButton>

                <IconButton onClick={openUserMenu} sx={{ ml: 1 }}>
                    <AccountCircleIcon />
                </IconButton>
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
                    <MenuItems menuType="user" />
                </Menu>

            </Toolbar>
        </AppBar>
    )
}

export default Layout