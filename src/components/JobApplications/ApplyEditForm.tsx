import { Box, Button, Grid, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useSetDoc } from "../../hooks/useSetDoc"
import { useValidateInputs } from "../../hooks/useValidateInputs"
import { firestoreEntry } from "../../utils/interfaces"

type ApplyEditFormProps = {
    entry: firestoreEntry;
    offerUid: string;
}

export const ApplyEditForm: React.FC<ApplyEditFormProps> = ({ entry, offerUid }) => {
    const {name, surname, introduce} = entry
    const [formData, setFormData] = useState<Partial<firestoreEntry>>({name, surname, introduce})

    const { validateData, inputErrors, errors, validated, setValidated } = useValidateInputs()
    const { setDocument } = useSetDoc()

    useEffect(() => {
      if(validated){
        if(errors) {
            setValidated(false)
            return
        }
        setDocument(`Offers/${offerUid}/entries`, formData, entry.uid)
        toast.success("Job apply edited successfuly. 🎉")
        setValidated(false)
      }
    }, [errors, validated])
    

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        validateData(formData)
    }

    const handleChange = (name: string, value: string) => {
        setFormData((prev: any) => (
            {
                ...prev,
                [name]: value
            }
        ))
    }

    return (
        <Box component="form" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                    <TextField
                        error={inputErrors?.name.error}
                        helperText={inputErrors?.name.text}
                        required
                        id="name"
                        name="name"
                        label="Name"
                        value={formData.name}
                        fullWidth
                        autoComplete="name"
                        variant="standard"
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <TextField
                        error={inputErrors?.surname.error}
                        helperText={inputErrors?.surname.text}
                        required
                        id="surname"
                        name="surname"
                        label="Surname"
                        value={formData.surname}
                        fullWidth
                        autoComplete="surname"
                        variant="standard"
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        multiline
                        maxRows={6}
                        minRows={4}
                        error={inputErrors?.introduce.error}
                        helperText={inputErrors?.introduce.text}
                        required
                        id="introduce"
                        name="introduce"
                        label="Introduce yourself"
                        value={formData.introduce}
                        fullWidth
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                </Grid>
            </Grid>
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
    )
}
