import { Container, Paper, Button } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useGetDoc } from "../../hooks/useGetDoc"
import { AuthContextItf, firestoreCompany, firestoreJobOffer } from "../../utils/interfaces"
import { Loader } from "../Loader"
import { paper} from "../../utils/colors"
import { useQuery } from "../../hooks/useQuery"
import { where } from "firebase/firestore"
import { styled } from "@mui/styles"
import { CompanyPreview } from "./CompanyPreview"
import { CompanyEditMode } from "./CompanyEditMode"



export const CompanyDetails = () => {

    const [companyInfo, setCompanyInfo] = useState<firestoreCompany | null>(null)
    const [editable, setEditable] = useState<Boolean>(false)
    const [editMode, setEditMode] = useState<Boolean>(false)
    const [offers, setOffers] = useState<firestoreJobOffer[]>([])

    const { currentUser } = useAuth() as AuthContextItf
    const { getDocument, document } = useGetDoc()
    const { getQuery, queryResult, unsubscribe } = useQuery()
    const params = useParams()
    const {uid} = params
    
    // TODO edit mode logic
    
    useEffect(() => {
        if(uid){
            getDocument('Companies', uid);
            getQuery('',"Offers", where("companyUid", "==", uid))
        }
    }, [uid])

    useEffect(() => {
      if(queryResult && offers.length === 0){
        queryResult.forEach((doc: any) => {
            setOffers((prev) => (
                [...prev, doc.data()]
            ))
        })
      }
    }, [queryResult])
    

    useEffect(() => {
        if(document){
            setCompanyInfo(document as firestoreCompany)
        }
    }, [document])
    
    useEffect(() => {
      if(companyInfo && currentUser){
        companyInfo.createdBy === currentUser.uid && setEditable(true)
      }
    }, [companyInfo, currentUser])


    useEffect(() => {
      
        if(unsubscribe)
        return () =>  (
            unsubscribe()  
        )
    }, [unsubscribe])
    

    const StyledButton = styled(Button)(({ theme }: any) => ({
        textTransform: 'none',
        '&:hover': {
            backgroundColor: paper,
            filter: 'brightness(1.1)'
        }
      }))
    
    return (
        companyInfo ? (
            <Container maxWidth="xl" sx={{mt:5}}>
                <Paper sx={{pb:5}}>
                    <Box sx={editable ? {position:'relative'} : undefined}>
                        <Box 
                            loading="lazy"
                            component="img"
                            sx={{
                                maxHeight: 250,
                                width: "100%",
                                objectFit:'cover',
                            }}
                            alt={companyInfo.name}
                            src={companyInfo.photoUrl}
                        />
                        {editable && 
                        <Box sx={{position:'absolute', bottom:0, left:0, display:'flex', width:'100%'}}>
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
                                    transition: 'cubic-bezier(0.4, 0, 0.2, 1) 0ms, 150ms',
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
                                    transition: 'cubic-bezier(0.4, 0, 0.2, 1) 0ms, 150ms',
                                }}
                                onClick={!editMode ? () => setEditMode(true) : null}
                            >
                                Edit
                            </Paper>
                        </Box>
                        }
                    </Box>
                    {!editMode ? (
                        <CompanyPreview companyInfo={companyInfo} offers={offers} />  
                    ) : (
                        <CompanyEditMode companyInfo={companyInfo} />
                    )}
                </Paper>
            </Container>
        ) : (
            <Loader />
        )
        
    )
}
