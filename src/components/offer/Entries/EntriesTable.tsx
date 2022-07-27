import { ArrowBackOutlined } from "@mui/icons-material";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSetDoc } from "../../../hooks/useSetDoc";
import { primary } from "../../../utils/colors";
import { baseJobInfo, firestoreEntry, firestoreJobOffer, jobApplication, Order } from "../../../utils/interfaces";
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
  entries: firestoreEntry[];
  offer: firestoreJobOffer;
}

export const EntriesTable:React.FC<entriesTableProps> = ({entries, offer}) => {

  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<keyof Data>('createdAt')
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [page, setPage] = useState(0)

  const navigate = useNavigate()
  const { setDocument } = useSetDoc()

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

  const handleAprove = (entry: firestoreEntry) => {
    // set entry status as aproved
    setDocument(`Offers/${offer.uid}/entries/`, {approved: true}, entry.uid)

    // set offer status as inactive 
    setDocument('Offers', {active: false}, offer.uid)

    const { title, companyName, companyUid } = offer
    const jobInfo:baseJobInfo = {
        current: true,
        title,
        companyName,
        companyUid,
        startedAt: new Date(),
        endedAt: '', 
    }

    // set user info as hired, add new job 
    setDocument("Users", {
        hired: true, 
        jobs: arrayUnion(jobInfo), 
    }, entry.userUid)

    // removing job applies from users 
    // becouse offer is inactive now
    removeJobsApplies()

    // add new employee to company 
    setDocument("Companies", {employees: arrayUnion(entry.userUid)}, offer.companyUid)
    
    toast.success(`${entry.name} ${entry.surname} entry has beed aproved! Welcome your new employee.`)
    navigate(`/profile/${entry.userUid}`)
  }

  const removeJobsApplies = () => {
    entries.forEach((entry) => {
      const jobAplicationObj:jobApplication = {
        offerUid: offer.uid,
        entryUid: entry.uid
      }
      setDocument("Users", {jobApplications: arrayRemove(jobAplicationObj)}, entry.userUid)
    })
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{background: primary}}>
          <TableRow>
            <TableCell>
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBackOutlined />
              </IconButton>
            </TableCell>
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
              <EntriesTableRow entry={entry} handleAprove={handleAprove} offerUid={offer.uid} key={entry.createdAt + index} />
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
