import { DescriptionOutlined } from "@mui/icons-material"
import { Box, Button, CircularProgress, Container, Divider, Paper, Typography} from "@mui/material"
import { styled } from "@mui/styles"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Experience } from "../components/profile/Experience"
import { ProfileEditMode } from "../components/profile/ProfileEditMode"
import { ProfileHeader } from "../components/profile/ProfileHeader"
import { useAuth } from "../contexts/AuthContext"
import { useGetDoc } from "../hooks/useGetDoc"
import { AuthContextItf, firestoreUser, userInfo } from "../utils/interfaces"

export const Profile = () => {

    const [editMode, setEditMode] = useState(false)
    const [editable, setEditable] = useState(false)
    const [user, setUser] = useState<userInfo>(null)

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

    const StyledButton = styled(Button)(({ theme }: any) => ({
        textTransform: 'none'
    }));
    return (
        user && currentUser ? (
            <Container maxWidth="lg" sx={{mt:5}}>
                {editable &&
                    <Box sx={{ display: 'flex' }}>
                    <Paper
                        component={editMode ? StyledButton : Paper}
                        variant={editMode ? "outlined" : "elevation"}
                        elevation={editMode ? 0 : 1}
                        sx={{
                        boxShadow: 0,
                        height: 45,
                        borderRadius: "20px 20px 0 0",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '30%',
                        fontSize: 16,
                        transition: 'cubic-bezier(0.4, 0, 0.2, 1) 0ms, 150ms'
                        }}
                        onClick={editMode ? () => setEditMode(false) : null}
                    >
                        Preview
                    </Paper>
                    <Paper
                        component={!editMode ? StyledButton : Paper}
                        variant={!editMode ? "outlined" : "elevation"}
                        elevation={!editMode ? 0 : 1}
                        sx={{
                        boxShadow: 0,
                        height: 45,
                        borderRadius: "20px 20px 0 0",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '30%',
                        textTransform: 'none',
                        fontSize: 16,
                        transition: 'cubic-bezier(0.4, 0, 0.2, 1) 0ms, 150ms'

                        }}
                        onClick={!editMode ? () => setEditMode(true) : null}
                    >
                        Edit
                    </Paper>
                    </Box>
                }
                <Paper sx={ editable ? { borderTopLeftRadius: 0} : undefined}>
                    {!editMode ? (
                        <>
                            <ProfileHeader user={user} /> 
                            
                            <Divider />
                            <Box sx={{px:{xs:2, md:5}}} py={3}>
                                <Paper elevation={0} sx={{ p:2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                        <DescriptionOutlined />
                                        <Typography variant="h5" ml={1}>Information</Typography>
                                    </Box>
                                    <Divider />
                                    <Typography variant="body1" mt={1.5} sx={{ textAlign: { xs: 'left', md: "justify" } }}>
                                        {user.description}
                                    </Typography>
                                </Paper>
                                {user.jobs.length > 0 && <Experience jobs={user.jobs.slice().reverse()} /> }

                            </Box>
                        </>

                    ) : (
                        <ProfileEditMode userInfo={user} userUid={currentUser.uid} />
                    )}
                </Paper>
            </Container>
        ) : (
            <CircularProgress />
        )
        
    )
}
