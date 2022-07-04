import { Avatar, CircularProgress, Container, Paper, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useAuth } from "../contexts/AuthContext"
import { AuthContextItf } from "../utils/interfaces"

export const Profile = () => {

    const {userInfo: user} = useAuth() as AuthContextItf
    
    return (
        user ? (
            <Container maxWidth="lg" sx={{mt:5}}>
                <Paper sx={{display: 'flex', justifyContent:'center'}} >
                    <Box sx={{py:5, display:'flex', width:'100%', flexDirection:{xs: 'column', md:'row'}, alignItems:{xs:'center', md:'inherit'}}}>
                        <Avatar alt="Profile Picture" src={user.photoUrl ? user.photoUrl : ""} sx={{ width: 168, height: 168, m:3, bgcolor: '#fff'}} >
                            <Typography fontSize={40}>{!user.photoUrl && user.displayName?.slice(0,2)}</Typography>
                        </Avatar>
                        <Box sx={{display: {xs: 'flex', md:'block'}, flexDirection: {xs: 'column'}, alignItems: {xs:'center'}, p:{xs:3, md:0}}}>
                            <Typography variant="h5" component="h1" gutterBottom color="secondary">{user.name.length > 0 && user.surname.length > 0 ? user.name + " " + user.surname : user.displayName}</Typography>
                            {// TODO working at when adding companies will be ready |
                            //*                                                    v
                            }   
                            <Typography variant="subtitle1" gutterBottom>Working at Firma</Typography>
                            <Typography variant="subtitle1" gutterBottom>{user.companies.length > 0 ? ("Owner of"+ user.companies.map((company, index) => (
                                " " + company.name
                            ))) : ("")}</Typography>
                            
                            <Typography variant="body1" sx={{mt:{xs: 1, md:0}, mr:{md:3} }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae expedita labore fugit praesentium commodi quas blanditiis porro obcaecati veritatis quidem recusandae, excepturi aperiam, ex eum repellendus quisquam unde, est fuga?
                            Amet quaerat officia quo quisquam ipsam voluptas soluta dolore quod culpa. Earum nulla nesciunt repellendus cumque voluptate temporibus distinctio? Expedita accusamus ea dolores minima illo a commodi optio perferendis odio.</Typography>
                        </Box>
                    </Box>
                    
                </Paper>
            </Container>
        ) : (
            <CircularProgress />
        )
        
    )
}
