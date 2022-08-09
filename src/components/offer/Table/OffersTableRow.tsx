import { Article, Edit } from "@mui/icons-material"
import { Button, TableCell, TableRow } from "@mui/material"
import { styled } from "@mui/styles"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import { firestoreJobOffer } from "../../../utils/interfaces"

type tableRowProps = {
    offer: firestoreJobOffer
}
export const OffersTableRow:React.FC<tableRowProps> = ({ offer }) => {

    const navigate = useNavigate()

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
                <Button variant="contained" color="primary" onClick={() => navigate(`/offer/${offer.uid}`)} startIcon={<Edit />}>
                    Edit
                </Button>
            </TableCell>
            <TableCell>
                <Button variant="contained" color="secondary" onClick={() => navigate(`/offer/${offer.uid}/entries`)} startIcon={<Article />}>
                    Entries
                </Button>
            </TableCell>
        </StyledTableRow>
    )
}
