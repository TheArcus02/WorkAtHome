import { ShareOutlined, WorkOutlineOutlined, LocationCityOutlined } from "@mui/icons-material"
import { Box, Avatar, Typography, Link as MuiLink, Paper, Divider, Chip } from "@mui/material"
import { Link } from "react-router-dom"
import { useTransitionStyles } from "../../hooks/useTransitionStyles"
import { primaryLight } from "../../utils/colors"
import { firestoreUser } from "../../utils/interfaces"
import { SocialLink } from "./SocialLink"

type ProfileHeaderProps = {
    user: firestoreUser
}

export const ProfileHeader:React.FC<ProfileHeaderProps> = ({ user }) => {

    const transitionStyles = useTransitionStyles()
    
    return (
        <Box sx={{ py: 2, display: 'flex', width: '100%', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'inherit' } }}>
            <Avatar alt="Profile Picture" src={user.photoUrl ? user.photoUrl : ""} sx={{ width: 168, height: 168, m: 3, ml:5, bgcolor: '#fff' }} >
                <Typography fontSize={40}>{!user.photoUrl && user.displayName?.slice(0, 2)}</Typography>
            </Avatar>
            <Box sx={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', flexDirection:{xs:'column', md:'row'}}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign:{xs:'center', md:'inherit'}, p: { xs: 3, md: 0 }, mr: { md: 3 } }}>
                            <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">{user.name.length > 0 && user.surname.length > 0 ? user.name + " " + user.surname : user.displayName}</Typography>
                            <Box sx={{display: 'flex', gap:0.5}}>
                            <WorkOutlineOutlined /> 
                            {user.jobs.length > 0 ? (
                                user.jobs.find((job) => job.current === true) ?
                                    user.jobs.map((job) => (
                                        job.current ?
                                            <Typography key={job.title + job.companyUid} variant="subtitle1" gutterBottom>Working at <MuiLink component={Link} underline="none" color={primaryLight} to={`/company/${job.companyUid}`}>{job.companyName}</MuiLink></Typography>
                                            : null
                                    ))
                                    :
                                    <Typography variant="subtitle1" gutterBottom>Currently unemployed</Typography>
                            ) : <Typography variant="subtitle1" gutterBottom>Unemployed</Typography>}
                            </Box>
                            {user.companies.length > 0 ? (
                                <Box>
                                    <Box sx={{display: 'flex', alignItems:'center', gap:0.5}}>
                                        <LocationCityOutlined />
                                        <Typography> Owner of </Typography>
                                   
                                        <Box sx={{display: 'flex', gap:1, ml:0.5}}> 
                                            {user.companies.map((company) => (
                                                <MuiLink
                                                    key={company.uid}
                                                    component={Link}
                                                    to={`/company/${company.uid}`}
                                                    underline="none"
                                                    className={transitionStyles.primaryLight}
                                                >
                                                    <Chip  sx={{cursor: 'pointer'}} label={company.name} color="primary" />
                                                </MuiLink>
                                            ))}
                                        </Box>
                                        </Box>
                                </Box>
                            ) : ("")}
                            
                </Box>
                {user.socials.length > 0 && (
                    <Box sx={{px:{xs:2, md:5}, pt:{xs:1, md:3}}}>
                        <Paper elevation={0} sx={{p:2}}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <ShareOutlined />
                                <Typography variant="h5" ml={1}>Socials</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' }, alignItems: 'center', justifyContent: { xs: 'center', md: 'center' }, mt:2}}>
                                {
                                    user.socials.map((social) => (
                                        <SocialLink social={social} key={social.name} size="large" />
                                    ))
                                } 
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
