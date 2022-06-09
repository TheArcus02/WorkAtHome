import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Button, Container, Grid, Link as MuiLink, Stack, TextField, Typography } from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Google, Twitter } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { AuthContextItf, currentUser } from '../utils/interfaces';
import { toast } from 'react-toastify';
import { useValidateInputs } from '../hooks/useValidateInputs';
import { useEffect, useState } from 'react';

export const Login:React.FC = () => {
  type loginType = {'loginEmail': string, 'loginPassword': string}
  const defaultFormData:loginType = {
    loginEmail: '',
    loginPassword: '',
  }
    const [formData, setFormData] = useState(defaultFormData)
    const { signupGoogle, signupTwitter, login, loading, currentUser } = useAuth() as AuthContextItf
    const { validateData, inputErrors, errors, validated } = useValidateInputs()
    
    const navigate = useNavigate()
    

    useEffect(() => {
      if(validated){
        if(errors){
          toast.warning("Wrong email or password.");
          return;
        } 
        
        const {loginEmail, loginPassword} = formData 

        try {
          login(loginEmail, loginPassword);    
          navigate("/")
        } catch (error: any) {
            toast.error("Error during login", error);
        }
      }
    
    }, [validated, errors])
    
    const handleChange = (name: string, value:string) => {
      setFormData((prev) => (
        {
          ...prev,
          [name]: value
        }
      ))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        validateData(formData)
        
    };

    const handleSocialSignup = (type: "google" | "twitter") => {
        try {
            if(type=== "google") signupGoogle()
            else signupTwitter()
            navigate("/")
        } catch (error) {
            toast.error("An error occured during signup proccess");
        }
    }

  return !loading ? ( !currentUser ? (
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
              id="loginEmail"
              label="Email Address"
              name="loginEmail"
              autoComplete="email"
              autoFocus
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="loginPassword"
              label="Password"
              type="password"
              id="loginPassword"
              autoComplete="current-password"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
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
  ) : <Navigate to="/"></Navigate> ) : (
    <div>Loading</div>
  )
}