import { Card, CardActionArea, CardContent, CardMedia, Container, Tooltip, Typography } from "@mui/material"
import { collection, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase/firebase.config"
import { useQuery } from "../hooks/useQuery"
import { AuthContextItf, firestoreCompany } from "../utils/interfaces"
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useNavigate } from "react-router-dom"

export const YourCompanies = () => {

  const {currentUser} = useAuth() as AuthContextItf
  const [companies, setCompanies] = useState<firestoreCompany[]>([])

  const {getQuery, queryResult} = useQuery()
  const navigate = useNavigate()
  
  useEffect(() => {
    if(companies.length === 0){
      const q = query(collection(db, "Companies"), where("createdBy", "==", currentUser?.uid))    
      getQuery(q)
    }
  }, [])

  useEffect(() => {
    if(queryResult){
      queryResult.forEach((doc: any) => {
        setCompanies((prev) => (
          [...prev, doc.data()]
        ))
      })
    }
  }, [queryResult])
  
  useEffect(() => {
    console.log(companies);
  }, [companies])

  return (
            <Container 
             maxWidth="lg" 
             sx={{mt:5, display: 'flex', justifyContent: 'center', gap:2, flexWrap: 'wrap'}}
            >
              {companies.map((company, index) => (
                <Card sx={{maxWidth: 345, height:312}} key={company.name + index} elevation={1} >
                  <CardActionArea onClick={() => navigate(`/company/${company.uid}`)}>
                    <CardMedia 
                     component="img"
                     height="140"
                     image={company.photoUrl}
                     alt={company.name}
                     />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {company.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{maxHeight: '100px', overflow: "hidden"}}>
                        {company.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}

              <Card sx={{maxWidth: 345}} elevation={1}>
                  <CardActionArea onClick={() => navigate('/create-company')}>
                    <CardContent sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', p:0}} >
                      <Tooltip title="Create company">
                        <AddOutlinedIcon sx={{ height: 312, width:345}} />
                      </Tooltip>
                    </CardContent>
                  </CardActionArea>
                </Card>
            </Container>
  )
}

