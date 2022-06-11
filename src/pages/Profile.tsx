import { Avatar, CircularProgress, Container, Paper, Typography, useMediaQuery } from "@mui/material"
import { Box } from "@mui/system"
import { useAuth } from "../contexts/AuthContext"
import { AuthContextItf, firestoreUser, userInfo } from "../utils/interfaces"

export const Profile = () => {

    const {userInfo: user} = useAuth() as AuthContextItf
    const matches = useMediaQuery('(min-width:900px)')
    

    return (
        user ? (
        <Paper sx={{display: 'flex', justifyContent:'center'}}>
            <Container maxWidth="lg" sx={{mt:5}}>
                <Paper sx={{display: 'flex', justifyContent:'center'}} elevation={2}>
                    <Box sx={{py:5, display:'flex', width:'100%', flexDirection:{xs: 'column', md:'row'}, alignItems:{xs:'center', md:'inherit'}}}>
                        <Avatar alt="Profile Picture" src={user.photoUrl ? user.photoUrl : ""} sx={{ width: 168, height: 168, m:3}}>
                            <Typography fontSize={40}>{!user.photoUrl && user.displayName?.slice(0,2)}</Typography>
                        </Avatar>
                        <Box>
                            <Typography variant="h5" component="h1" gutterBottom>{user.name.length > 0 && user.surname.length > 0 ? user.name + " " + user.surname : user.displayName}</Typography>
                            <Typography variant="subtitle1" gutterBottom>Working at Firma</Typography>
                            <Typography variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae expedita labore fugit praesentium commodi quas blanditiis porro obcaecati veritatis quidem recusandae, excepturi aperiam, ex eum repellendus quisquam unde, est fuga?
                            Amet quaerat officia quo quisquam ipsam voluptas soluta dolore quod culpa. Earum nulla nesciunt repellendus cumque voluptate temporibus distinctio? Expedita accusamus ea dolores minima illo a commodi optio perferendis odio.</Typography>
                        </Box>
                    </Box>
                    
                </Paper>
            </Container>
        </Paper>
        ) : (
            <CircularProgress />
        )
        
    )
}
