import { Badge, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useQuery } from "../hooks/useQuery"
import { AuthContextItf, firestoreCompany } from "../utils/interfaces"
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useNavigate } from "react-router-dom"
import { where } from "firebase/firestore"
import { Person } from "@mui/icons-material"

export const YourCompanies = () => {

  const { currentUser } = useAuth() as AuthContextItf
  const [companies, setCompanies] = useState<firestoreCompany[]>([])

  const { getQuery, queryResult, unsubscribe } = useQuery()
  const navigate = useNavigate()

  useEffect(() => {
    if (companies.length === 0 && currentUser) {
      getQuery('', "Companies", where("createdBy", "==", currentUser.uid))
    }
  }, [currentUser])

  useEffect(() => {
    if (queryResult && companies.length === 0) {
      queryResult.forEach((doc: any) => {
        setCompanies((prev) => (
          [...prev, doc.data()]
        ))
      })
    }
  }, [queryResult, companies])

  useEffect(() => {
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [unsubscribe])

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}
    >
      {companies.map((company, index) => (
        <Card sx={{ maxWidth: 345, height: 345 }} key={company.name + index} elevation={1} >
          <CardMedia
            component="img"
            height="140"
            image={company.photoUrl}
            alt={company.name}
          />
          <CardContent>
            <Typography 
              gutterBottom 
              variant="h5" 
              component="div"
              sx={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}
            >
              {company.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 345, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
              {company.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => navigate(`/company/${company.uid}`)}
              color="secondary"
            >
              Details
            </Button>
            <Button
              onClick={() => navigate(`/company/${company.uid}/employees`)}
              color="secondary"
              endIcon={<Badge color="info" max={100} badgeContent={company.employees.length}><Person /></Badge>}
              variant="outlined"
            >
              Employees
            </Button>
          </CardActions>
        </Card>
      ))}

      <Card sx={{ maxWidth: 345, height: 345 }} elevation={1}>
        <CardActionArea onClick={() => navigate('/create-company')}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }} >
            <Tooltip title="Create company">
              <AddOutlinedIcon sx={{ height: 345, width: 345 }} />
            </Tooltip>
          </CardContent>
        </CardActionArea>
      </Card>
    </Container>
  )
}

