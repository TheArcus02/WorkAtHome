import { AccountBoxOutlined, AttachMoney, PersonOff } from "@mui/icons-material";
import { Button, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

type EmployeeTableRowProps = {
    employee: {
        name: string;
        role: string;
        salary: string;
        startedWork: string;
        uid: string;
    }
}

export const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({ employee }) => {

    const navigate = useNavigate()

    return (
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
                    // onClick={() => }
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
                    // onClick={() => }
                >
                    Fire
                </Button>
            </TableCell>
        </TableRow>
    )
}
