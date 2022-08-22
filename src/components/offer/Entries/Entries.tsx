import { ArrowBack } from "@mui/icons-material"
import { Alert, Button, Container } from "@mui/material"
import { where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import { useGetDoc } from "../../../hooks/useGetDoc"
import { useRealtimeCollection } from "../../../hooks/useRealtimeCollection"
import { AuthContextItf, firestoreEntry, firestoreJobOffer } from "../../../utils/interfaces"
import { Loader } from "../../Loader"
import { EntriesTable } from "./EntriesTable"


export const Entries = () => {

    const [entries, setEntries] = useState<firestoreEntry[]>([])
    const [offer, setOffer] = useState<firestoreJobOffer | null>(null)
    const [allowed, setAllowed] = useState<undefined | boolean>(undefined)

    const { currentUser } = useAuth() as AuthContextItf
    const { getRealtime, realtimeCollection, unsubscribe } = useRealtimeCollection()
    const { getDocument, document } = useGetDoc()
    const params = useParams()
    const { uid } = params
    const navigate = useNavigate()

    useEffect(() => {
        if (uid) {
            getDocument("Offers", uid)
        }
    }, [uid])

    useEffect(() => {
        if (document) {
            setOffer(document as firestoreJobOffer)
        }
    }, [document])

    useEffect(() => {
        if (offer && currentUser) {
            if (offer.createdBy === currentUser.uid) {
                setAllowed(true)
            } else {
                setAllowed(false)
            }
        }
    }, [offer, currentUser])

    useEffect(() => {
        if (allowed && uid) {
            getRealtime(`Offers/${uid}/entries`, where("rejected", "==", false), where("active", "==", true))
        }
    }, [allowed, uid])


    useEffect(() => {
        if (realtimeCollection) {
            if (!realtimeCollection.empty) {
                setEntries([])
                realtimeCollection.forEach((doc) => {
                    setEntries((prev) => [...prev, doc.data() as firestoreEntry])
                })
            }

        }
    }, [realtimeCollection])

    useEffect(() => {
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [unsubscribe])

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            {allowed !== undefined ? (
                allowed ? (
                    realtimeCollection && offer ? (
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

                    ) : <Loader />
                ) : (
                    <Alert
                        severity='warning'
                        sx={{ mt: 2, p: 2 }}
                        action={
                            <Button
                                startIcon={<ArrowBack />}
                                variant="contained"
                                color="warning"
                                size="small"
                                onClick={() => navigate(-1)}
                            >
                                Go back
                            </Button>
                        }
                    >
                        You don't have permission to view this site.
                    </Alert>
                )
            ) : (<Loader />)}

        </Container>
    )
}
