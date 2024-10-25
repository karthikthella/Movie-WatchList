import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Videocam as VideocamIcon, Menu as MenuIcon, Person as PersonIcon } from '@mui/icons-material';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [userAnchorEl, setUserAnchorEl] = useState(null);

    const handleClickWatchlist = () => navigate("/watchlist");
    const handleClickWatched = () => navigate("/watched");
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        handleCloseUserMenu();
    };

    const handleMenuClick = (event) => setMenuAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setMenuAnchorEl(null);

    const handleUserIconClick = (event) => setUserAnchorEl(event.currentTarget);
    const handleCloseUserMenu = () => setUserAnchorEl(null);

    return (
        <div className='main-nav-container'>
            <div className="nav-container">
                <div className="logo">
                    <div className="logo1">
                        <VideocamIcon />
                        <p>WatchNow</p>
                    </div>


                    <Typography className="navbar-button" onClick={handleClickWatchlist}>Watchlist</Typography>
                    <Typography className="navbar-button" onClick={handleClickWatched}>Watched</Typography>
                </div>

                <div className="user">
                    {token ? (
                        <>
                            <IconButton onClick={handleUserIconClick} aria-label="user menu">
                                <PersonIcon />
                            </IconButton>
                            <Menu anchorEl={userAnchorEl} open={Boolean(userAnchorEl)} onClose={handleCloseUserMenu}>
                                <MenuItem onClick={handleClickWatchlist}>Watchlist</MenuItem>
                                <MenuItem onClick={handleClickWatched}>Watched</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button variant='outlined' size='small' sx={{ backgroundColor: 'white', color: '#17a2b8' }} onClick={() => navigate('/')}>Login</Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
