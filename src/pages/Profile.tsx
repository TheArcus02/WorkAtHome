import { Avatar, Button, CircularProgress, Container, Paper, Typography, Link as MuiLink } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { SocialLink } from "../components/profile/SocialLink"
import { useAuth } from "../contexts/AuthContext"
import { useGetDoc } from "../hooks/useGetDoc"
import { useTransitionStyles } from "../hooks/useTransitionStyles"
import { primaryLight } from "../utils/colors"
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
                                    {user.jobs.length > 0 ? (
                                        user.jobs.find((job) => job.current === true) ?
                                        user.jobs.map((job) => (
                                            job.current ? 
                                            <Typography key={job.title + job.companyUid} variant="subtitle1" gutterBottom>Working at <MuiLink component={Link} underline="none" color={primaryLight} to={`/company/${job.companyUid}`}>{job.companyName}</MuiLink></Typography>
                                            : null
                                        ))
                                        : 
                                        <Typography variant="subtitle1" gutterBottom>Currently unemployed</Typography>
                                    ): <Typography variant="subtitle1" gutterBottom>Unemployed</Typography>}  
                                   {user.companies.length > 0 ? (
                                     <Typography variant="subtitle1" gutterBottom>
                                        Owner of 
                                        {user.companies.map((company) => (
                                        <MuiLink 
                                            key={company.uid} 
                                            component={Link} 
                                            to={`/company/${company.uid}`}
                                            underline="none"
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
                            
                            
                            <Typography variant="body1" sx={{mt:{xs: 2, md:0}, textAlign:{xs:'center' ,md:'justify'} }}>{user.description}</Typography>
                        </Box>
                    </Box>
                    
                </Paper>
            </Container>
        ) : (
            <CircularProgress />
        )
        
    )
}
