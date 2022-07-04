import { Container, Paper, Typography } from "@mui/material"
import { Box, width } from "@mui/system"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useGetDoc } from "../../hooks/useGetDoc"
import { AuthContextItf, firestoreCompany } from "../../utils/interfaces"

export const CompanyDetails = () => {

    const [companyInfo, setCompanyInfo] = useState<firestoreCompany | null>(null)
    const { currentUser } = useAuth() as AuthContextItf
    const [editable, setEditable] = useState(false)
    const { getDocument, document } = useGetDoc()
    const params = useParams()
    const {uid} = params
    
    
    useEffect(() => {
        if(uid){
            getDocument('Companies', uid);
        }
    }, [])

    useEffect(() => {
        if(document){
            setCompanyInfo(document as firestoreCompany)
        }
    }, [document])
    
    useEffect(() => {
      if(companyInfo && currentUser){
        companyInfo.createdBy === currentUser.uid ? 
        setEditable(true) : ""
      }
    }, [companyInfo])
    
    return (
        companyInfo ? (
            <Container maxWidth="lg" sx={{mt:5}}>
                <Paper>
                    <Box 
                        component="img"
                        sx={{
                            maxHeight: 250,
                            width: "100%",
                            objectFit:'cover'
                        }}
                        alt={companyInfo.name}
                        src={companyInfo.photoUrl}
                    />
                    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                        {
                        // TODO Make heading look like profile page 
                        // TODO Add logoImage field to company 
                        }
                        <Typography component="h2" variant="h4" mt={2} color="secondary">{companyInfo.name}</Typography>
                    </Box>   
                </Paper>
            </Container>
        ) : (
            <Container maxWidth="lg" sx={{mt:5}}>
                <Paper>

                </Paper>
            </Container>
        )
        
    )
}
