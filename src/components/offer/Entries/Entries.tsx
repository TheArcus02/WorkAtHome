import { ArrowBack } from "@mui/icons-material"
import { Alert, Button, Container } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "../../../hooks/useQuery"
import { firestoreEntry } from "../../../utils/interfaces"
import { Loader } from "../../Loader"
import { EntriesTable } from "./EntriesTable"


export const Entries = () => {
    
    const [entries, setEntries] = useState<firestoreEntry[]>([])

    const { getQuery, queryResult } = useQuery()    
    const params = useParams()
    const {uid} = params
    const navigate = useNavigate()

    useEffect(() => {
      if(uid){
        getQuery("", `Offers/${uid}/entries`)
      }
    }, [uid])
    
    useEffect(() => {
      if(queryResult && entries.length === 0){
        queryResult.forEach((doc) => (
            setEntries((prev) => [...prev, doc.data() as firestoreEntry])
        ))
      }
    }, [queryResult, entries])

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            { queryResult ? (
                entries.length > 0 ? (
                    <EntriesTable entries={entries} />
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
