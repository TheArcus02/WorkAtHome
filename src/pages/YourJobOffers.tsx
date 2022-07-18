import { Alert, Button, Container } from "@mui/material"
import { where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { OffersTable } from "../components/offer/Table/OffersTable"
import { useAuth } from "../contexts/AuthContext"
import { useQuery } from "../hooks/useQuery"
import { AuthContextItf, firestoreJobOffer } from "../utils/interfaces"

export const YourJobOffers = () => {
    
    const [offers, setOffers] = useState<firestoreJobOffer[]>([])

    const { currentUser } = useAuth() as AuthContextItf
    const { getQuery, queryResult } = useQuery()
    const navigate = useNavigate()

    useEffect(() => {
        if(currentUser){
            getQuery('', "Offers", where("createdBy", "==", currentUser.uid))
        }
    }, [currentUser])
    
    useEffect(() => {
        if(queryResult){
            queryResult.forEach((doc: any) => (
              setOffers((prev) => (
                [...prev, doc.data()]
              ))
            ))
          }
    }, [queryResult])
    

    return (
    <Container maxWidth="lg" sx={{mt:5}}>
        {offers.length === 0 ? (
        <Alert 
            severity='info' 
            sx={{mt:2, p:2}}
            action={
                <Button 
                    variant="contained" 
                    color="info" 
                    size="small"
                    onClick={() => navigate("/add-offer")}
                >
                    Add offer
                </Button> 
            }
        >
                You don't have any job offers created.
        </Alert>
        ) : (
            <OffersTable offers={offers} />
        )}
    </Container>
    )
}
