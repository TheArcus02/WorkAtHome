import { ArrowBack } from "@mui/icons-material"
import { Alert, Button, Container } from "@mui/material"
import { where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import { useGetDoc } from "../../../hooks/useGetDoc"
import { useRealtimeCollection } from "../../../hooks/useRealtimeCollection"
import { AuthContextItf, firestoreCompany } from "../../../utils/interfaces"
import { Loader } from "../../Loader"
import { EmployeesTable } from "./EmployeesTable"

export const Employees = () => {

    const [companyDetails, setCompanyDetails] = useState<null | firestoreCompany>(null)
    const [allowed, setAllowed] = useState<undefined | boolean>(undefined)

    const { currentUser } = useAuth() as AuthContextItf
    const params = useParams()
    const { uid } = params
    const { getRealtime, realtimeCollection, unsubscribe } = useRealtimeCollection()
    const navigate = useNavigate()

    useEffect(() => {
        if (uid) {
            getRealtime("Companies", where("uid", "==", uid))
        }
    }, [uid])


    useEffect(() => {
        if (realtimeCollection) {
            realtimeCollection.forEach((doc) => setCompanyDetails(doc.data() as firestoreCompany))
        }
    }, [realtimeCollection])


    useEffect(() => {
        if (companyDetails && currentUser) {
            if (companyDetails.createdBy === currentUser.uid) {
                setAllowed(true)
            } else {
                setAllowed(false)
            }
        }
    }, [companyDetails, currentUser])

    useEffect(() => {
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [unsubscribe])


    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            {allowed !== undefined && companyDetails && uid ? (
                allowed ? (
                    <EmployeesTable employees={companyDetails.employees} companyUid={uid} />
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
            ) : (
                <Loader />
            )}
        </Container>
    )
}
