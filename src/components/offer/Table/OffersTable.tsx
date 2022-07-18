import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from "@mui/material"
import { useState } from "react"
import { primary } from "../../../utils/colors"
import { firestoreJobOffer } from "../../../utils/interfaces"
import { OffersTableRow } from "./OffersTableRow"

type offersTableProps = {
    offers: firestoreJobOffer[]
}
type Order = "desc" | "asc"
interface Data {
    title: string;
    companyName: string;
    seniority: string;
    createdAt: string;
    entriesCounter: number;
}
interface headCell {
    id: keyof Data;
    label: string;
    numeric: boolean;
}
const headCells: readonly headCell[] = [
    {
        id: 'title',
        label: 'Title',
        numeric: false
    },
    {
        id: 'companyName',
        label: 'Company',
        numeric: false
    },
    {
        id: 'seniority',
        label: 'Seniority',
        numeric: false
    },
    {
        id: 'createdAt',
        label: 'Created At',
        numeric: false
    },
    {
        id:'entriesCounter',
        label:'Entries',
        numeric: true
    }
]

export const OffersTable:React.FC<offersTableProps> = ({ offers }) => {
    
    
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<keyof Data>('companyName')

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
    }

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key,
      ): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
      ) => number {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
    }

    return (
    <TableContainer component={Paper}>
        <Table>
            <TableHead sx={{background: primary}}>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={(e) => handleRequestSort(e, headCell.id)}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                    
                    <TableCell ></TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    offers.slice().sort(getComparator(order, orderBy)).map((offer, index) => (
                        <OffersTableRow offer={offer} />
                    ))
                }
                
            </TableBody>
        </Table>
    </TableContainer>
  )
}
