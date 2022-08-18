import { AccountBoxOutlined, CheckCircleOutline, HighlightOffOutlined, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import { Box, Button, Collapse, IconButton, TableCell, TableRow, Tooltip, Typography } from "@mui/material"
import { increment } from "firebase/firestore"
import moment from "moment"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useSetDoc } from "../../../hooks/useSetDoc"
import {firestoreEntry, firestoreJobOffer} from "../../../utils/interfaces"
import { CustomDialog } from "../../CustomDialog"
import { SalaryDialog } from "./SalaryDialog"

type entriesTableRowProps = {
    entry: firestoreEntry;
    offer: firestoreJobOffer;
    handleAprove: (entry: firestoreEntry, salary: number) => void;
}

export const EntriesTableRow:React.FC<entriesTableRowProps> = ({entry, offer, handleAprove}) => {

    const [openIntroduction, setOpenIntroduction] = useState(false)
    const [openAproveDialog, setOpenAproveDialog] = useState(false)
    const [openRejectDialog, setOpenRejectDialog] = useState(false)
    const [openSalaryDialog, setOpenSalaryDialog] = useState(false)

    const navigate = useNavigate()
    const {setDocument} = useSetDoc()

    const handleReject = () => {
        setDocument('Offers', {entriesCounter: increment(-1)}, offer.uid)
        setDocument(`Offers/${offer.uid}/entries/`, {rejected: true}, entry.uid).then(() => (
            toast.success(`${entry.name} ${entry.surname} apply has been rejected.`)
        )).catch((error) => (
            toast.error("Error has occured during setting rejection. ", error)
        ))
        setOpenRejectDialog(false)
    }

    const handleAproveDialogSubmit = () => {
        setOpenSalaryDialog(true)
        setOpenAproveDialog(false)
    }

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenIntroduction(!openIntroduction)}
                    >
                        {openIntroduction ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.surname}</TableCell>
                <TableCell>{moment(entry.createdAt.toDate()).calendar()}</TableCell>
                <TableCell>
                    <Tooltip title="Show profile">
                        <IconButton color="secondary" onClick={() => navigate(`/profile/${entry.userUid}`)}>
                            <AccountBoxOutlined />
                        </IconButton>
                    </Tooltip>
                    
                </TableCell>
                <TableCell>
                    <Button 
                        variant="outlined" 
                        color="success" 
                        size="small" 
                        endIcon={<CheckCircleOutline />}
                        onClick={() => setOpenAproveDialog(true)}
                    >
                        Aprove
                    </Button>
                </TableCell>
                <TableCell>
                    <Button 
                        variant="outlined" 
                        color="error" 
                        size="small" 
                        endIcon={<HighlightOffOutlined />}
                        onClick={() => setOpenRejectDialog(true)}

                    >
                        Reject
                    </Button>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={openIntroduction} timeout="auto" unmountOnExit>
                        <Box sx={{m:1}}>
                            <Typography variant="h6" gutterBottom>
                                Introduction
                            </Typography>
                            <Typography variant="body1">
                                {entry.introduce}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <CustomDialog 
                open={openAproveDialog} 
                dialogDescription={`The ${entry.name} ${entry.surname} entry status will be aproved and other entries status will be changed to rejected. Job offer will deactivate.`}
                dialogTitle="Are you sure?"
                handleClose={() => setOpenAproveDialog(false)}
                onSubmit={() => handleAproveDialogSubmit()}
            />
            <CustomDialog 
                open={openRejectDialog}
                dialogDescription={`The ${entry.name} ${entry.surname} entry will be set to rejected.`}
                dialogTitle="Are you sure?"
                handleClose={() => setOpenRejectDialog(false)}
                onSubmit={handleReject}
            />
            <SalaryDialog 
                open={openSalaryDialog}
                handleClose={() => setOpenSalaryDialog(false)}
                entry={entry}
                onSubmit={handleAprove}
                maxSalary={offer.maxSalary}
                minSalary={offer.minSalary}

            />
        </>
        
    )
}
