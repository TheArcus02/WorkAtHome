import { ArrowBack } from "@mui/icons-material"
import { Paper, TableContainer, Table, TableHead, Alert, Button, TableRow, TableCell, TableBody, TableFooter, TableSortLabel, TablePagination } from "@mui/material"
import { arrayRemove, arrayUnion, setDoc, where } from "firebase/firestore"
import moment from "moment"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useQuery } from "../../../hooks/useQuery"
import { useRealtimeCollection } from "../../../hooks/useRealtimeCollection"
import { useSetDoc } from "../../../hooks/useSetDoc"
import { primary } from "../../../utils/colors"
import { baseJobInfo, firestoreUser, Order } from "../../../utils/interfaces"
import { getComparator } from "../../../utils/utils"
import { Loader } from "../../Loader"
import { EmployeeTableRow } from "./EmployeeTableRow"

interface Data {
    name: string;
    role: string;
    salary: number;
    startedWork: string;
    uid: string;
}

interface headCell {
    id: keyof Data;
    label: string;
}

const headCells: readonly headCell[] = [
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'role',
        label: 'Role',
    },
    {
        id: 'salary',
        label: 'Salary',
    },
    {
        id: 'startedWork',
        label: 'Started Work'
    }
]
interface IfullJobInfo extends baseJobInfo {
    userUid: string
}
type EmployeesTableProps = {
    employees: string[],
    companyUid: string;
}


export const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees, companyUid }) => {

    const [order, setOrder] = useState<Order>('desc')
    const [orderBy, setOrderBy] = useState<keyof Data>('salary')
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [page, setPage] = useState(0)

    const [employeesDetails, setEmployeesDetails] = useState<Data[]>([])
    const [fullJobsInfo, setFullJobsInfo] = useState<IfullJobInfo[]>([])

    const navigate = useNavigate()
    const { setDocument } = useSetDoc()
    const { getRealtime, realtimeCollection, unsubscribe } = useRealtimeCollection()

    useEffect(() => {
        if (employees.length > 0) {
            getRealtime('Users', where('uid', 'in', employees))
        }
    }, [employees])

    useEffect(() => {
        if (realtimeCollection && employeesDetails.length === 0 && fullJobsInfo.length === 0) {
            realtimeCollection.forEach((res: any) => {
                const { name, surname, displayName, uid, jobs } = res.data() as firestoreUser
                const tableName = name && surname ? name + " " + surname : displayName
                const job = jobs.find((job) => job.companyUid === companyUid && job.current === true)
                if (job) {
                    const tableObject: Data = {
                        name: tableName,
                        role: job.title,
                        salary: job.salary,
                        startedWork: moment(job.startedAt.toDate()).calendar(),
                        uid
                    }
                    setFullJobsInfo((prev) => [...prev, { ...job, userUid: uid }])
                    setEmployeesDetails((prev) => [...prev, tableObject])
                }
            })
        }
        if(employeesDetails.length !== 0 && fullJobsInfo.length !== 0)
        return () => {
            setEmployeesDetails([])
            setFullJobsInfo([])
        }
    }, [realtimeCollection, employeesDetails, fullJobsInfo])

    useEffect(() => {
        if (unsubscribe)
            return () => unsubscribe()
    }, [unsubscribe])

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

    const findUserJob = (userUid: string) => {
        const job: IfullJobInfo | undefined = fullJobsInfo.find((job) => job.userUid === userUid)
        return job
    }
    const handleSalaryChange = (newSalary: number, userUid: string) => {
        const job = findUserJob(userUid)
        if (job) {
            const { userUid, ...baseInfo } = job
            const newObj: baseJobInfo = {
                ...baseInfo,
                salary: newSalary
            }
            setDocument("Users", { jobs: arrayRemove(baseInfo) }, userUid)
            setDocument("Users", { jobs: arrayUnion(newObj) }, userUid)
        }
    }

    const handleFire = (empUid: string) => {
        
        const job = findUserJob(empUid)
        if(job){

            // set job current status as false and add ended at prop
            const { userUid, ...baseInfo} = job
            const newObj: baseJobInfo = {
                ...baseInfo,
                current: false,
                endedAt: new Date()
            }
            setDocument("Users", {jobs: arrayRemove(baseInfo)}, empUid)
            setDocument("Users", {jobs: arrayUnion(newObj)}, empUid)
            
            // remove employee from company
            setDocument("Companies", {employees: arrayRemove(empUid)} , companyUid)
            toast.success("Employee has been fired.")
        } else {
            toast.error("Cannot find user job.")
        }
        

    }

    return employees.length > 0 ? (
        employeesDetails ? (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ background: primary }}>
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
                            <TableCell>Profile</TableCell>
                            <TableCell colSpan={2} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            employeesDetails.slice().sort(getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((emp, index) => (
                                    <EmployeeTableRow 
                                        employee={emp} 
                                        onSalaryChange={handleSalaryChange} 
                                        onFire={handleFire}    
                                        key={emp.uid + index} 
                                    />
                                ))
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[25, 50, 100]}
                                colSpan={7}
                                count={employees.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>) : (
            <Loader />
        )
    ) : (
        <Alert
            severity='info'
            sx={{ mt: 2, p: 2 }}
            action={
                <Button
                    startIcon={<ArrowBack />}
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => navigate(-1)}
                >
                    Go back
                </Button>
            }
        >
            This company dosen't have any employees.
        </Alert>
    )
}
