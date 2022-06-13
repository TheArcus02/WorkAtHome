import { EmailOutlined, Google, Twitter } from "@mui/icons-material"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader";
import { EmailAndPassword } from "../components/signup/EmailAndPassword";
import { useAuth } from "../contexts/AuthContext";
import { AuthContextItf, currentUser } from "../utils/interfaces";

type Props = { user:currentUser }
export const Signup:React.FC = () => {

    const [emailSignup, setEmailSignup] = useState(false);
    const { signupGoogle, signupTwitter, currentUser, loading } = useAuth() as AuthContextItf
    
    
    const handleSocialSignup = (type: "google" | "twitter") => {
        try {
            if(type=== "google") signupGoogle()
            else signupTwitter()
        } catch (error) {
            toast.error("An error occured during signup proccess");
        }
    }
    return !loading ? ( !currentUser ? (
        !emailSignup ? (
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >   
                    <Typography component="h1" variant="h5">
                        Choose Your Signup Option
                    </Typography>
                    <Stack spacing={2} sx={{mt: 5}}>
                        <Button variant="outlined" startIcon={<EmailOutlined />} size="large" onClick={() => setEmailSignup(true)}>Email and Password</Button>

                        <Button variant="outlined" startIcon={<Google />} size="large" onClick={() => handleSocialSignup("google")}>Signup with Google</Button>

                        <Button variant="outlined" startIcon={<Twitter />} size="large" onClick={() => handleSocialSignup("twitter")}>Signup with Twitter</Button>
                    </Stack>
                    
                </Box>
            </Container>
        ) : (
            <EmailAndPassword setEmailSignup={setEmailSignup} />
        )
        
    ) : (
        <Navigate to="/" />
    )) : (
        <Loader />
    )
}