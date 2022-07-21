import { ArrowBack } from "@mui/icons-material"
import { Alert, Button, Container } from "@mui/material"
import { where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetDoc } from "../../../hooks/useGetDoc"
import { useRealtimeCollection } from "../../../hooks/useRealtimeCollection"
import { useSetDoc } from "../../../hooks/useSetDoc"
import { firestoreEntry, firestoreJobOffer } from "../../../utils/interfaces"
import { Loader } from "../../Loader"
import { EntriesTable } from "./EntriesTable"


export const Entries = () => {
    
    const [entries, setEntries] = useState<firestoreEntry[]>([])
    const [offer, setOffer] = useState<firestoreJobOffer | null>(null)

    const { getRealtime, realtimeCollection, unsubscribe } = useRealtimeCollection()  
    const { getDocument, document } = useGetDoc()
    const params = useParams()
    const {uid} = params
    const navigate = useNavigate()

    useEffect(() => {
      if(uid){
        getDocument("Offers", uid)
        getRealtime(`Offers/${uid}/entries`, where("rejected", "==", false))
      }
      
    }, [uid])

    useEffect(() => {
        if(document){
            setOffer(document as firestoreJobOffer)
        }
    },[document])    

    useEffect(() => {
      if(realtimeCollection){
        if(!realtimeCollection.empty){
            setEntries([])
            realtimeCollection.forEach((doc) => {
                console.log(doc.data())
                setEntries((prev) => [...prev, doc.data() as firestoreEntry])
            })
        }
        
      }
    }, [realtimeCollection])

    useEffect(() => {
      if(unsubscribe)
        return () => (
            unsubscribe() 
        )
    }, [unsubscribe])

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            { realtimeCollection && offer ? (
                entries.length > 0 ? (
                    <EntriesTable entries={entries} offer={offer} />
                ) : (
                <Alert 
                    severity='info'
                    sx={{ mt: 2, p: 2 }}
                    action={
                        <Button
                            startIcon={<ArrowBack />}
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={() => navigate(-1)}
                        >
                            Go back
                        </Button>
                    }
                >
                    This offer dosen't have any entries yet.
                </Alert>
                )

            ) : <Loader /> }
        </Container>
    )
}
