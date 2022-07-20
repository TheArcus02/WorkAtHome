import { Container, Paper, Typography, Link as MuiLink, Button, Divider } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useGetDoc } from "../../hooks/useGetDoc"
import { AuthContextItf, firestoreCompany, firestoreJobOffer } from "../../utils/interfaces"
import { PeopleAltOutlined, LocationOnOutlined, LanguageOutlined,DescriptionOutlined  } from '@mui/icons-material'
import { Loader } from "../Loader"
import EmployeeCard from "./EmployeeCard"
import { primaryLight } from "../../utils/colors"
import { useQuery } from "../../hooks/useQuery"
import { OfferCard } from "../offer/OfferCard"
import { where } from "firebase/firestore"
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
    
    
    return (
        companyInfo ? (
            <Container maxWidth="xl" sx={{mt:5}}>
                <Paper sx={{pb:5}}>
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
                                <Box sx={{display:'flex', gap:1, flexWrap:{xs:'wrap', md:'nowrap'}}} mb={2}>
                                    <Paper sx={{p:1.5}} elevation={0}>
                                        <Box sx={{display:'flex', alignItems:'center'}}>
                                            <PeopleAltOutlined sx={{color:primaryLight}} />
                                            <Typography ml={1}>{companyInfo.size}</Typography>
                                        </Box>
                                    </Paper>
                                    <Paper sx={{p:1.5}} elevation={0}>
                                        <Box sx={{display:'flex', alignItems:'center'}}>
                                            <LocationOnOutlined sx={{color:primaryLight}} />
                                            <Typography ml={1}>{companyInfo.address}</Typography>
                                        </Box>
                                    </Paper>
                                    
                                    {companyInfo.websiteUrl.length > 0 &&
                                    <Paper sx={{p:1.5}} elevation={0}>
                                        <Box sx={{display:'flex', alignItems:'center'}}>
                                            <LanguageOutlined sx={{color:primaryLight}} />
                                            <MuiLink target='_blank' rel="noopener" href={companyInfo.websiteUrl} underline="none" color="secondary">
                                                <Typography ml={1}>{companyInfo.name}</Typography>
                                            </MuiLink>
                                        </Box>
                                    </Paper> 
                                    
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
                        
                        <Paper elevation={0} sx={{p:2}}>
                            <Box sx={{display:'flex', alignItems:'center', mb:1.5 }}>
                                <DescriptionOutlined />
                                <Typography variant="h5" ml={1}>Description</Typography>
                            </Box>
                            <Divider />
                            <Typography variant="body1" mt={1.5}>
                                {companyInfo.description}
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia deserunt, assumenda deleniti earum dignissimos unde? Alias ex quo ipsum modi, adipisci atque quisquam fugiat quaerat numquam beatae, veniam natus corrupti!
                                Possimus accusantium sequi vitae voluptate corporis. Et praesentium quidem earum recusandae optio repellat cum nesciunt blanditiis cupiditate saepe necessitatibus, repellendus fuga reiciendis laborum assumenda laboriosam provident veritatis officia explicabo ut.
                                Hic iure cumque blanditiis sed, saepe illum ex. Eos obcaecati deserunt qui adipisci minus laudantium excepturi possimus, incidunt molestiae illum veniam, temporibus hic est laborum consequatur. Cum dolore earum iusto!
                            </Typography>
                        </Paper>
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
                                    <EmployeeCard empUid={emp} key={emp} />
                                ))}
                            </Container>
                            
                        </Box>
                        }
                        {offers.length > 0 && 
                        <Box mt={5}>
                            <Typography variant="h4" align="center">
                                Job Offers
                            </Typography>
                            <Container  sx={{mt:5, display: 'flex', justifyContent: 'center', gap:2, flexWrap: 'wrap'}}>
                                {offers.map((offer) => (
                                    <OfferCard offer={offer} elevation={3} key={offer.uid} />
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
