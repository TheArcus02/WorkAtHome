import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Button, Container, Grid, Link as MuiLink, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useValidateInputs } from '../../hooks/useValidateInputs';
import { AuthContextItf } from '../../utils/interfaces';

interface EandPItf{
  setEmailSignup: React.Dispatch<React.SetStateAction<boolean>>;
}
export const EmailAndPassword:React.FC<EandPItf> = ({setEmailSignup}) => {
  type signupType = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  }
  const defaultFormData:signupType = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  }
  const [formData, setFormData] = useState<signupType>(defaultFormData)
  const { EandPSignup } = useAuth() as AuthContextItf
  const { validateData, inputErrors, errors, validated } = useValidateInputs()


  useEffect(() => {
    if(validated){
      if(errors) return

      const {firstName, lastName, email, password} = formData
      
      try {
        EandPSignup(email, password,firstName,lastName);
      } catch (error) {
        toast.error("Error occured during signup proccess." + error)
      }
    }
    
  }, [validated, errors])
  

  const handleOnChange = (name: string, value:string) => {
    setFormData((prev) => (
      {
        ...prev,
        [name]: value
      }
    ))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    validateData(formData);


    
  };
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={inputErrors?.firstName.error}
                  helperText={inputErrors?.firstName.text}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={(e) => handleOnChange(e.target.name, e.target.value)}
                     
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={inputErrors?.lastName.error}
                  helperText={inputErrors?.lastName.text}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={(e) => handleOnChange(e.target.name, e.target.value)}
                  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={inputErrors?.email.error}
                  helperText={inputErrors?.email.text}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleOnChange(e.target.name, e.target.value)}
                  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={inputErrors?.password.error}
                  helperText={inputErrors?.password.text}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => handleOnChange(e.target.name, e.target.value)}

                /> 
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item xs>
                <Box onClick={() => setEmailSignup(false)}>
                  <MuiLink variant="body2">
                    Go back
                  </MuiLink>
                </Box>
              </Grid>
              <Grid item>
                <MuiLink component={Link} to="/login" variant="body2">
                  Already have an account? Sign in
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}