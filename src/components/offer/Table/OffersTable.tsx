import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, TableFooter, TablePagination } from "@mui/material"
import React, { useState } from "react"
import { primary } from "../../../utils/colors"
import { firestoreJobOffer, Order } from "../../../utils/interfaces"
import { getComparator } from "../../../utils/utils"
import { OffersTableRow } from "./OffersTableRow"

type offersTableProps = {
    offers: firestoreJobOffer[]
}
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
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(0)

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangePage = (e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage)
    }

    const handleRowsPerPage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
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
                    offers.slice().sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((offer) => (
                        <OffersTableRow offer={offer} key={offer.uid} />
                    ))
                }
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[10,25,50]}
                        colSpan={7}
                        count={offers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleRowsPerPage}
                    />
                </TableRow>
            </TableFooter>
        </Table>
    </TableContainer>
  )
}
