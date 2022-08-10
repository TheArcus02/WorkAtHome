import { Cancel, Check, Edit, Pending } from "@mui/icons-material";
import { Box, Button, styled, TableCell, TableRow, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useGetDoc } from "../../hooks/useGetDoc";
import { firestoreEntry, firestoreJobOffer } from '../../utils/interfaces'
import { ApplyEditDialog } from "./ApplyEditDialog";

type ComponentProps = {
    entryUid: string;
    offerUid: string;
    handleCancel: (offerUid: string, entryUid: string) => void
}

export const JobApplicationTableRow: React.FC<ComponentProps> = ({ entryUid, offerUid, handleCancel }) => {

    const [entryDetails, setEntryDetails] = useState<firestoreEntry | null>(null)
    const [offerDetails, setOfferDetails] = useState<firestoreJobOffer | null>(null)
    const [openEditDialog, setOpenEditDialog] = useState(false)

    const { getDocument, document, docRef } = useGetDoc()



    useEffect(() => {
        if (!offerDetails) getDocument("Offers", offerUid, "offerDetails")
    }, [offerUid, entryUid, offerDetails])

    useEffect(() => {
        if (document && docRef) {
            switch (docRef) {
                case 'offerDetails': {
                    setOfferDetails(document as firestoreJobOffer)
                    break
                }
                case 'entryDetails': {
                    setEntryDetails(document as firestoreEntry)
                    break
                }
                default: return
            }
        }

    }, [document, docRef])

    useEffect(() => {
        if (offerDetails && !entryDetails) {
            getDocument(`Offers/${offerUid}/entries`, entryUid, "entryDetails")
        }
    }, [entryUid, offerUid, offerDetails, entryDetails])

    const StyledTableRow = styled(TableRow)(({ theme }: any) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    useEffect(() => {
        console.log({ entryDetails, offerDetails, docRef })
    }, [entryDetails, offerDetails, docRef])



    return offerDetails && entryDetails ? (
        <>
            <StyledTableRow>
                <TableCell>{offerDetails.title}</TableCell>
                <TableCell>{offerDetails.companyName}</TableCell>
                <TableCell>{moment(entryDetails.createdAt.toDate()).calendar()}</TableCell>
                <TableCell>
                    {entryDetails.approved ? (
                        <Box sx={{ display: 'flex', gap: 0.5 }} color="success.light">
                            <Check />
                            <Typography>Aproved</Typography>
                        </Box>
                    ) : entryDetails.rejected ? (
                        <Typography color="error.main">Rejected</Typography>
                    ) : (
                        <Typography color="info.main">In review</Typography>
                    )}
                </TableCell>
                <TableCell align="center">
                    <Button variant="contained" color="primary" startIcon={<Edit />} onClick={() => setOpenEditDialog(true)}>
                        Edit
                    </Button>
                </TableCell>
                <TableCell align="center">
                    <Button variant="contained" color="warning" startIcon={<Cancel />} onClick={() => handleCancel(offerDetails.uid, entryDetails.uid)}>
                        Cancel
                    </Button>
                </TableCell>
            </StyledTableRow>
            <ApplyEditDialog open={openEditDialog} handleClose={() => setOpenEditDialog(false)} entry={entryDetails} offerUid={offerDetails.uid} />
        </>
    ) : null
}
