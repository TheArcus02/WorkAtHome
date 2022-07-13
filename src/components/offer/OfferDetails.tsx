import { Box, Container, Paper, Typography, Link as MuiLink, Button, Divider, Chip } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useGetDoc } from "../../hooks/useGetDoc"
import { AuthContextItf, firestoreJobOffer } from "../../utils/interfaces"
import { Loader } from "../Loader"
import { BusinessOutlined, CodeOutlined, DescriptionOutlined, LocationOnOutlined, TimelineOutlined } from '@mui/icons-material'
import { primaryLight } from "../../utils/colors"
import moment from "moment"

export const OfferDetails = () => {
  
  const [offer, setOffer] = useState<firestoreJobOffer | null>(null)
  const [editable, setEditable] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const { currentUser } = useAuth() as AuthContextItf
  const { document, getDocument } = useGetDoc()
  const params = useParams()
  const {uid} = params

  useEffect(() => {
    if(uid){
      getDocument("Offers", uid)

    }
  }, [uid])

  useEffect(() => {
    if(document){
      setOffer(document as firestoreJobOffer)
    }
  }, [document])

  useEffect(() => {
    if(offer && currentUser){
      offer.createdBy === currentUser.uid && setEditable(true) 
    }
  }, [offer, currentUser])
  
  // TODO change mobile view
  // TODO add popup already applied for this job when entries will be ready
  // TODO add option to apply for this job

  return offer ? (
    <Container maxWidth="lg" sx={{mt:5}}>
      <Paper sx={{py:5}}>
        <Box sx={{display:'flex', flexDirection:'column', textAlign:'justify'}} mx={5}>
          <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', flexDirection:{xs:'column-reverse', md:"row"} }}>
            <Box>
              <Typography component="h2" variant="h5" fontWeight="bold" sx={{textAlign:{xs:'center', md:'left'}}}>
                  {offer.title}
              </Typography>
              <Typography variant="subtitle2">{moment(offer.createdAt.toDate()).calendar()}</Typography>
              <Typography component="h3" variant="h6" mt={2} mb={2} sx={{textAlign:{xs:'center', md:'left'}}}>
                  {offer.minSalary} - {offer.maxSalary} PLN
              </Typography>
              <Box sx={{display:'flex', gap:1, flexWrap:{xs:'wrap', md:'nowrap'}}} mb={2}>
                <Paper sx={{p:1.5}} elevation={0}>
                  <Box sx={{display:'flex', alignItems:'center'}}>
                    <BusinessOutlined sx={{color:primaryLight}}/>
                    <MuiLink component={Link} to={`/company/${offer.companyUid}`} underline="none" color="secondary">
                      <Typography ml={1}>{offer.companyName}</Typography>
                    </MuiLink>
                  </Box>
                </Paper>

                <Paper sx={{p:1.5}} elevation={0}>
                  <Box sx={{display:'flex', alignItems:'center'}}>
                    <LocationOnOutlined sx={{color:primaryLight}}/>
                    <Typography ml={1}>{offer.location}</Typography>
                  </Box>
                </Paper>

                <Paper sx={{p:1.5}} elevation={0}>
                  <Box sx={{display:'flex', alignItems:'center'}}>
                    <TimelineOutlined sx={{color:primaryLight}}/>
                    <Typography ml={1}>{offer.seniority}</Typography>
                  </Box>
                </Paper>

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
          
          <Box sx={{display:'flex', flexDirection:'column', gap:3}}>
            {offer.technologies.length > 0 && (
            <Paper elevation={0} sx={{p:2}}>
              <Box sx={{display:'flex', alignItems:'center', mb:1.5 }}>
                <CodeOutlined />
                <Typography variant="h5" ml={1}>Tech stack</Typography>
              </Box>
              <Divider />
              <Box sx={{mt:1.5, display:'flex', flexWrap:'wrap', gap:0.5}}>
                {offer.technologies.map((tech) => (
                  <Chip label={tech} key={tech} /> 
                ))}
              </Box>
              
            </Paper>
            )}

            <Paper elevation={0} sx={{p:2}}>
              <Box sx={{display:'flex', alignItems:'center', mb:1.5 }}>
                <DescriptionOutlined />
                <Typography variant="h5" ml={1}>Description</Typography>
              </Box>
              <Divider />
              <Typography variant="body1" mt={1.5}>
                {offer.description}
              </Typography>
            </Paper>
          </Box>
          
          
        </Box>
      </Paper>   
    </Container>
  ) : (<Loader />)
}
