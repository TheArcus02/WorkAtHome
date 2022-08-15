import { Dialog, DialogTitle, DialogContent, Box, TextField, Button } from "@mui/material"
import { useEffect, useState } from "react";
import { firestoreEntry } from "../../../utils/interfaces";

type SalaryDialogProps = {
    open: boolean;
    handleClose: () => void;
    onSubmit: (entry: firestoreEntry, salary: number) => void;
    minSalary: number;
    maxSalary: number;
    entry: firestoreEntry;
}


export const SalaryDialog: React.FC<SalaryDialogProps> = ({ open, handleClose, onSubmit, minSalary, maxSalary, entry }) => {

    const [salary, setSalary] = useState<number>(maxSalary)
    const [error, setError] = useState<string>('')

    useEffect(() => {
      if(salary < minSalary){
        setError('Salary is lower than provided in offer.')
      } else if(salary > maxSalary){
        setError('Salary is higher than provided in offer.')
      } else {
        setError('')
      }
    }, [salary])
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(salary){
            onSubmit(entry, salary)
        } else {
            setError("Provide salary.")
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{ elevation: 1 }}
        >
            <DialogTitle>
                Set Salary ( In your offer salary range is {minSalary + ' - ' + maxSalary} )
            </DialogTitle>
            <DialogContent>
                <Box component="form" noValidate onSubmit={handleSubmit} mt={2} sx={{display:'flex', flexDirection: 'column', }}>
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
