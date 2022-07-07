import { Avatar, Button, CircularProgress, Container, Paper, Typography, Link as MuiLink } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { SocialLink } from "../components/profile/SocialLink"
import { useAuth } from "../contexts/AuthContext"
import { useGetDoc } from "../hooks/useGetDoc"
import { useTransitionStyles } from "../hooks/useTransitionStyles"
import { AuthContextItf, firestoreUser, userInfo } from "../utils/interfaces"

export const Profile = () => {

    const [editMode, setEditMode] = useState(false)
    const [editable, setEditable] = useState(false)
    const [user, setUser] = useState<userInfo>(null)

    const transitionStyles = useTransitionStyles()
    const {currentUser, userInfo} = useAuth() as AuthContextItf
    const { getDocument, document } = useGetDoc()
    const params = useParams()
    const {uid} = params

    useEffect(() => {
      if(currentUser && userInfo && uid){
        if(currentUser.uid === uid){
            setUser(userInfo)
            setEditable(true)
        } else{
            getDocument('Users', uid)
        }
      }
    }, [currentUser, userInfo, uid])

    useEffect(() => {
      if(document){
        setUser(document as firestoreUser)
      }
    }, [document])
    
    

    // TODO add editMode logic
    return (
        user ? (
            <Container maxWidth="lg" sx={{mt:5}}>
                <Paper sx={{display: 'flex', justifyContent:'center'}}>
                    <Box sx={{py:5, display:'flex', width:'100%', flexDirection:{xs: 'column', md:'row'}, alignItems:{xs:'center', md:'inherit'}}}>
                        <Avatar alt="Profile Picture" src={user.photoUrl ? user.photoUrl : ""} sx={{ width: 168, height: 168, m:3, bgcolor: '#fff'}} >
                            <Typography fontSize={40}>{!user.photoUrl && user.displayName?.slice(0,2)}</Typography>
                        </Avatar>
                        <Box sx={{display: {xs: 'flex', md:'block'}, flexDirection: {xs: 'column'}, alignItems: {xs:'center'}, p:{xs:3, md:0} ,mr:{md:3} }}>
                            <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:{xs:'column', md:"row"} }} >
                                <Box>
                                    <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">{user.name.length > 0 && user.surname.length > 0 ? user.name + " " + user.surname : user.displayName}</Typography>
                                    {// TODO working at when jobs will be ready 
                                    //* Set to current job                                   v
                                    }   
                                    <Typography variant="subtitle1" gutterBottom>Working at Firma</Typography>
                                   {user.companies.length > 0 ? (
                                     <Typography variant="subtitle1" gutterBottom>
                                        Owner of 
                                        {user.companies.map((company) => (
                                        <MuiLink 
                                            key={company.uid} 
                                            component={Link} 
                                            to={`/company/${company.uid}`}
                                            underline="none"
                                            color="info"
                                            className={transitionStyles.primaryLight}
                                        >
                                                {" " + company.name}
                                        </MuiLink>
                                        ))} 
                                     </Typography>
                                    ): ("")}
                                    {user.socials.length > 0 && (
                                        <Box sx={{display:'flex', gap:1, flexWrap:{xs:'wrap', md:'nowrap'}, alignItems:'center', justifyContent:{xs:'center', md:'inherit'} }}>
                                                {
                                                    user.socials.map((social) => (
                                                        <SocialLink social={social} key={social.name} />
                                                    ))
                                                }
                                        </Box>

                                    )}
                                </Box>
                                {editable && 
                                <Box>
                                    <Button 
                                        variant="contained" 
                                        sx={{mt:{xs:1, md:0}}}
                                        onClick={() => setEditMode(true)} 
                                    >
                                        Edit Profile
                                    </Button>
                                </Box>
                                }
                            </Box>
                            
                            
                            <Typography variant="body1" sx={{mt:{xs: 2, md:0}, textAlign:{xs:'center' ,md:'justify'} }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae expedita labore fugit praesentium commodi quas blanditiis porro obcaecati veritatis quidem recusandae, excepturi aperiam, ex eum repellendus quisquam unde, est fuga?
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
