import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Button, Tooltip, Avatar, Link as MuiLink} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthContextItf } from '../utils/interfaces';
import slugify from 'react-slugify';


export const Navbar:React.FC = () => {

  const menu = ['Profile', 'Account', 'Your Companies']

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { currentUser, userInfo, logout } = useAuth() as AuthContextItf
  

  const pages = ['Products', 'Pricing', 'Blog'];

  
  

  console.log({currentUser, userInfo});

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogut = () => {
    setAnchorElUser(null)
    try {
      logout()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AppBar position="static" enableColorOnDark color="primary">
        <Toolbar>
          <MuiLink component={Link} to="/" underline="none" color="inherit">
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Work At Home
            </Typography>
          </MuiLink>
          

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => setAnchorElNav(null)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              color="inherit"
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none', textDecoration: 'none' } }}
            >
              Work At Home
            </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => setAnchorElNav(null)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {currentUser ? (
              <>
                <Tooltip title="Open menu">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Profile Picture" src={currentUser.photoURL ? currentUser.photoURL : ""} sx={{bgcolor:'#fff'}}>
                      {!currentUser.photoURL && currentUser.displayName?.slice(0,2)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                >
                  {menu.map((menuItem) => (
                    <MuiLink 
                      key={menuItem} 
                      component={Link} 
                      to={menuItem === 'Profile' ? slugify(menuItem.toLowerCase()) + '/' + currentUser.uid : slugify(menuItem.toLowerCase())} 
                      textAlign="center" 
                      underline='none' 
                      color="inherit"
                    >
                      <MenuItem onClick={() => setAnchorElUser(null)}>
                        {menuItem}
                      </MenuItem>
                    </MuiLink>
                  ))}
                  <MenuItem onClick={() => handleLogut()}>
                      <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <MuiLink component={Link} to="/login" underline='none' color="inherit">
                <Button color="inherit">Login</Button>
              </MuiLink>
            )}
            
          </Box>
        </Toolbar>

    </AppBar>
  );
};