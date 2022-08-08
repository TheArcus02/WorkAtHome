import { Alert, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { JobApplicationTableRow } from "../components/JobApplications/JobApplicationTableRow"
import { Loader } from "../components/Loader"
import { useAuth } from "../contexts/AuthContext"
import { primary } from "../utils/colors"
import { AuthContextItf } from "../utils/interfaces"


export const YourJobApplications = () => {

    const { userInfo } = useAuth() as AuthContextItf

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
                                    <TableCell></TableCell>
                                </TableRow>

                            </TableHead>
                            <TableBody>
                                {userInfo.jobApplications.map((application, index) => (
                                    <JobApplicationTableRow
                                        key={application.entryUid + application.offerUid + index}
                                        entryUid={application.entryUid}
                                        offerUid={application.offerUid}
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
