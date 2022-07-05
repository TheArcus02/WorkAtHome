import { Container, Paper, Typography, Link as MuiLink, Button } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useGetDoc } from "../../hooks/useGetDoc"
import { AuthContextItf, firestoreCompany } from "../../utils/interfaces"
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { Loader } from "../Loader"
import EmployeeCard from "./EmployeeCard"
export const CompanyDetails = () => {

    const [companyInfo, setCompanyInfo] = useState<firestoreCompany | null>(null)
    const [editable, setEditable] = useState<Boolean>(false)
    const [editMode, setEditMode] = useState<Boolean>(false)

    const { currentUser } = useAuth() as AuthContextItf
    const { getDocument, document } = useGetDoc()
    const params = useParams()
    const {uid} = params
    
    // TODO edit mode logic
    
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
            <Container maxWidth="xl" sx={{mt:5}}>
                <Paper>
                    <Box 
                        loading="lazy"
                        component="img"
                        sx={{
                            maxHeight: 250,
                            width: "100%",
                            objectFit:'cover'
                        }}
                        alt={companyInfo.name}
                        src={companyInfo.photoUrl}
                    />
                    <Box sx={{display:'flex', flexDirection:'column', textAlign:'justify'}} mx={5}>
                        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:{xs:'column-reverse', md:"row"} }}>
                            <Box>
                                <Typography component="h2" variant="h4" mt={2} mb={2} fontWeight="bold" sx={{textAlign:{xs:'center', md:'left'}}}>
                                    {companyInfo.name}
                                </Typography>
                                <Box sx={{display:'flex', gap:2, flexWrap:{xs:'wrap', md:'nowrap'}}} mb={2}>
                                    <Box sx={{display:'flex', alignItems:'center'}}>
                                        <PeopleAltOutlinedIcon />
                                        <Typography ml={1}>{companyInfo.size}</Typography>
                                    </Box>
                                    <Box sx={{display:'flex', alignItems:'center'}}>
                                        <LocationOnOutlinedIcon />
                                        <Typography ml={1}>{companyInfo.address}</Typography>
                                    </Box>
                                    <Box sx={{display:'flex', alignItems:'center'}}>
                                        <LocationOnOutlinedIcon />
                                        <Typography ml={1}>{companyInfo.address}</Typography>
                                    </Box>
                                    {companyInfo.websiteUrl.length > 0 && 
                                    <Box sx={{display:'flex', alignItems:'center'}}>
                                        <LanguageOutlinedIcon />
                                        <MuiLink target='_blank' rel="noopener" href={companyInfo.websiteUrl} underline="none" color="secondary">
                                            <Typography ml={1}>{companyInfo.name}</Typography>
                                        </MuiLink>
                                    </Box>
                                    }  
                                </Box>
                            </Box>
                            {editable && 
                            <Box>
                                <Button 
                                    variant="contained" 
                                    sx={{mt:{xs:2, md:0}}}
                                    onClick={() => setEditMode(true)} 
                                >
                                    Edit
                                </Button>
                            </Box>
                            }
                            
                        </Box>
                        
                        <Typography variant="body1">
                            {companyInfo.description}
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi voluptates quam blanditiis dolor in suscipit fugiat explicabo doloremque dicta. Numquam quibusdam atque rerum odio, debitis voluptatum dicta error inventore dolorem.
                            Eveniet dignissimos minima, vero, aperiam quidem praesentium dolore facere doloremque pariatur vel optio fugiat sit ea quis amet illum laborum soluta dolores nam tenetur eligendi enim. Rem facilis eos molestiae.
                            Quidem neque, accusantium harum ex eum sint placeat voluptatum magnam nulla recusandae laborum tempore repudiandae, a consequatur, quos sunt! Iste atque doloremque voluptates quas, voluptatibus explicabo nobis dolore porro cumque!
                            {
                                // TODO Delete lorem later
                            }
                        </Typography>
                        {companyInfo.employees.length > 0 && 
                        <Box mt={5}>
                            <Typography variant="h4" align="center">
                                Our team
                            </Typography>
                            <Container 
                                maxWidth="lg" 
                                sx={{mt:5, display: 'flex', justifyContent: 'center', gap:2, flexWrap: 'wrap'}}
                            >
                                {companyInfo.employees.map((emp) => (
                                    <EmployeeCard empUid={emp} />
                                ))}
                            </Container>
                            
                        </Box>
                        }

                    </Box>   
                </Paper>
            </Container>
        ) : (
            <Loader />
        )
        
    )
}
