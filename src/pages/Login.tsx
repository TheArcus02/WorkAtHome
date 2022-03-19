import * as React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, Link as MuiLink, Stack, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Google, Twitter } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { AuthContextItf } from '../utils/interfaces';



export const Login = () => {
  
    const { signupGoogle, signupTwitter } = useAuth() as AuthContextItf

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
        email: data.get('email'),
        password: data.get('password'),
        });
    };

    const handleSocialSignup = (type: "google" | "twitter") => {
        try {
            if(type=== "google") signupGoogle()
            else signupTwitter()
        } catch (error) {
            console.log(error);
        }
    }

  return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box sx={{mt: 2, width: '100%'}}>
            <Stack spacing={2}>
                <Button variant="outlined" startIcon={<Google />} size="large" onClick={() => handleSocialSignup("google")} fullWidth>Login with Google</Button>
                <Button variant="outlined" startIcon={<Twitter />} size="large" onClick={() => handleSocialSignup("twitter")}>Login with Twitter</Button>
            </Stack>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <MuiLink href="#" variant="body2">
                  Forgot password?
                </MuiLink>
              </Grid>
              <Grid item>
                <MuiLink component={Link} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}