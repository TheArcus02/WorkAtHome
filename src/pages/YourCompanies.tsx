import { Card, CardActionArea, CardContent, CardMedia, Container, Paper, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { collection, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase/firebase.config"
import useAppBarHeight from "../hooks/useAppBarHeight"
import { useQuery } from "../hooks/useQuery"
import { AuthContextItf, firestoreCompany } from "../utils/interfaces"

export const YourCompanies = () => {

  const {currentUser} = useAuth() as AuthContextItf
  const [companies, setCompanies] = useState<firestoreCompany[]>([])

  const {getQuery, queryResult} = useQuery()
  const appBarHeight = useAppBarHeight()
  const useStyles = makeStyles({
    fullscreen: {
      minHeight: `calc(100vh - ${appBarHeight}px)`
    },
    fit: {
      height: 'fit-content'
    }
  });
  const classes = useStyles()
 
  
  useEffect(() => {
    if(companies.length === 0){
      const q = query(collection(db, "Companies"), where("CreatedBy", "==", currentUser?.uid))    
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
    <Paper sx={{display: 'flex', justifyContent:'center'}} elevation={2} className={classes.fullscreen}>
            <Container 
             maxWidth="lg" 
             sx={{mt:5, display: 'flex', justifyContent: 'center', gap:2, flexWrap: 'wrap'}}
            >
              {companies.map((company, index) => (
                <Card sx={{maxWidth: 345}} key={company.name + index} elevation={1} className={classes.fit}>
                  <CardActionArea>
                    <CardMedia 
                     component="img"
                     height="140"
                     image={company.photoUrl ? company.photoUrl : "https://images.unsplash.com/photo-1570126618953-d437176e8c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80"}
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
            </Container>
    </Paper>
  )
}

