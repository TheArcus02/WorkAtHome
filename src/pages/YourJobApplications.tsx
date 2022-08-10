import { Alert, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { arrayRemove, increment } from "firebase/firestore"
import { toast } from "react-toastify"
import { JobApplicationTableRow } from "../components/JobApplications/JobApplicationTableRow"
import { Loader } from "../components/Loader"
import { useAuth } from "../contexts/AuthContext"
import { useSetDoc } from "../hooks/useSetDoc"
import { primary } from "../utils/colors"
import { AuthContextItf } from "../utils/interfaces"


export const YourJobApplications = () => {

    const { userInfo, currentUser } = useAuth() as AuthContextItf
    const { setDocument } = useSetDoc()

    const handleCancel = (offerUid: string , entryUid: string) => {
        if(currentUser){
            setDocument(`Offers/${offerUid}/entries`, {active: false, rejected: true}, entryUid)
            setDocument(`Users`, {jobApplications: arrayRemove({entryUid, offerUid})}, currentUser.uid)
            setDocument('Offers', {entriesCounter: increment(-1)}, offerUid)
            toast.success("Job apply has been canceled.")
        } else {
            toast.error("Cannot update database without user uid. Try reloading the page.")
        }
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            {userInfo ? (
                userInfo.jobApplications.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ background: primary }}>
                                <TableRow>
                                    <TableCell>Job Title</TableCell>
                                    <TableCell>Company Name</TableCell>
                                    <TableCell>Applied At</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell colSpan={2} />
                                </TableRow>

                            </TableHead>
                            <TableBody>
                                {userInfo.jobApplications.map((application, index) => (
                                    <JobApplicationTableRow
                                        key={application.entryUid + application.offerUid + index}
                                        entryUid={application.entryUid}
                                        offerUid={application.offerUid}
                                        handleCancel={handleCancel}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert
                        severity='info'
                        sx={{ mt: 2, p: 2 }}
                    >
                        You don't have any job applications yet.
                    </Alert>
                )
            ) : <Loader />}
        </Container>
    )
}
