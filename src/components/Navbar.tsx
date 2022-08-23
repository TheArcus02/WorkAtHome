import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Button, Tooltip, Avatar, Link as MuiLink, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthContextItf } from '../utils/interfaces';
import slugify from 'react-slugify';
import { Edit, Logout, NotificationsOutlined } from '@mui/icons-material';


export const Navbar: React.FC = () => {

  const initialPages = ['Offers', 'Pricing', 'Blog'];
  const initialMenu = ['Profile']


  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [pages, setPages] = useState<string[]>(initialPages)
  const [menu, setMenu] = useState<string[]>(initialMenu)

  const { currentUser, userInfo, logout } = useAuth() as AuthContextItf

  console.log({ currentUser, userInfo });

  useEffect(() => {
    if (userInfo) {
      if (!menu.includes('Your Job Applications')) {
        userInfo.jobApplications.length > 0 &&
          setMenu((prev) => ([...prev, 'Your Job Applications']))
      }

      if (!menu.includes('Your Companies') &&
        !menu.includes('Create Company')) {

        userInfo.companies.length > 0 ?
          setMenu((prev) => ([...prev, 'Your Companies', 'Your Job Offers'])) :
          setMenu((prev) => ([...prev, 'Create Company']))
      }



    }
  }, [userInfo])


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
            aria-label="menu"
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
              <MuiLink
                key={page}
                component={Link}
                to={slugify(page.toLowerCase())}
                textAlign="center"
                underline='none'
                color="inherit"
              >
                <MenuItem key={page} onClick={() => setAnchorElNav(null)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              </MuiLink>
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
            <MuiLink
              key={page}
              component={Link}
              to={slugify(page.toLowerCase())}
              textAlign="center"
              underline='none'
              color="inherit"
            >
              <Button
                key={page}
                onClick={() => setAnchorElNav(null)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            </MuiLink>
          ))}
        </Box>
        <Box sx={{ display: { xs: "none", md: 'inherit' }, mr: 3 }}>
          <MuiLink component={Link} to="/add-offer" underline='none' color="inherit">
            <Button color="secondary" variant='contained' size="small" startIcon={<Edit />}>
              Post a job
            </Button>
          </MuiLink>
        </Box>

        <Box sx={{ display: { xs: "none", md: 'inherit' }, mr: 3 }}>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={null} color="secondary">
                <NotificationsOutlined />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          {currentUser && userInfo ? (
            <>
              <Tooltip title="Open menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Profile Picture" src={userInfo.photoUrl ? userInfo.photoUrl : ""} sx={{ bgcolor: '#fff' }}>
                    {!userInfo.photoUrl && currentUser.displayName?.slice(0, 2)}
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
                  <Logout />
                  <Typography ml={1} textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <MuiLink component={Link} to="/login" underline='none' color="inherit">
              <Button color="inherit" variant="outlined">Login</Button>
            </MuiLink>
          )}

        </Box>
      </Toolbar>

    </AppBar>
  );
};