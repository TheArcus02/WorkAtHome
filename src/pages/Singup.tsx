import { EmailOutlined, Google, Twitter } from "@mui/icons-material"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import { AuthContextItf } from "../utils/interfaces";

export const Signup = () => {

    type options = undefined | 'EandP';
    const [option, setOption] = useState<options>()
    const { signupGoogle, signupTwitter } = useAuth() as AuthContextItf
    
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
                <Typography component="h1" variant="h5">
                    Choose Your Signup Option
                </Typography>
                <Stack spacing={2} sx={{mt: 5}}>
                    <Button variant="outlined" startIcon={<EmailOutlined />} size="large">Email and Password</Button>

                    <Button variant="outlined" startIcon={<Google />} size="large" onClick={() => handleSocialSignup("google")}>Signup with Google</Button>

                    <Button variant="outlined" startIcon={<Twitter />} size="large" onClick={() => handleSocialSignup("twitter")}>Signup with Twitter</Button>
                </Stack>
                    
            </Box>
        </Container>
    )
}