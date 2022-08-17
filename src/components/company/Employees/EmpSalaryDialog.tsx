import { Dialog, DialogTitle, DialogContent, Box, TextField, Button } from "@mui/material"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type SalaryDialogProps = {
    open: boolean;
    handleClose: () => void;
    onSubmit: (newSalary: number, userUid: string) => void;
    currentSalary: number;
    userUid: string;
}

export const EmpSalaryDialog: React.FC<SalaryDialogProps> = ({ open, handleClose, onSubmit, currentSalary, userUid }) => {
    const [salary, setSalary] = useState<number>(currentSalary)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        if (salary) {
            if (salary < 1) {
                setError("Provieded salary is too small. 💸")
            } else {
                setError('')
            }
        } else {
            setError("Provide salary.")
        }

    }, [salary])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(salary){
            if(salary === currentSalary){
                toast.warning("Salary hasn't changed.")
                setError("Salary hasn't changed.")
            } else if( error.length === 0){
                onSubmit(salary, userUid)
            }
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{ elevation: 1 }}
        >
            <DialogTitle>
                💰 Change Salary (current: {currentSalary} PLN)
            </DialogTitle>
            <DialogContent>
                <Box component="form" noValidate onSubmit={handleSubmit} mt={2} sx={{ display: 'flex', flexDirection: 'column', }}>
                    <TextField
                        color={error.length > 0 ? "warning" : undefined}
                        name="salary"
                        label="Set Salary"
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(parseInt(e.target.value))}
                        InputProps={{ inputProps: { min: 1 } }}
                        helperText={error}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ mt: 3, ml: 1, color: '#fff' }}
                            color="success"
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
