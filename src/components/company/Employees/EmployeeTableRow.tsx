import { AccountBoxOutlined, AttachMoney, PersonOff } from "@mui/icons-material";
import { Button, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmpSalaryDialog } from "./EmpSalaryDialog";
import { CustomDialog } from "../../CustomDialog"

type EmployeeTableRowProps = {
    employee: {
        name: string;
        role: string;
        salary: number;
        startedWork: string;
        uid: string;
    }
    onSalaryChange: (newSalary: number, userUid: string) => void
    onFire: (empUid: string) => void
}

export const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({ employee, onSalaryChange, onFire }) => {
    
    const [openSalaryDialog, setOpenSalaryDialog] = useState(false)
    const [openFireDialog, setOpenFireDialog] = useState(false)
    
    const navigate = useNavigate()
    
    return (
        <>
            <TableRow>
                {Object.entries(employee).map(([name, value], index) => (
                    name !== 'uid' ? <TableCell key={name + index}>{value}</TableCell> : null
                ))}
                <TableCell>
                    <Tooltip title="Show profile">
                        <IconButton color="secondary" onClick={() => navigate(`/profile/${employee.uid}`)}>
                            <AccountBoxOutlined />
                        </IconButton>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        endIcon={<AttachMoney />}
                        onClick={() => setOpenSalaryDialog(true)}
                    >
                        Change Salary
                    </Button>
                </TableCell>
                <TableCell>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        endIcon={<PersonOff />}
                        onClick={() => setOpenFireDialog(true)}
                    >
                        Fire
                    </Button>
                </TableCell>
            </TableRow>
            <EmpSalaryDialog
                currentSalary={employee.salary}
                handleClose={() => setOpenSalaryDialog(false)}
                onSubmit={onSalaryChange}
                open={openSalaryDialog}
                userUid={employee.uid}
            />
            <CustomDialog 
                open={openFireDialog}
                dialogTitle={"Are you sure ?"}
                dialogDescription={`Do you want to fire ${employee.name} ?`}
                handleClose={() => setOpenFireDialog(false)}
                onSubmit={() => onFire(employee.uid)}
            />
        </>
    )
}
