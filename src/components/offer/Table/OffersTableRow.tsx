import { Button, TableCell, TableRow } from "@mui/material"
import { styled } from "@mui/styles"
import moment from "moment"
import { firestoreJobOffer } from "../../../utils/interfaces"

type tableRowProps = {
    offer: firestoreJobOffer
}
export const OffersTableRow:React.FC<tableRowProps> = ({ offer }) => {

    const StyledTableRow = styled(TableRow)(({ theme }:any) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
          border: 0,
        },
    }));

    return (
        <StyledTableRow>
            <TableCell>{offer.title}</TableCell>
            <TableCell>{offer.companyName}</TableCell>
            <TableCell>{offer.seniority}</TableCell>
            <TableCell>{moment(offer.createdAt.toDate()).calendar()}</TableCell>
            <TableCell>{offer.entriesCounter}</TableCell>
            <TableCell>
                <Button variant="contained" color="primary">
                    Edit
                </Button>
            </TableCell>
            <TableCell>
                <Button variant="contained" color="secondary">
                    Entries
                </Button>
            </TableCell>
        </StyledTableRow>
    )
}
