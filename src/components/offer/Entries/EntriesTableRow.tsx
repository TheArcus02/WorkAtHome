import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import { Box, Button, Collapse, IconButton, TableCell, TableRow, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import moment from "moment"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { firestoreEntry } from "../../../utils/interfaces"

type entriesTableRowProps = {
    entry: firestoreEntry
}

export const EntriesTableRow:React.FC<entriesTableRowProps> = ({entry}) => {

    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    const StyledTableRow = styled(TableRow)(({ theme }:any) => ({
        '&:nth-of-type(3n)': {
          backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
          border: 0,
        },
        
    }));
    // TODO prevent table from moving on collapsing 

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.surname}</TableCell>
                <TableCell>{moment(entry.createdAt.toDate()).calendar()}</TableCell>
                <TableCell>
                    <Button variant="contained" color="primary" onClick={() => navigate(`/profile/${entry.userUid}`)}>
                        Profile
                    </Button>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
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
        </>
        
    )
}
