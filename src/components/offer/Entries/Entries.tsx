import { ArrowBack } from "@mui/icons-material"
import { Alert, Button, Container } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useRealtimeCollection } from "../../../hooks/useRealtimeCollection"
import { firestoreEntry } from "../../../utils/interfaces"
import { Loader } from "../../Loader"
import { EntriesTable } from "./EntriesTable"


export const Entries = () => {
    
    const [entries, setEntries] = useState<firestoreEntry[]>([])

    const { getRealtime, realtimeCollection, unsubscribe } = useRealtimeCollection()  
    const params = useParams()
    const {uid} = params
    const navigate = useNavigate()

    useEffect(() => {
      if(uid){
        getRealtime(`Offers/${uid}/entries`)
      }
      
    }, [uid])

        
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
            { realtimeCollection && uid ? (
                entries.length > 0 ? (
                    <EntriesTable entries={entries} offerUid={uid} />
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
