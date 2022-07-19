import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";
import { useState } from "react";
import { primary } from "../../../utils/colors";
import { firestoreEntry, Order } from "../../../utils/interfaces";
import { getComparator } from "../../../utils/utils";
import { EntriesTableRow } from "./EntriesTableRow";


interface Data {
  name: string;
  surname: string;
  createdAt: string;
}

interface headCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly headCell[] = [
  {
      id: 'name',
      label: 'Name',
      numeric: false
  },
  {
      id: 'surname',
      label: 'Surname',
      numeric: false
  },
  {
      id: 'createdAt',
      label: 'Applied At',
      numeric: false
  },
]

type entriesTableProps = {
  entries: firestoreEntry[]
}

export const EntriesTable:React.FC<entriesTableProps> = ({entries}) => {

  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<keyof Data>('createdAt')
  const [rowsPerPage, setRowsPerPage] = useState(25)
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
  
 // TODO add approve reject buttons with (are you sure?) popup

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{background: primary}}>
          <TableRow>
            <TableCell />
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
            <TableCell>Profile</TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {
           entries.slice().sort(getComparator(order, orderBy))
           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
           .map((entry, index) => (
              <EntriesTableRow entry={entry} key={entry.createdAt + index} />
           ))
          }
        </TableBody>
        <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[25,50,100]}
                        colSpan={7}
                        count={entries.length}
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
